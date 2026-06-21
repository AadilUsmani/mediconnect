'use client';

import { useApp } from '@/lib/app-context';
import { Sidebar } from '@/components/sidebar';
import { Calendar, Users, DollarSign, Clock, Settings } from 'lucide-react';
import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';

const doctorLinks = [
  { label: 'Overview', href: '/doctor/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Clock className="w-4 h-4" /> },
  { label: 'Earnings', href: '/doctor/earnings', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/doctor/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function DoctorDashboard() {
  const { currentUser, getDoctorBookings, doctors } = useApp();
  const doctorData = currentUser?.data as any;
  const bookings = getDoctorBookings(doctorData?.id);
  const today = new Date().toISOString().split('T')[0];
  const todaysSessions = bookings.filter((b) => b.date === today && (b.status === 'confirmed' || b.status === 'completed')).length;

  const stats = [
    {
      label: 'Total Appointments',
      value: bookings.length,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending Confirmations',
      value: bookings.filter((b) => b.status === 'payment-uploaded').length,
      icon: Clock,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: "Today's Sessions",
      value: todaysSessions,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Earnings',
      value: `${bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + b.fee, 0)}`,
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const upcomingBookings = bookings
    .filter((b) => ['confirmed', 'payment-uploaded'].includes(b.status))
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
    .slice(0, 5);

  return (
    <AuthGuard allowedRoles={['doctor']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={doctorLinks} title="Doctor Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name || 'Doctor'}</h1>
              <p className="text-gray-600 mt-2">Here&apos;s your practice overview</p>
            </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <Link href="/doctor/appointments" className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => {
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">Booking {booking.id}</p>
                        <p className="text-sm text-gray-600">
                          {booking.date} at {booking.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {booking.status === 'confirmed' ? 'Confirmed' : 'Payment Uploaded'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No upcoming appointments</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
