"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

interface LeaveRequest {
    id: number;
    employee_id: number;
    employee_code?: string;
    employee_name?: string;
    leave_type_id: number;
    leave_type_name: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reject_reason?: string;
}

export default function LeaveApprovalPage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    const token = Cookies.get('token');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeaves(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        const result = await Swal.fire({
            title: 'ยืนยันการอนุมัติ?',
            text: "คุณต้องการอนุมัติคำขอลาใช่หรือไม่",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'อนุมัติ',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#10b981'
        });

        if (result.isConfirmed) {
            await updateStatus(id, 'APPROVED');
        }
    };

    const handleReject = async (id: number) => {
        const result = await Swal.fire({
            title: 'ไม่อนุมัติคำขอลา',
            input: 'text',
            inputLabel: 'ระบุสาเหตุการไม่อนุมัติ',
            inputPlaceholder: 'กรอกสาเหตุ...',
            showCancelButton: true,
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#ef4444',
            inputValidator: (value) => {
                if (!value) {
                    return 'กรุณาระบุสาเหตุ!';
                }
            }
        });

        if (result.isConfirmed) {
            await updateStatus(id, 'REJECTED', result.value);
        }
    };

    const updateStatus = async (id: number, status: string, reason?: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, reject_reason: reason })
            });

            if (res.ok) {
                await Swal.fire('สำเร็จ', status === 'APPROVED' ? 'อนุมัติเรียบร้อย' : 'ปฏิเสธคำขอเรียบร้อย', 'success');
                fetchLeaves();
            } else {
                await Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกสถานะได้', 'error');
            }
        } catch (error) {
            console.error(error);
            await Swal.fire('Error', 'Server Error', 'error');
        }
    };

    // Filter leaves based on active tab
    const displayLeaves = leaves.filter(l => l.status === activeTab);

    // Format Date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    // Calculate duration helper
    const getDuration = (start: string, end: string) => {
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
        return days;
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">จัดการคำร้องขอลา</h1>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setActiveTab(status as any)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === status
                                ? status === 'PENDING' ? 'border-blue-500 text-blue-600'
                                    : status === 'APPROVED' ? 'border-green-500 text-green-600'
                                        : 'border-red-500 text-red-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            {status === 'PENDING' ? 'รออนุมัติ' : status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}
                            <span className={`py-0.5 px-2.5 rounded-full text-xs ${leaves.filter(l => l.status === status).length > 0
                                ? status === 'PENDING' ? 'bg-blue-100 text-blue-600'
                                    : status === 'APPROVED' ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                : 'bg-slate-100 text-slate-500'
                                }`}>
                                {leaves.filter(l => l.status === status).length}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">พนักงาน</th>
                                <th className="px-6 py-3 font-medium">ประเภทการลา</th>
                                <th className="px-6 py-3 font-medium">วันที่ลา</th>
                                <th className="px-6 py-3 font-medium">จำนวนวัน</th>
                                <th className="px-6 py-3 font-medium">เหตุผล</th>
                                {activeTab === 'REJECTED' && <th className="px-6 py-3 font-medium">เหตุผลไม่อนุมัติ</th>}
                                <th className="px-6 py-3 font-medium text-right">สถานะ / การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-4 text-center">กำลังโหลดข้อมูล...</td></tr>
                            ) : displayLeaves.length > 0 ? (
                                displayLeaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            <div>
                                                <p className="font-semibold">{leave.employee_name || '-'}</p>
                                                <p className="text-xs text-slate-500">{leave.employee_code || `EMP-${leave.employee_id}`}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700">{leave.leave_type_name}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {getDuration(leave.start_date, leave.end_date)} วัน
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={leave.reason}>
                                            {leave.reason}
                                        </td>
                                        {activeTab === 'REJECTED' && (
                                            <td className="px-6 py-4 text-red-600">{leave.reject_reason || '-'}</td>
                                        )}
                                        <td className="px-6 py-4 text-right">
                                            {leave.status === 'PENDING' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(leave.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                                                    >
                                                        อนุมัติ
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(leave.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                                                    >
                                                        ไม่อนุมัติ
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {leave.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ไม่อนุมัติ'}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={7} className="px-6 py-4 text-center text-slate-500">ไม่พบรายการ</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}