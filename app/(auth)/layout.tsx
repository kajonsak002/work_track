
import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Side - Hero/Branding */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
                {/* Abstract Professional Background pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 opacity-90" />
                    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="1" fill="none" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                    </svg>
                </div>

                <div className="relative z-10 p-12 text-white max-w-lg">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-6 leading-tight tracking-tight">
                        ระบบบันทึกการ<br />
                        <span className="text-blue-400">เข้า-ออกงาน</span>
                    </h1>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        ยกระดับประสิทธิภาพองค์กรด้วยระบบบริหารจัดการบุคลากรที่ทันสมัย ปลอดภัย และใช้งานง่าย รองรับการทำงานรูปแบบใหม่
                    </p>

                    <div className="flex gap-4 text-sm font-medium text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            มาตรฐานองค์กร
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            ความปลอดภัยสูง
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            รองรับ 24/7
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {children}

                    <div className="mt-8 pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
                        &copy; 2026 ระบบบันทึกการเข้า-ออกงานWorkTrack สงวนลิขสิทธิ์
                    </div>
                </div>
            </div>
        </div>
    );
}
