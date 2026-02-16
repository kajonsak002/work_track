
'use client';

import { usePathname } from 'next/navigation';
import Header from "../components/ui/Header";
import EmployeeSidebar from "../components/ui/EmployeeSidebar";
import HRSidebar from "../components/ui/HRSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isHR = pathname.startsWith('/dashboard/hr/');

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="hidden w-64 md:flex flex-col">
                {isHR ? <HRSidebar /> : <EmployeeSidebar />}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 scroll-smooth">
                    <div className="container mx-auto max-w-7xl animate-fade-in-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}