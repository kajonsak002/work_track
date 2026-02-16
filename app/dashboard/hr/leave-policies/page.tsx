"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

interface LeaveType {
    id: number;
    name: string;
}

interface LeavePolicy {
    id: number;
    year: number;
    leave_type_id: number;
    leave_type_name: string;
    total_days: number;
}

export default function LeavePoliciesPage() {
    const [policies, setPolicies] = useState<LeavePolicy[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const [year, setYear] = useState(new Date().getFullYear());
    const [leaveTypeId, setLeaveTypeId] = useState<number | ''>('');
    const [totalDays, setTotalDays] = useState(0);

    const token = Cookies.get('token');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPolicies, resTypes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API}/leavePolicy`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API}/leaveType`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (resPolicies.ok) {
                const data = await resPolicies.json();
                setPolicies(data || []);
            }
            if (resTypes.ok) {
                const data = await resTypes.json();
                setLeaveTypes(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API}/leavePolicy/${editId}`
                : `${process.env.NEXT_PUBLIC_API}/leavePolicy`;

            const method = editId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    year,
                    leave_type_id: Number(leaveTypeId),
                    total_days: Number(totalDays)
                })
            });

            if (res.ok) {
                Swal.fire('Success', 'บันทึกข้อมูลเรียบร้อย', 'success');
                setShowModal(false);
                fetchData();
            } else {
                const error = await res.json();
                Swal.fire('Error', error.message || 'บันทึกไม่สำเร็จ', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Server Error', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลจะไม่สามารถกู้คืนได้",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'ลบข้อมูล'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/leavePolicy/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    Swal.fire('Deleted!', 'ลบข้อมูลเรียบร้อย', 'success');
                    fetchData();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">กำหนดสิทธิ์การลาประจำปี</h1>
                <button
                    onClick={() => {
                        setYear(new Date().getFullYear());
                        setLeaveTypeId('');
                        setTotalDays(0);
                        setEditId(null);
                        setShowModal(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    + เพิ่มสิทธิ์การลา
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-3 font-medium">ปี (พ.ศ.)</th>
                            <th className="px-6 py-3 font-medium">ประเภทการลา</th>
                            <th className="px-6 py-3 font-medium">จำนวนวันสูงสุด</th>
                            <th className="px-6 py-3 font-medium text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-4 text-center">กำลังโหลด...</td></tr>
                        ) : policies.length > 0 ? (
                            policies.map((policy) => (
                                <tr key={policy.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{policy.year + 543}</td>
                                    <td className="px-6 py-4">{policy.leave_type_name}</td>
                                    <td className="px-6 py-4 font-medium text-blue-600">{policy.total_days} วัน</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => {
                                                setYear(policy.year);
                                                setLeaveTypeId(policy.leave_type_id);
                                                setTotalDays(policy.total_days);
                                                setEditId(policy.id);
                                                setShowModal(true);
                                            }}
                                            className="text-yellow-600 hover:text-yellow-900 font-medium"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(policy.id)}
                                            className="text-red-600 hover:text-red-900 font-medium"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-500">ไม่พบข้อมูล</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">{editId ? 'แก้ไขสิทธิ์การลา' : 'เพิ่มสิทธิ์การลา'}</h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ปี (ค.ศ.)</label>
                                <input
                                    type="number"
                                    required
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">ตรงกับ พ.ศ. {year + 543}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทการลา</label>
                                <select
                                    required
                                    value={leaveTypeId}
                                    onChange={(e) => setLeaveTypeId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">เลือกประเภท</option>
                                    {leaveTypes.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">จำนวนวัน (ต่อปี)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={totalDays}
                                    onChange={(e) => setTotalDays(Number(e.target.value))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    บันทึก
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
