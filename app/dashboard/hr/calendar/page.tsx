"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function LeaveCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [leaves, setLeaves] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [selectedDateDetails, setSelectedDateDetails] = useState<{ date: string, leaves: any[] } | null>(null);

    const token = Cookies.get('token');


    useEffect(() => {
        fetchLeaves();
    }, []);


    const fetchLeaves = async () => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API}/leaveRequest?limit=500`;
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                const fetchedLeaves = data || [];
                setLeaves(fetchedLeaves);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const getLeavesForDay = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return leaves.filter(l => {
            const d = new Date(dateStr);
            d.setHours(0, 0, 0, 0);
            const start = new Date(l.start_date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(l.end_date);
            end.setHours(0, 0, 0, 0);
            return d >= start && d <= end;
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">ปฏิทินการลางาน</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        เดือน {thaiMonths[month]} {year + 543}
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden">
                        <button onClick={prevMonth} className="px-3 py-2 hover:bg-slate-50 border-r border-slate-200">
                            &lt;
                        </button>
                        {/* <button onClick={() => setCurrentDate(new Date())} className="px-3 py-2 hover:bg-slate-50 text-sm font-medium">
                            วันนี้
                        </button> */}
                        <button onClick={nextMonth} className="px-3 py-2 hover:bg-slate-50 border-l border-slate-200">
                            &gt;
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                    {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => (
                        <div key={d} className="py-3 text-center text-sm font-semibold text-slate-500">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 auto-rows-fr">
                    {/* Empty cells for prev month */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-slate-100 bg-slate-50/30"></div>
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayLeaves = getLeavesForDay(day);
                        const isToday =
                            day === new Date().getDate() &&
                            month === new Date().getMonth() &&
                            year === new Date().getFullYear();

                        const handleDayClick = () => {
                            const dateStr = `${day} ${thaiMonths[month]} ${year + 543}`;
                            setSelectedDateDetails({ date: dateStr, leaves: dayLeaves });
                        };

                        return (
                            <div key={day} onClick={handleDayClick} className={`min-h-[100px] p-2 border-b border-r border-slate-100 relative group transition-colors hover:bg-slate-50 cursor-pointer ${isToday ? 'bg-blue-50/30' : ''}`}>
                                <span className={`text-sm font-medium ${isToday ? 'text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full' : 'text-slate-700'}`}>
                                    {day}
                                </span>

                                <div className="mt-1 space-y-1">
                                    {dayLeaves.map((leave, idx) => {
                                        let colorClass = 'bg-slate-100 text-slate-600 border-slate-200';
                                        if (leave.status === 'APPROVED') colorClass = 'bg-green-100 text-green-700 border-green-200';
                                        else if (leave.status === 'PENDING') colorClass = 'bg-orange-100 text-orange-700 border-orange-200';
                                        else if (leave.status === 'REJECTED') colorClass = 'bg-red-100 text-red-700 border-red-200';

                                        return (
                                            <div
                                                key={`${day}-${idx}`}
                                                className={`text-[10px] px-1.5 py-0.5 rounded truncate cursor-help border ${colorClass}`}
                                                title={`${leave.employee_name || 'พนักงาน'}: ${leave.leave_type_name} (${leave.status})`}
                                            >
                                                {leave.employee_name || leave.employee_code}
                                            </div>
                                        );
                                    })}
                                    {dayLeaves.length > 3 && (
                                        <div className="text-[10px] text-slate-400 pl-1">
                                            +{dayLeaves.length - 3} รายการ
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>อนุมัติแล้ว</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span>รออนุมัติ</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>ไม่อนุมัติ</span>
                </div>
            </div>

            {/* Day Details Modal */}
            {selectedDateDetails && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedDateDetails(null)}>
                    <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">
                                รายการลาประจำวันที่ {selectedDateDetails.date}
                            </h3>
                            <button
                                onClick={() => setSelectedDateDetails(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-0 max-h-[60vh] overflow-y-auto">
                            {selectedDateDetails.leaves.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {selectedDateDetails.leaves.map((leave: any, idx: number) => (
                                        <div key={idx} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white
                                                    ${leave.status === 'APPROVED' ? 'bg-green-500' :
                                                        leave.status === 'PENDING' ? 'bg-orange-500' : 'bg-red-500'}`
                                                }>
                                                    {(leave.employee_name || leave.employee_code || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{leave.employee_name || leave.employee_code}</p>
                                                    <p className="text-xs text-slate-500">{leave.leave_type_name}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold
                                                    ${leave.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        leave.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-red-100 text-red-700'}`
                                                }>
                                                    {leave.status === 'APPROVED' ? 'อนุมัติ' :
                                                        leave.status === 'PENDING' ? 'รออนุมัติ' : 'ไม่อนุมัติ'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-slate-500">
                                    ไม่มีรายการลาในวันนี้
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                            <button
                                onClick={() => setSelectedDateDetails(null)}
                                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                ปิดหน้าต่าง
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
