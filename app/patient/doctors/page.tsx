'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { UserAvatar } from '@/components/user-avatar';
import { Sidebar } from '@/components/sidebar';
import Link from 'next/link';
import { MapPin, Search, Settings, Calendar, Users, Clock, Star } from 'lucide-react';
import { SPECIALIZATIONS } from '@/lib/mock-data';
import { AuthGuard } from '@/components/auth-guard';

const patientLinks = [
  { label: 'Overview', href: '/patient/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'Find Doctors', href: '/patient/doctors', icon: <MapPin className="w-4 h-4" /> },
  { label: 'My Bookings', href: '/patient/bookings', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/patient/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function PatientDoctorsPage() {
  const { doctors } = useApp();
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const filtered = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(search.toLowerCase());
      const matchesSpec = !selectedSpecialization || doctor.specialization === selectedSpecialization;
      const matchesPrice = doctor.consultationFee >= priceRange[0] && doctor.consultationFee <= priceRange[1];
      return matchesSearch && matchesSpec && matchesPrice && doctor.isActive;
    });
  }, [search, selectedSpecialization, priceRange, doctors]);

  return (
    <AuthGuard allowedRoles={['patient']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={patientLinks} title="Patient Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Find Doctors</h1>
            <p className="text-gray-600 mt-2">Browse and book consultations with qualified healthcare professionals</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Doctor name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Specialization */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Specialization</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedSpecialization('')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedSpecialization === ''
                          ? 'bg-blue-100 text-blue-600 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All
                    </button>
                    {SPECIALIZATIONS.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => setSelectedSpecialization(spec)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          selectedSpecialization === spec
                            ? 'bg-blue-100 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Fee</label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600 mt-2">Up to {priceRange[1]}</p>
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="lg:col-span-3">
              {filtered.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {filtered.map((doctor) => (
                    <Link key={doctor.id} href={`/patient/doctors/${doctor.id}`}>
                      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100">
                          <div className="flex gap-4">
                            <UserAvatar name={doctor.name} className="w-20 h-20 text-2xl border-4 border-white" />
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">Dr. {doctor.name}</h3>
                              <p className="text-sm text-gray-600">{doctor.specialization}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                                <span className="text-xs text-gray-600">({doctor.totalReviews})</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1">
                          <p className="text-sm text-gray-600 mb-4">{doctor.bio.substring(0, 80)}...</p>

                          <div className="space-y-3 text-sm mb-6">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock className="w-4 h-4 text-blue-600" />
                              {doctor.experience} years experience
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Users className="w-4 h-4 text-blue-600" />
                              Consultation: {doctor.consultationFee}
                            </div>
                          </div>

                          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition">
                            View Profile & Book
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No doctors found matching your criteria</p>
                  <button
                    onClick={() => {
                      setSearch('');
                      setSelectedSpecialization('');
                      setPriceRange([0, 1000]);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
