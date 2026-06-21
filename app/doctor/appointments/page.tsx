'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { getDoctorBookings, updateBookingStatus } from '@/app/actions/bookings';
import { Sidebar } from '@/components/sidebar';
import { StatusBadge } from '@/components/status-badge';
import { Calendar, Users, Clock, Settings, Eye, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const doctorLinks = [
  { label: 'Overview', href: '/doctor/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Clock className="w-4 h-4" /> },
  { label: 'Earnings', href: '/doctor/earnings', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/doctor/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function DoctorAppointmentsPage() {
  const { currentUser, showToast } = useApp();
  const doctorData = currentUser?.data as any;
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (doctorData?.id) {
      getDoctorBookings(doctorData.id).then(setBookings);
    }
  }, [doctorData?.id]);

  const handleConfirmPayment = async (bookingId: string) => {
    await updateBookingStatus(bookingId, { status: 'confirmed' });
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'confirmed' } : b)));
    showToast('Payment confirmed', 'success');
    setShowPaymentModal(false);
  };

  const handleRejectPayment = async (bookingId: string) => {
    await updateBookingStatus(bookingId, { status: 'pending-payment' });
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'pending-payment' } : b)));
    showToast('Payment rejected', 'error');
    setShowPaymentModal(false);
  };

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AuthGuard allowedRoles={['doctor']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={doctorLinks} title="Doctor Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your bookings and payment confirmations</p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {sortedBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Booking ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Reason</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{booking.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.date} at {booking.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {booking.reason.substring(0, 30)}...
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{booking.fee}</td>
                        <td className="px-6 py-4 text-sm">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {booking.status === 'payment-uploaded' && (
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowPaymentModal(true);
                              }}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments yet</p>
              </div>
            )}
          </div>

          {/* Payment Modal */}
          {showPaymentModal && selectedBooking && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Screenshot</h2>

                {/* Screenshot */}
                {selectedBooking.paymentScreenshot && (
                  <img
                    src={selectedBooking.paymentScreenshot}
                    alt="Payment"
                    className="w-full h-64 object-cover rounded-lg mb-6 border border-gray-100"
                  />
                )}

                {/* Booking Details */}
                <div className="space-y-3 mb-8 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">{selectedBooking.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedBooking.date} {selectedBooking.time}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleRejectPayment(selectedBooking.id)}
                    className="flex-1 px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-semibold transition flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleConfirmPayment(selectedBooking.id)}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBooking(null);
                  }}
                  className="w-full mt-4 px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition"
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
