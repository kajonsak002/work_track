"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const fetchAttendance = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        setLoading(true);
        try {
            // Fetch with limit 100 to get all days in month
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/my?page=1&limit=100&month=${selectedMonth}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setAttendance(data.data || []);
            } else {
                setAttendance([]); // Clear attendance if fetch fails or no data
            }
        } catch (error) {
            console.error("Failed to fetch attendance", error);
            setAttendance([]); // Clear attendance on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedMonth]);

    const months = [
        { value: 1, label: 'มกราคม' },
        { value: 2, label: 'กุมภาพันธ์' },
        { value: 3, label: 'มีนาคม' },
        { value: 4, label: 'เมษายน' },
        { value: 5, label: 'พฤษภาคม' },
        { value: 6, label: 'มิถุนายน' },
        { value: 7, label: 'กรกฎาคม' },
        { value: 8, label: 'สิงหาคม' },
        { value: 9, label: 'กันยายน' },
        { value: 10, label: 'ตุลาคม' },
        { value: 11, label: 'พฤศจิกายน' },
        { value: 12, label: 'ธันวาคม' }
    ];


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">ประวัติการลงเวลา</h1>
                    <p className="text-slate-500 text-sm mt-1">รายงานการเข้า-ออกงานประจำเดือน</p>
                </div>

                <div className="flex gap-2">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {months.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">วันที่</th>
                                <th className="px-6 py-3 font-medium">เข้างาน</th>
                                <th className="px-6 py-3 font-medium">เวลาออก</th>
                                <th className="px-6 py-3 font-medium text-right">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
                                        กำลังโหลดข้อมูล...
                                    </td>
                                </tr>
                            ) : attendance.length > 0 ? (
                                attendance.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{row.date}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.in}</td>
                                        <td className="px-6 py-4 text-slate-600">{row.out}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${row.statusColor}-100 text-${row.statusColor}-800`}>
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-slate-500">
                                        ไม่พบข้อมูลประวัติการลงเวลาในเดือนนี้
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}