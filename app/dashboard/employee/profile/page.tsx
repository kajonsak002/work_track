"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ProfilePage() {
    const [profile, setProfile] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;
    }

    if (!profile) {
        return <div className="p-10 text-center text-red-500">ไม่สามารถโหลดข้อมูลผู้ใช้ได้</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">ข้อมูลส่วนตัว</h1>
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm max-w-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                    <p className="text-slate-500">{profile.role === 'HR' ? 'ฝ่ายบุคคล (HR)' : 'พนักงาน'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <label className="text-xs text-slate-500 uppercase font-semibold">รหัสพนักงาน</label>
                        <p className="text-slate-900 font-medium mt-1">{profile.employee_code}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                        <label className="text-xs text-slate-500 uppercase font-semibold">อีเมล</label>
                        <p className="text-slate-900 font-medium mt-1">{profile.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
