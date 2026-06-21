'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { UserAvatar } from '@/components/user-avatar';
import { Sidebar } from '@/components/sidebar';
import { StatusBadge } from '@/components/status-badge';
import { Calendar, Users, Clock, Settings, Upload, X, MapPin } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const patientLinks = [
  { label: 'Overview', href: '/patient/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'Find Doctors', href: '/patient/doctors', icon: <MapPin className="w-4 h-4" /> },
  { label: 'My Bookings', href: '/patient/bookings', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/patient/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function PatientBookingsPage() {
  const { currentUser, getPatientBookings, updateBooking, doctors, showToast } = useApp();
  const patientData = currentUser?.data as any;
  const bookings = getPatientBookings(patientData?.id);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');

  const handleUploadPayment = (bookingId: string) => {
    if (uploadedFile) {
      updateBooking(bookingId, { status: 'payment-uploaded', paymentScreenshot: uploadedFile });
      showToast('Payment screenshot uploaded successfully', 'success');
      setUploadModal(false);
      setUploadedFile('');
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      updateBooking(bookingId, { status: 'cancelled' });
      showToast('Booking cancelled', 'error');
    }
  };

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AuthGuard allowedRoles={['patient']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={patientLinks} title="Patient Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">View and manage your consultations</p>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {sortedBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Doctor</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sortedBookings.map((booking) => {
                      const doctor = doctors.find((d) => d.id === booking.doctorId);
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-3">
                              <UserAvatar name={doctor?.name || ''} />
                              <div>
                                <p className="font-semibold text-gray-900">Dr. {doctor?.name}</p>
                                <p className="text-xs text-gray-600">{doctor?.specialization}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {booking.date} at {booking.time}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{booking.fee}</td>
                          <td className="px-6 py-4 text-sm">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {booking.status === 'pending-payment' && (
                              <button
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setUploadModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                              >
                                <Upload className="w-4 h-4" />
                                Upload
                              </button>
                            )}
                            {(booking.status === 'pending-payment' || booking.status === 'payment-uploaded') && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                Cancel
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
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings yet</p>
              </div>
            )}
          </div>

          {/* Upload Payment Modal */}
          {uploadModal && selectedBooking && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Upload Payment Proof</h2>
                  <button
                    onClick={() => {
                      setUploadModal(false);
                      setUploadedFile('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Booking Info */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Amount:</span> {selectedBooking.fee}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Reason:</span> {selectedBooking.reason}
                  </p>
                </div>

                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setUploadedFile(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </label>
                  </div>

                  {uploadedFile && (
                    <img src={uploadedFile} alt="Payment" className="w-full mt-4 rounded-lg border border-gray-200" />
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setUploadModal(false);
                      setUploadedFile('');
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUploadPayment(selectedBooking.id)}
                    disabled={!uploadedFile}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
                  >
                    Submit
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
