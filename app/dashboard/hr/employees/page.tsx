"use client";

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function EmployeeManagementPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: '', // for edit (employee_code)
        name: '',
        email: '',
        role: 'EMPLOYEE',
        password: ''
    });

    const token = Cookies.get('token');

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API}/employee`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setEmployees(data.employee || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleOpenCreate = () => {
        setIsEditing(false);
        setFormData({ id: '', name: '', email: '', role: 'EMPLOYEE', password: '' });
        setShowModal(true);
    };

    const handleOpenEdit = (emp: any) => {
        setIsEditing(true);
        setFormData({
            id: emp.employee_code,
            name: emp.name,
            email: emp.email || '',
            role: emp.role,
            password: '' // Don't show password
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: "ข้อมูลพนักงานจะถูกลบถาวร",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ลบข้อมูล',
            cancelButtonText: 'ยกเลิก',
            confirmButtonColor: '#d33'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/employee/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    Swal.fire('Deleted!', 'ลบข้อมูลสำเร็จ', 'success');
                    fetchEmployees();
                } else {
                    const data = await res.json();
                    Swal.fire('Error', data.message || 'เกิดข้อผิดพลาด', 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing
                ? `${process.env.NEXT_PUBLIC_API}/employee/${formData.id}`
                : `${process.env.NEXT_PUBLIC_API}/employee`;

            const method = isEditing ? 'PUT' : 'POST';

            // Prepare payload (remove password if empty on edit)
            const payload: any = { ...formData };
            if (isEditing && !payload.password) delete payload.password;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire('Success', isEditing ? 'แก้ไขข้อมูลสำเร็จ' : 'สร้างพนักงานสำเร็จ', 'success');
                setShowModal(false);
                fetchEmployees();
            } else {
                Swal.fire('Error', data.message || 'เกิดข้อผิดพลาด', 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">จัดการข้อมูลพนักงาน</h1>
                    <p className="text-slate-500 text-sm mt-1">รายชื่อพนักงานทั้งหมดในระบบ</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    เพิ่มพนักงาน
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium">รหัสพนักงาน</th>
                                <th className="px-6 py-3 font-medium">ชื่อ-นามสกุล</th>
                                <th className="px-6 py-3 font-medium">อีเมล</th>
                                <th className="px-6 py-3 font-medium">ตำแหน่ง</th>
                                <th className="px-6 py-3 font-medium text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-4 text-center">กำลังโหลดข้อมูล...</td></tr>
                            ) : employees.length > 0 ? (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{emp.employee_code}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <div className="font-medium text-slate-900">{emp.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{emp.email || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${emp.role === 'HR' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {emp.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/hr/employees/${emp.employee_code}`}
                                                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                                                    title="ดูรายละเอียด"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => handleOpenEdit(emp)}
                                                    className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
                                                    title="แก้ไข"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(emp.employee_code)}
                                                    className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                                                    title="ลบ"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-slate-500">ไม่พบข้อมูลพนักงาน</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-semibold text-slate-900">
                                {isEditing ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ-นามสกุล <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">อีเมล <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">ตำแหน่ง</label>
                                <select
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="EMPLOYEE">พนักงานทั่วไป (Employee)</option>
                                    <option value="HR">ผู้ดูแลระบบ (HR)</option>
                                </select>
                            </div>
                            {!isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">รหัสผ่าน <span className="text-xs text-slate-400">(ค่าเริ่มต้น: 123456)</span></label>
                                    <input
                                        type="password"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="ว่างไวเพื่อใช้ค่าเริ่มต้น"
                                    />
                                </div>
                            )}
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    {isEditing ? 'บันทึกแก้ไข' : 'สร้างพนักงาน'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}