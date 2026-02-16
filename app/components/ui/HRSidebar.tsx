"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

export default function HRSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Swal.fire({
            title: 'ออกจากระบบ?',
            text: "คุณต้องการออกจากระบบใช่หรือไม่",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'ออกจากระบบ',
            cancelButtonText: 'ยกเลิก',
            background: '#1e293b',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove('token');
                Cookies.remove('role');
                router.push('/login');
            }
        });
    };

    const menuItems = [
        {
            category: "จัดการระบบ",
            items: [

                {
                    label: "ข้อมูลพนักงาน",
                    href: "/dashboard/hr/employees",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    )
                }
            ]
        },
        {
            category: "การลงเวลา",
            items: [
                {
                    label: "ตรวจสอบเวลาเข้า-ออก",
                    href: "/dashboard/hr/attendance",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    )
                }
            ]
        },
        {
            category: "การจัดการวันลา",
            items: [
                {
                    label: "จัดการคำร้องขอลา",
                    href: "/dashboard/hr/leaves",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    )
                },
                {
                    label: "กำหนดสิทธิ์การลา",
                    href: "/dashboard/hr/leave-policies",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                    )
                },
                {
                    label: "ปฏิทินการลา",
                    href: "/dashboard/hr/calendar",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                    )
                }
            ]
        }
    ];

    return (
        <div className="bg-slate-900 h-screen w-64 flex flex-col border-r border-slate-800 fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-white text-xl font-bold tracking-tight">WorkTrack</h1>
                <p className="text-slate-400 text-xs mt-1">ผู้ดูแลระบบ (HR)</p>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="mb-6">
                        <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            {section.category}
                        </h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                }`}
                                        >
                                            <div className={isActive ? "text-white" : ""}>
                                                {item.icon}
                                            </div>
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-2 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    ออกจากระบบ
                </button>
            </div>
        </div>
    );
}
