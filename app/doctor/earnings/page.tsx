'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { getDoctorBookings } from '@/app/actions/bookings';
import { Sidebar } from '@/components/sidebar';
import { Calendar, Users, Clock, Settings, TrendingUp, DollarSign } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const doctorLinks = [
  { label: 'Overview', href: '/doctor/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Clock className="w-4 h-4" /> },
  { label: 'Earnings', href: '/doctor/earnings', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/doctor/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function DoctorEarningsPage() {
  const { currentUser } = useApp();
  const doctorData = currentUser?.data as any;
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (doctorData?.id) {
      getDoctorBookings(doctorData.id).then(setBookings);
    }
  }, [doctorData?.id]);

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed');
  const totalEarnings = confirmedBookings.reduce((sum, b) => sum + b.fee, 0);
  const thisMonthEarnings = confirmedBookings
    .filter((b) => {
      const bookingDate = new Date(b.date);
      const now = new Date();
      return bookingDate.getMonth() === now.getMonth() && bookingDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, b) => sum + b.fee, 0);

  const earningsData = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1398 },
    { month: 'Mar', amount: 9800 },
    { month: 'Apr', amount: 3800 },
    { month: 'May', amount: 4300 },
    { month: 'Jun', amount: totalEarnings },
  ];

  return (
    <AuthGuard allowedRoles={['doctor']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={doctorLinks} title="Doctor Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-600 mt-2">Track your income and payments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100 text-green-600">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900">${totalEarnings}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">This Month</p>
              <p className="text-3xl font-bold text-gray-900">${thisMonthEarnings}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Confirmed Consultations</p>
              <p className="text-3xl font-bold text-gray-900">{confirmedBookings.length}</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>

            {confirmedBookings.length > 0 ? (
              <div className="space-y-3">
                {confirmedBookings.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">Consultation on {booking.date}</p>
                      <p className="text-sm text-gray-600">Time: {booking.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{booking.fee}</p>
                      <p className="text-xs text-gray-500 capitalize">{booking.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No confirmed transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
