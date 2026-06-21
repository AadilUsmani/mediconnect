'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { updateDoctorProfile } from '@/app/actions/doctors';
import { UserAvatar } from '@/components/user-avatar';
import { Sidebar } from '@/components/sidebar';
import { SPECIALIZATIONS } from '@/lib/mock-data';
import { Settings, ArrowLeft, Calendar, Users, Clock, DollarSign } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import Link from 'next/link';

const doctorLinks = [
  { label: 'Overview', href: '/doctor/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Clock className="w-4 h-4" /> },
  { label: 'Earnings', href: '/doctor/earnings', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/doctor/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function DoctorProfilePage() {
  const { currentUser, showToast, setCurrentUser } = useApp();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    specialization: (currentUser?.data as any)?.specialization || '',
    experience: (currentUser?.data as any)?.experience || '',
    consultationFee: (currentUser?.data as any)?.consultationFee || '',
    whatsapp: (currentUser?.data as any)?.whatsapp || '',
    bio: (currentUser?.data as any)?.bio || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (currentUser?.data) {
      const updatedData = {
        name: formData.name,
        specialization: formData.specialization,
        experience: parseInt(formData.experience),
        consultationFee: parseInt(formData.consultationFee),
        whatsapp: formData.whatsapp,
        bio: formData.bio,
      };
      
      const res = await updateDoctorProfile((currentUser.data as any).id, updatedData);
      if (res.success) {
        setCurrentUser({
          ...currentUser,
          name: formData.name,
          data: { ...(currentUser.data as any), ...updatedData }
        });
        showToast('Profile updated', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
      setEditing(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['doctor']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={doctorLinks} title="Doctor Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <Link href="/doctor/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium">
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
                <UserAvatar name={currentUser?.name || ''} className="w-32 h-32 text-4xl" />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{currentUser?.name}</h2>
                <p className="text-gray-600 mt-1">{(currentUser?.data as any)?.specialization}</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold">License:</span> {(currentUser?.data as any)?.licenseNumber}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Experience:</span> {(currentUser?.data as any)?.experience} years
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Consultation Fee:</span> {(currentUser?.data as any)?.consultationFee}
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  />
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600 leading-relaxed">{(currentUser?.data as any)?.bio}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Specialization</h3>
                    <p className="text-gray-900">{(currentUser?.data as any)?.specialization}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Experience</h3>
                    <p className="text-gray-900">{(currentUser?.data as any)?.experience} years</p>
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
