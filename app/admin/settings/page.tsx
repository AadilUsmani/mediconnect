'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Sidebar } from '@/components/sidebar';
import { Users, TrendingUp, BarChart3, Settings, Toggle2, AlertCircle } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Doctors', href: '/admin/doctors', icon: <Users className="w-4 h-4" /> },
  { label: 'Patients', href: '/admin/patients', icon: <Users className="w-4 h-4" /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminSettingsPage() {
  const { adminSettings, updateAdminSettings, showToast } = useApp();
  const [platformName, setPlatformName] = useState(adminSettings.platformName);
  const [showAnnouncement, setShowAnnouncement] = useState(adminSettings.announcementBanner);
  const [announcement, setAnnouncement] = useState(adminSettings.announcement);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveSettings = () => {
    updateAdminSettings({ platformName, announcementBanner: showAnnouncement, announcement });
    showToast('Settings saved successfully', 'success');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (currentPassword === 'admin123') {
      showToast('Password changed successfully', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast('Incorrect current password', 'error');
    }
  };

  return (
    <AuthGuard allowedRoles={['admin']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={adminLinks} title="Admin Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage platform configuration</p>
          </div>

          {/* General Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">General Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAnnouncement}
                    onChange={(e) => setShowAnnouncement(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <span className="font-medium text-gray-700">Show Announcement Banner</span>
                </label>
              </div>

              {showAnnouncement && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Announcement Message</label>
                  <textarea
                    value={announcement}
                    onChange={(e) => setAnnouncement(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
              )}

              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Announcement Preview */}
          {showAnnouncement && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Announcement Preview</h3>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded flex gap-3">
                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-900">{announcement}</p>
              </div>
            </div>
          )}

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Admin Password</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
              >
                Change Password
              </button>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Current Password:</span> admin123
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
