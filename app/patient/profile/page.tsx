'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { UserAvatar } from '@/components/user-avatar';
import { Sidebar } from '@/components/sidebar';
import { Calendar, Users, Clock, Settings, ArrowLeft, MapPin } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { updatePatientProfile } from '@/app/actions/patients';

const patientLinks = [
  { label: 'Overview', href: '/patient/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'Find Doctors', href: '/patient/doctors', icon: <MapPin className="w-4 h-4" /> },
  { label: 'My Bookings', href: '/patient/bookings', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/patient/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function PatientProfilePage() {
  const { currentUser, showToast, setCurrentUser } = useApp();
  const patientData = currentUser?.data as any;
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: patientData?.name || '',
    dateOfBirth: patientData?.dateOfBirth || '',
    gender: patientData?.gender || '',
    phone: patientData?.phone || '',
    emergencyContact: patientData?.emergencyContact || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (patientData?.id) {
      await updatePatientProfile(patientData.id, {
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as any,
        phone: formData.phone,
        emergencyContact: formData.emergencyContact,
      });
      if (setCurrentUser && currentUser) {
        setCurrentUser({ ...currentUser, data: { ...patientData, ...formData } });
      }
      showToast('Profile updated', 'success');
      setEditing(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['patient']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={patientLinks} title="Patient Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <Link href="/patient/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex items-start gap-8 mb-8">
              {/* Photo */}
              <div className="flex-shrink-0">
                <UserAvatar name={patientData?.name || ''} className="w-32 h-32 text-4xl" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{patientData?.name}</h2>
                <p className="text-gray-600 mt-1">{currentUser?.email}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date of Birth:</span> {patientData?.dateOfBirth}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Gender:</span> {patientData?.gender}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Phone:</span> {patientData?.phone}
                  </p>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditing(!editing)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Form */}
            {editing ? (
              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Date of Birth</h3>
                    <p className="text-gray-900">{patientData?.dateOfBirth}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Gender</h3>
                    <p className="text-gray-900 capitalize">{patientData?.gender}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Phone</h3>
                    <p className="text-gray-900">{patientData?.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Emergency Contact</h3>
                    <p className="text-gray-900">{patientData?.emergencyContact}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
