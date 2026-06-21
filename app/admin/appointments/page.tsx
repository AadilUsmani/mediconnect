'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Sidebar } from '@/components/sidebar';
import { Users, TrendingUp, BarChart3, Settings, Search, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { AuthGuard } from '@/components/auth-guard';

const adminLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Doctors', href: '/admin/doctors', icon: <Users className="w-4 h-4" /> },
  { label: 'Patients', href: '/admin/patients', icon: <Users className="w-4 h-4" /> },
  { label: 'Appointments', href: '/admin/appointments', icon: <BarChart3 className="w-4 h-4" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
];

export default function AdminAppointmentsPage() {
  const { bookings, doctors, patients, updateBooking, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = bookings.filter((booking) => {
    const matchesSearch = booking.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filterStatus || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    updateBooking(bookingId, { status: newStatus as any });
    showToast('Status updated', 'success');
  };

  return (
    <AuthGuard allowedRoles={['admin']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={adminLinks} title="Admin Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all platform bookings</p>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bookings..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="pending-payment">Pending Payment</option>
              <option value="payment-uploaded">Payment Uploaded</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            {filtered.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Booking ID</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Patient</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Doctor</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Date & Time</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Fee</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((booking) => {
                      const doctor = doctors.find((d) => d.id === booking.doctorId);
                      const patient = patients.find((p) => p.id === booking.patientId);

                      return (
                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">{booking.id}</td>
                          <td className="px-6 py-4 text-gray-600">{patient?.name}</td>
                          <td className="px-6 py-4 text-gray-600">Dr. {doctor?.name}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {booking.date} at {booking.time}
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900">{booking.fee}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4">
                            {booking.paymentScreenshot && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments found</p>
              </div>
            )}
          </div>

          {/* Payment Screenshot Modal */}
          {showModal && selectedBooking && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Screenshot</h2>
                {selectedBooking.paymentScreenshot && (
                  <img
                    src={selectedBooking.paymentScreenshot}
                    alt="Payment"
                    className="w-full rounded-lg mb-6"
                  />
                )}

                <div className="space-y-4 mb-6">
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => {
                      handleStatusChange(selectedBooking.id, e.target.value);
                      setShowModal(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="payment-uploaded">Payment Uploaded</option>
                    <option value="confirmed">Confirm Payment</option>
                    <option value="pending-payment">Reject Payment</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
