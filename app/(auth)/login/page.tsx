
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        emp_code: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employee_code: formData.emp_code,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'เข้าสู่ระบบไม่สำเร็จ');
            }

            Cookies.set('token', data.user.token, { expires: 1 });
            Cookies.set('role', data.user.role, { expires: 1 });

            if (data.user.role === 'HR') {
                router.push('/dashboard/hr/employees');
            } else {
                router.push('/dashboard/employee');
            }

        } catch (error) {
            console.error('Login error:', error);
            alert(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">เข้าสู่ระบบ</h2>
                <p className="text-slate-500 mt-2">กรุณากรอกข้อมูลเพื่อเข้าใช้งานบัญชีของคุณ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="emp_code"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                        รหัสพนักงาน
                    </label>
                    <input
                        id="emp_code"
                        name="emp_code"
                        type="text"
                        required
                        placeholder="เช่น EMP000XXX"
                        value={formData.emp_code}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-slate-700"
                        >
                            รหัสผ่าน
                        </label>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "เข้าสู่ระบบ"
                    )}
                </button>
            </form>

            <div className="mt-8 text-center bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-600">
                    ยังไม่มีบัญชีใช่หรือไม่?{' '}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        ลงทะเบียนผู้ใช้งาน
                    </Link>
                </p>
            </div>
        </div>
    );
}
