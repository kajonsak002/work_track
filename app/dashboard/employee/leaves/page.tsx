"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

interface LeaveBalance {
    leave_type_id: number;
    leave_type_name: string;
    total_days: number;
    used_days: number;
    remaining_days: number;
}

interface LeaveRequest {
    id: number;
    leave_type_name: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reject_reason?: string;
    created_at: string;
}

interface LeaveType {
    id: number;
    name: string;
}

export default function LeavePage() {
    const [balances, setBalances] = useState<LeaveBalance[]>([]);
    const [history, setHistory] = useState<LeaveRequest[]>([]);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
    });

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    const token = Cookies.get('token');

    const fetchData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [balanceRes, historyRes, typesRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest/my-balance`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest/my-history?year=${selectedYear}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${process.env.NEXT_PUBLIC_API}/leaveType`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (balanceRes.ok) setBalances(await balanceRes.json());
            if (historyRes.ok) setHistory(await historyRes.json());
            if (typesRes.ok) setLeaveTypes(await typesRes.json());

        } catch (error) {
            console.error("Error fetching data", error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load data' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculateDays = (start: string, end: string) => {
        if (!start || !end) return 0;
        const s = new Date(start);
        const e = new Date(end);
        const diffTime = Math.abs(e.getTime() - s.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.leave_type_id || !formData.start_date || !formData.end_date || !formData.reason) {
            Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ครบถ้วน', text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
            return;
        }

        const requestedDays = calculateDays(formData.start_date, formData.end_date);
        const selectedType = balances.find(b => b.leave_type_id === parseInt(formData.leave_type_id));

        if (selectedType && requestedDays > selectedType.remaining_days) {
            Swal.fire({
                icon: 'warning',
                title: 'วันลาไม่เพียงพอ',
                text: `คุณมีวันลาคงเหลือ ${selectedType.remaining_days} วัน แต่ต้องการลา ${requestedDays} วัน`
            });
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'บันทึกคำขอลาเรียบร้อยแล้ว' });
                setFormData({ leave_type_id: '', start_date: '', end_date: '', reason: '' });
                fetchData(); // Refresh data
            } else {
                throw new Error(data.message || 'Failed to submit');
            }
        } catch (error: any) {
            Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: error.message });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'green';
            case 'REJECTED': return 'red';
            default: return 'amber';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'อนุมัติ';
            case 'REJECTED': return 'ไม่อนุมัติ';
            default: return 'รอตรวจสอบ';
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">จัดการการลางาน</h1>

            {/* Leave Balances Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {balances.map((item) => (
                    <div key={item.leave_type_id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                📅
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">วันลาคงเหลือ ({item.leave_type_name})</p>
                                <h3 className="text-xl font-bold text-slate-900">{item.remaining_days} วัน</h3>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.total_days ? (item.remaining_days / item.total_days * 100) : 0}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">ใช้ไปแล้ว {item.used_days} จาก {item.total_days} วัน</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Leave Request Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm sticky top-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">ยื่นใบลา</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ประเภทการลา</label>
                                <select
                                    name="leave_type_id"
                                    value={formData.leave_type_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                >
                                    <option value="">-- เลือกประเภทการลา --</option>
                                    {leaveTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">วันที่เริ่มลา</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ถึงวันที่</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">เหตุผล</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    placeholder="ระบุสาเหตุการลา..."
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-all"
                            >
                                ส่งคำขอลา
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-800">ประวัติการลา</h3>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">วันที่ทำรายการ</th>
                                        <th className="px-6 py-3 font-medium">ประเภท</th>
                                        <th className="px-6 py-3 font-medium">วันที่ลา</th>
                                        <th className="px-6 py-3 font-medium">เหตุผล</th>
                                        <th className="px-6 py-3 font-medium text-right">สถานะ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan={5} className="px-6 py-4 text-center">กำลังโหลด...</td></tr>
                                    ) : history.length > 0 ? (
                                        history.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(req.created_at).toLocaleDateString('th-TH')}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-slate-900">
                                                    {req.leave_type_name}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {new Date(req.start_date).toLocaleDateString('th-TH')} - {new Date(req.end_date).toLocaleDateString('th-TH')}
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                                                    {req.reason}
                                                    {req.reject_reason && <div className="text-red-500 text-xs mt-1">เหตุผลที่ไม่อนุมัติ: {req.reject_reason}</div>}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(req.status)}-100 text-${getStatusColor(req.status)}-800`}>
                                                        {getStatusText(req.status)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">ไม่มีประวัติการลา</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}