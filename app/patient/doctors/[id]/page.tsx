'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/app-context';
import { UserAvatar } from '@/components/user-avatar';
import Link from 'next/link';
import { Calendar, Users, Clock, Settings, Star, ArrowLeft, Share2, Heart, MapPin } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { getDoctorById } from '@/app/actions/doctors';
import { createBooking } from '@/app/actions/bookings';

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, showToast } = useApp();
  const doctorId = params.id as string;
  const patientData = currentUser?.data as any;

  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<'select' | 'confirm' | 'payment'>('select');

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const doc = await getDoctorById(doctorId);
        setDoctor(doc);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Doctor not found</p>
          <Link href="/patient/doctors" className="text-blue-600 hover:text-blue-700 font-medium">
            Back to doctors
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (selectedDate && selectedSlot && reason && patientData) {
      const bookingId = 'book-' + Date.now();
      await createBooking({
        id: bookingId,
        patientId: patientData.id,
        doctorId: doctor.id,
        date: selectedDate,
        time: selectedSlot,
        reason,
        status: 'pending-payment',
        fee: doctor.consultationFee,
        createdAt: new Date().toISOString().split('T')[0],
      });
      showToast('Booking confirmed! Please proceed with payment.', 'success');
      setBookingStep('payment');
    }
  };

  const getAvailableSlots = (date: string) => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    return (doctor.schedule as any)?.[dayOfWeek] || [];
  };

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  return (
    <AuthGuard allowedRoles={['patient']} redirectTo="/login">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-4">
          <Link href="/patient/doctors" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8 hover:shadow-lg transition-shadow duration-300">
              {/* Header */}
              <div className="flex gap-6 mb-8">
                <UserAvatar name={doctor.name} className="w-32 h-32 text-4xl border-4 border-blue-100" />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">Dr. {doctor.name}</h1>
                      <p className="text-lg text-gray-600 mt-1">{doctor.specialization}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <Share2 className="w-6 h-6 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-gray-900">{doctor.rating}</span>
                      <span className="text-gray-600">({doctor.totalReviews} reviews)</span>
                    </div>
                    <div className="text-gray-600">
                      <Clock className="w-5 h-5 inline mr-2" />
                      {doctor.experience} years experience
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
              </div>

              {/* Details */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-600 uppercase mb-4">Professional Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Medical License</p>
                      <p className="font-semibold text-gray-900">{doctor.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Experience</p>
                      <p className="font-semibold text-gray-900">{doctor.experience} years</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-600 uppercase mb-4">Consultation</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Fee</p>
                      <p className="font-semibold text-gray-900">{doctor.consultationFee}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Specialization</p>
                      <p className="font-semibold text-gray-900">{doctor.specialization}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Book Appointment</h2>

              {bookingStep === 'select' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlot('');
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {selectedDate && availableSlots.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Select Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`px-3 py-2 rounded-lg font-medium text-sm transition ${
                              selectedSlot === slot
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDate && availableSlots.length === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">No slots available for this date</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe your health concern..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedSlot || !reason}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Book Appointment
                  </button>
                </div>
              ) : bookingStep === 'payment' ? (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-900 font-semibold mb-2">Booking Confirmed!</p>
                    <p className="text-sm text-green-800">
                      Your appointment is pending payment. WhatsApp the doctor to complete the payment.
                    </p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-semibold text-gray-900">{selectedDate} {selectedSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fee:</span>
                      <span className="font-semibold text-gray-900">{doctor.consultationFee}</span>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${doctor.whatsapp.replace(/\D/g, '')}?text=Hi%20Dr.%20${doctor.name.split(' ')[1]}%2C%20I%27ve%20booked%20a%20consultation%20on%20${selectedDate}%20at%20${selectedSlot}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition text-center"
                  >
                    Message on WhatsApp
                  </a>

                  <Link
                    href="/patient/bookings"
                    className="block w-full px-4 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold transition text-center"
                  >
                    View My Bookings
                  </Link>
                </div>
              ) : null}

              {/* Consultation Fee Box */}
              {bookingStep === 'select' && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="text-2xl font-bold text-blue-600">{doctor.consultationFee}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </AuthGuard>
  );
}
