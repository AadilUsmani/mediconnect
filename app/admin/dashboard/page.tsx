'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { Sidebar } from '@/components/sidebar';
import { BarChart3, Users, TrendingUp, Settings, Calendar, Check } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { AuthGuard } from '@/components/auth-guard';
import Link from 'next/link';
import { getBookings } from '@/app/actions/bookings';
import { getDoctors } from '@/app/actions/doctors';
import { getPatients } from '@/app/actions/patients';

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Doctors', href: '/admin/doctors', icon: <Users className="w-4 h-4" /> },
  { label: 'Patients', href: '/admin/patients', icon: <Users className="w-4 h-4" /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [d, p, b] = await Promise.all([
          getDoctors(),
          getPatients(),
          getBookings()
        ]);
        setDoctors(d);
        setPatients(p);
        setBookings(b);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    { label: 'Total Doctors', value: doctors.length, color: 'bg-blue-100 text-blue-600', icon: Users },
    { label: 'Total Patients', value: patients.length, color: 'bg-green-100 text-green-600', icon: Users },
    { label: 'Total Bookings', value: bookings.length, color: 'bg-purple-100 text-purple-600', icon: Calendar },
    {
      label: 'Confirmed',
      value: bookings.filter((b) => b.status === 'confirmed').length,
      color: 'bg-orange-100 text-orange-600',
      icon: Check
    },
  ];

  const revenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.fee, 0);

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <AuthGuard allowedRoles={['admin']} redirectTo="/admin/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={adminLinks} title="Admin Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Platform overview and management</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className={`p-3 rounded-lg ${stat.color} w-fit mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Estimated Platform Revenue</p>
                <p className="text-4xl font-bold">${revenue}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link href="/admin/appointments" className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>

            {recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Booking ID</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Fee</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{booking.id}</td>
                        <td className="px-6 py-4 text-gray-600">{booking.date}</td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{booking.fee}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No bookings yet</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Manage Doctors', href: '/admin/doctors' },
              { label: 'Manage Patients', href: '/admin/patients' },
              { label: 'View Appointments', href: '/admin/appointments' },
              { label: 'Settings', href: '/admin/settings' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition text-center"
              >
                <p className="font-semibold text-gray-900">{link.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
