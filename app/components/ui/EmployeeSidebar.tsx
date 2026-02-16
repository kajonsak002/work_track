
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function EmployeeSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('role');
        router.push('/login');
    };

    const menuItems = [
        {
            title: "ภาพรวม",
            href: "/dashboard/employee",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            )
        },
        {
            title: "ลงเวลาเข้า-ออก",
            href: "/dashboard/employee/attendance",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            )
        },
        {
            title: "ยื่นใบลา",
            href: "/dashboard/employee/leaves",
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
            title: "ข้อมูลส่วนตัว",
            href: "/dashboard/employee/profile",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        }
    ];

    return (
        <div className="bg-slate-900 h-screen w-64 flex flex-col border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-white text-xl font-bold tracking-tight">
                    WorkTrack
                </h1>
                <p className="text-slate-400 text-xs mt-1">สำหรับพนักงาน</p>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="mb-6">
                    <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                        เมนูหลัก
                    </h2>
                    <ul className="space-y-1">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={index}>
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
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-2 py-2 w-full text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
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
