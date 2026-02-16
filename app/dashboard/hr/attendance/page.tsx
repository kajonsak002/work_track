"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function DailyAttendancePage() {
    // Default to today
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState<'all' | 'late'>('all');
    const [attedanceData, setAttendanceData] = useState<any[]>([]);
    const [lateData, setLateData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const token = Cookies.get('token');

    useEffect(() => {
        fetchData();
    }, [date, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'all') {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/daily?date=${date}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAttendanceData(data.report.records || []);
                }
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/daily-late?date=${date}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setLateData(data.report.late_employees || []);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const displayData = activeTab === 'all' ? attedanceData : lateData;

    // Helper to format Thai Date
    const formatThaiDate = (dateString: string) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        return d.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return '-';
        const d = new Date(timeString);
        return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">ตรวจสอบเวลาเข้า-ออก</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        รายงานการเข้างานประจำวันที่ {formatThaiDate(date)}
                    </p>
                </div>
                <div>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        เข้า-ออกงานทั้งหมด
                    </button>
                    <button
                        onClick={() => setActiveTab('late')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'late'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                            }`}
                    >
                        เข้างานสาย

                    </button>
                </nav>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">รหัสพนักงาน</th>
                                <th className="px-6 py-3 font-medium">ชื่อ-นามสกุล</th>
                                <th className="px-6 py-3 font-medium">เวลาเข้า</th>
                                <th className="px-6 py-3 font-medium">เวลาออก</th>
                                <th className="px-6 py-3 font-medium text-right">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="px-6 py-4 text-center">กำลังโหลดข้อมูล...</td></tr>
                            ) : displayData.length > 0 ? (
                                displayData.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{record.employee_code}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{record.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{formatTime(record.in_time)}</td>
                                        <td className="px-6 py-4 text-slate-600">{formatTime(record.out_time)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${record.status === 'สาย' || activeTab === 'late' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                {record.status || (activeTab === 'late' ? 'สาย' : 'ปกติ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-500">ไม่พบข้อมูล</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
