'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { UserAvatar } from '@/components/user-avatar';
import { Sidebar } from '@/components/sidebar';
import { Users, TrendingUp, BarChart3, Settings, Search, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Doctors', href: '/admin/doctors', icon: <Users className="w-4 h-4" /> },
  { label: 'Patients', href: '/admin/patients', icon: <Users className="w-4 h-4" /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminDoctorsPage() {
  const { doctors, updateDoctor, removeDoctor, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (doctorId: string, isActive: boolean) => {
    updateDoctor(doctorId, { isActive: !isActive });
    showToast(isActive ? 'Doctor suspended' : 'Doctor activated', 'success');
  };

  const handleDeleteDoctor = (doctorId: string) => {
    removeDoctor(doctorId);
    showToast('Doctor deleted', 'success');
    setDeleteConfirm(null);
  };

  return (
    <AuthGuard allowedRoles={['admin']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={adminLinks} title="Admin Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
            <p className="text-gray-600 mt-2">View and manage registered doctors</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Doctor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Specialization</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Experience</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">License</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((doctor) => (
                      <tr key={doctor.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={doctor.name} />
                            <div>
                              <p className="font-semibold text-gray-900">Dr. {doctor.name}</p>
                              <p className="text-xs text-gray-600">{doctor.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doctor.specialization}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doctor.experience} years</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{doctor.consultationFee}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              doctor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {doctor.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{doctor.licenseNumber}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleToggleStatus(doctor.id, doctor.isActive)}
                              className="text-gray-600 hover:text-blue-600 transition"
                            >
                              {doctor.isActive ? (
                                <ToggleRight className="w-5 h-5 text-green-600" />
                              ) : (
                                <ToggleLeft className="w-5 h-5 text-gray-400" />
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(doctor.id)}
                              className="text-gray-600 hover:text-red-600 transition"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No doctors found</p>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-sm w-full p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Delete Doctor?</h2>
                <p className="text-gray-600 mb-8">This action cannot be undone. All associated data will be removed.</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteDoctor(deleteConfirm);
                      setDeleteConfirm(null);
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
