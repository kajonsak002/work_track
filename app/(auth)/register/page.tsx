
'use client';

import Link from 'next/link';
import { useState } from 'react';

interface FormData {
    name: string
    email: string
    password: string
}

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: ""
    })
    const [role, setRole] = useState<'EMPLOYEE' | 'HR'>('EMPLOYEE');

    const handleChange = (e: any) => {
        const { name, value } = e.target

        setFormData((prev: any) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Password validation
        const password = formData.password;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough || !hasUpperCase || !hasLowerCase) {
            alert("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก");
            return;
        }

        setIsLoading(true);

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: role
        }

        // console.log("PAYLOAD", payload)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })

            const result = await res.json()

            if (!res.ok) {
                console.log("Error to Register")
            }

            alert(result.message)
            setFormData({
                name: "",
                email: "",
                password: ""
            })
            setRole("EMPLOYEE")
        } catch (err) {
            console.log("Error to registation", err)
        } finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="animate-fade-in-up">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">สร้างบัญชีผู้ใช้งาน</h2>
                <p className="text-slate-500 mt-2">เข้าร่วมพื้นที่การทำงานในองค์กรของคุณ</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-slate-700 mb-2"
                        >
                            ชื่อจริง
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="สมชาย ใจดี"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                        อีเมล
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="somchai.j@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                        รหัสผ่าน
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="ตั้งรหัสผ่านที่รัดกุม"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    />
                    <p className="mt-1 text-xs text-slate-400">ต้องมีความยาวอย่างน้อย 8 ตัวอักษร และมีทั้งตัวพิมพ์ใหญ่และเล็ก</p>
                </div>

                <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                        บทบาท
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => setRole('EMPLOYEE')}
                            className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${role === 'EMPLOYEE'
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${role === 'EMPLOYEE' ? 'border-blue-500' : 'border-slate-400'
                                }`}>
                                {role === 'EMPLOYEE' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-semibold ${role === 'EMPLOYEE' ? 'text-blue-700' : 'text-slate-700'}`}>พนักงานทั่วไป</h4>
                                <p className="text-xs text-slate-500 mt-0.5">สำหรับการใช้งานทั่วไป</p>
                            </div>
                        </div>

                        <div
                            onClick={() => setRole('HR')}
                            className={`cursor-pointer border rounded-lg p-4 flex items-start gap-3 transition-all ${role === 'HR'
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center ${role === 'HR' ? 'border-blue-500' : 'border-slate-400'
                                }`}>
                                {role === 'HR' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                            </div>
                            <div>
                                <h4 className={`text-sm font-semibold ${role === 'HR' ? 'text-blue-700' : 'text-slate-700'}`}>เจ้าหน้าที่ HR</h4>
                                <p className="text-xs text-slate-500 mt-0.5">จัดการระบบและรายงาน</p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-70 mt-4"
                >
                    {isLoading ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        "ลงทะเบียน"
                    )}
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                    การลงทะเบียนแสดงว่าคุณยอมรับ <a href="#" className="underline hover:text-slate-600">ข้อกำหนดการใช้งาน</a> และ <a href="#" className="underline hover:text-slate-600">นโยบายความเป็นส่วนตัว</a>
                </p>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-slate-600">
                    มีบัญชีอยู่แล้ว?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                        เข้าสู่ระบบ
                    </Link>
                </p>
            </div>
        </div>
    );
}
