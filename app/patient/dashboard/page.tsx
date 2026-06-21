'use client';

import Link from 'next/link';
import { useApp } from '@/lib/app-context';
import { UserAvatar } from '@/components/user-avatar';
import { Sidebar } from '@/components/sidebar';
import { StatusBadge } from '@/components/status-badge';
import { Calendar, Users, Clock, Settings, MapPin, Star, ArrowRight } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const patientLinks = [
  { label: 'Overview', href: '/patient/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'Find Doctors', href: '/patient/doctors', icon: <MapPin className="w-4 h-4" /> },
  { label: 'My Bookings', href: '/patient/bookings', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/patient/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function PatientDashboard() {
  const { currentUser, getPatientBookings, doctors } = useApp();
  const patientData = currentUser?.data as any;
  const bookings = getPatientBookings(patientData?.id);

  const upcomingBookings = bookings
    .filter((b) => ['confirmed', 'payment-uploaded'].includes(b.status))
    .slice(0, 3);

  const nextAppointment = upcomingBookings[0];
  const nextDoctor = nextAppointment ? doctors.find((d) => d.id === nextAppointment.doctorId) : null;

  const stats = [
    { label: 'Upcoming Appointments', value: bookings.filter((b) => b.status === 'confirmed').length },
    { label: 'Past Consultations', value: bookings.filter((b) => b.status === 'completed').length },
    { label: 'Pending Payments', value: bookings.filter((b) => b.status === 'pending-payment').length },
  ];

  return (
    <AuthGuard allowedRoles={['patient']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={patientLinks} title="Patient Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {currentUser?.name}</h1>
            <p className="text-gray-600 mt-2">Manage your health consultations</p>
          </div>

          {/* Next Appointment Card */}
          {nextAppointment && nextDoctor ? (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
              <p className="text-blue-100 mb-2">Next Appointment</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Dr. {nextDoctor.name}</h2>
                  <p className="text-blue-100 mb-4">{nextDoctor.specialization}</p>
                  <div className="space-y-2 text-sm">
                    <p>📅 {nextAppointment.date} at {nextAppointment.time}</p>
                    <p>💰 {nextAppointment.fee}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <UserAvatar name={nextDoctor.name} className="w-24 h-24 text-3xl border-4 border-blue-300 mb-4" />
                  <Link
                    href="/patient/bookings"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition justify-center"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 mb-8">
              <p className="text-blue-900">No upcoming appointments yet.</p>
              <Link href="/patient/doctors" className="text-blue-600 hover:text-blue-700 font-semibold mt-2 inline-block">
                Browse doctors and book a consultation
              </Link>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
              <Link href="/patient/bookings" className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="space-y-3">
                {upcomingBookings.map((booking) => {
                  const doctor = doctors.find((d) => d.id === booking.doctorId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
                      <div className="flex items-center gap-4">
                        <UserAvatar name={doctor?.name || ''} />
                        <div>
                          <p className="font-semibold text-gray-900">Dr. {doctor?.name}</p>
                          <p className="text-sm text-gray-600">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={booking.status} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings yet</p>
                <Link href="/patient/doctors" className="text-blue-600 hover:text-blue-700 font-semibold mt-4 inline-block">
                  Browse doctors
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
