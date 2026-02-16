"use client"

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2'

export default function EmployeeDashboard() {

    const [profile, setProfile] = useState<any | null>(null);
    const [leaveBalance, setLeaveBalance] = useState([])
    const [attendance, setAttendance] = useState<any[]>([])

    const fetchProfile = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/employee/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.employee) {
                    setProfile(data.employee);
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const fetchLeaveBalance = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/leaveRequest/my-balance`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setLeaveBalance(data)
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const fetchAttendance = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/my?page=1&limit=10`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setAttendance(data.data || [])
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    useEffect(() => {
        fetchAttendance()
        fetchLeaveBalance()
        fetchProfile()
    }, []);

    const handleCheckIn = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/check-in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ latitude, longitude })
                });

                const data = await res.json();
                if (res.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'บันทึกเวลาเข้างานสำเร็จ',
                        text: data.message,
                        confirmButtonText: 'ตกลง'
                    }).then(() => {
                        fetchAttendance();
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'แจ้งเตือน',
                        text: data.message,
                        confirmButtonText: 'ตกลง'
                    });
                }
            } catch (error) {
                console.error("Error check-in", error);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                    confirmButtonText: 'ตกลง'
                });
            }
        }, (error) => {
            console.error("Error getting location", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'กรุณาเปิดใช้งาน Location Service เพื่อลงเวลาเข้างาน',
                confirmButtonText: 'ตกลง'
            });
        });
    }

    const handleCheckOut = async () => {
        const token = Cookies.get('token');
        if (!token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/attendance/check-out`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'บันทึกเวลาออกงานสำเร็จ',
                    text: data.message,
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    fetchAttendance();
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'แจ้งเตือน',
                    text: data.message,
                    confirmButtonText: 'ตกลง'
                });
            }
        } catch (error) {
            console.error("Error check-out", error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
                confirmButtonText: 'ตกลง'
            });
        }
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">สวัสดี, {profile?.name} 👋</h1>
                    <p className="text-slate-500 max-w-xl">
                        วันนี้เป็นวันที่ดีในการทำงาน อย่าลืมลงเวลาเข้างานเพื่อรักษาสถิติการทำงานของคุณ
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={handleCheckIn}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
                        >
                            ⏱️ ลงเวลาเข้างาน
                        </button>
                        <button
                            onClick={handleCheckOut}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
                        >
                            🕒 ลงเวลาออกงาน
                        </button>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent opacity-50" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {leaveBalance.map((item: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
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
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(item.total_days ? (item.remaining_days / item.total_days * 100) : 0)}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">ใช้ไปแล้ว {item.used_days} จาก {item.total_days} วัน</p>
                    </div>
                ))}
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">บันทึกเวลาทำงานล่าสุด</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">ดูทั้งหมด</button>
                </div>
                <div className="overflow-x-auto">
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
                            {attendance.length > 0 ? (
                                attendance.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
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
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-slate-500">
                                        ไม่พบข้อมูลการลงเวลา
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