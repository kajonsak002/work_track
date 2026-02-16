
'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface EmployeeProfile {
  id: number;
  employee_code: string;
  name: string;
  email: string;
  role: string;
}

function Header() {
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);

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
      }
    };

    fetchProfile();
  }, []);

  const getRoleDisplay = (role?: string) => {
    if (role === 'HR') return 'เจ้าหน้าที่ HR';
    return 'พนักงานทั่วไป';
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-lg font-semibold text-slate-800">
        แผงควบคุม
      </h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
          </button>
        </div>

        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-slate-700">
              {profile?.name || 'กำลังโหลด...'}
            </p>
            <p className="text-xs text-slate-500">
              {profile ? getRoleDisplay(profile.role) : '...'}
            </p>
          </div>
          <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-semibold border border-slate-300">
            {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
