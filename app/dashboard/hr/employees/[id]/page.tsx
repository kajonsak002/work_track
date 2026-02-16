"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useParams, useRouter } from 'next/navigation';

export default function EmployeeDetailPage() {
    const params = useParams();
    const employeeId = params.id as string;
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'attendance' | 'leaves'>('profile');

    // Attendance States
    const [attendance, setAttendance] = useState<any[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    // Leave States
    const [leaves, setLeaves] = useState<any[]>([]);
    const [leaveYear, setLeaveYear] = useState(new Date().getFullYear());

    const token = Cookies.get('token');
    const router = useRouter();

    useEffect(() => {
        fetchEmployeeProfile();
    }, [employeeId]);

    useEffect(() => {
        if (activeTab === 'attendance') fetchAttendance();
        if (activeTab === 'leaves') fetchLeaves();
    }, [activeTab, selectedMonth, leaveYear]);

    const fetchEmployeeProfile = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/employee/${employeeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEmployee(data.employee);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            // Fetch all recent records (limit 500)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/employee/${employeeId}?limit=500`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAttendance(data.records || []);
            } else {
                setAttendance([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchLeaves = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest/employee/${employeeId}?year=${leaveYear}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeaves(data.leaves || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const thaiMonthsShort = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const filteredAttendance = attendance.filter(record => {
        const monthStr = thaiMonthsShort[selectedMonth - 1];
        return record.date && record.date.includes(monthStr);
    });

    if (loading) return <div>Loading...</div>;
    if (!employee) return <div>ไม่พบข้อมูลพนักงาน</div>;

    const months = [
        { value: 1, label: 'มกราคม' }, { value: 2, label: 'กุมภาพันธ์' }, { value: 3, label: 'มีนาคม' },
        { value: 4, label: 'เมษายน' }, { value: 5, label: 'พฤษภาคม' }, { value: 6, label: 'มิถุนายน' },
        { value: 7, label: 'กรกฎาคม' }, { value: 8, label: 'สิงหาคม' }, { value: 9, label: 'กันยายน' },
        { value: 10, label: 'ตุลาคม' }, { value: 11, label: 'พฤศจิกายน' }, { value: 12, label: 'ธันวาคม' }
    ];

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="text-slate-500 hover:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{employee.name}</h1>
                    <p className="text-slate-500 text-sm">รหัส: {employee.employee_code} | ตำแหน่ง: {employee.role}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        ข้อมูลส่วนตัว
                    </button>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'attendance'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        ประวัติการเข้า-ออกงาน
                    </button>
                    <button
                        onClick={() => setActiveTab('leaves')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'leaves'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        ประวัติการลา
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-semibold text-lg mb-4">ข้อมูลเบื้องต้น</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-semibold">ชื่อ-นามสกุล</label>
                            <p className="text-slate-900 font-medium mt-1">{employee.name}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-semibold">อีเมล</label>
                            <p className="text-slate-900 font-medium mt-1">{employee.email || '-'}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-semibold">ตำแหน่ง</label>
                            <p className="text-slate-900 font-medium mt-1">{employee.role}</p>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 uppercase font-semibold">วันที่สร้างบัญชี</label>
                            <p className="text-slate-900 font-medium mt-1">{new Date(employee.created_at).toLocaleDateString('th-TH')}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'attendance' && (
                <div className="space-y-4">
                    <div className="flex gap-2 p-4 bg-white rounded-xl border border-slate-200">
                        <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                            {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">วันที่</th>
                                    <th className="px-6 py-3 font-medium">เข้างาน</th>
                                    <th className="px-6 py-3 font-medium">ออกงาน</th>
                                    <th className="px-6 py-3 font-medium">ชั่วโมงทำงาน</th>
                                    <th className="px-6 py-3 font-medium text-right">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAttendance.length > 0 ? (
                                    filteredAttendance.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{row.date}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.in}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.out}</td>
                                            <td className="px-6 py-4 text-slate-600">{row.hours}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${row.statusColor}-100 text-${row.statusColor}-800`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">ไม่พบข้อมูล</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'leaves' && (
                <div className="space-y-4">
                    <div className="flex gap-2 p-4 bg-white rounded-xl border border-slate-200">
                        <select
                            value={leaveYear}
                            onChange={(e) => setLeaveYear(Number(e.target.value))}
                            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">ประเภท</th>
                                    <th className="px-6 py-3 font-medium">วันที่ลา</th>
                                    <th className="px-6 py-3 font-medium">จำนวนวัน</th>
                                    <th className="px-6 py-3 font-medium">เหตุผล</th>
                                    <th className="px-6 py-3 font-medium text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {leaves.length > 0 ? (
                                    leaves.map((leave, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-medium text-slate-900">{leave.leave_type_name}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {new Date(leave.start_date).toLocaleDateString('th-TH')} - {new Date(leave.end_date).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {Math.ceil((new Date(leave.end_date).getTime() - new Date(leave.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1} วัน
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{leave.reason}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                    ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                        leave.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">ไม่พบประวัติการลา</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
