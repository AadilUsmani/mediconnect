'use client';

import { useState } from 'react';
import { useApp } from '@/lib/app-context';
import { Sidebar } from '@/components/sidebar';
import { Calendar, Users, Clock, Settings, X, Plus, DollarSign } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOT_DURATIONS = ['15', '30', '45', '60'];

const doctorLinks = [
  { label: 'Overview', href: '/doctor/dashboard', icon: <Users className="w-4 h-4" /> },
  { label: 'My Schedule', href: '/doctor/schedule', icon: <Calendar className="w-4 h-4" /> },
  { label: 'Appointments', href: '/doctor/appointments', icon: <Clock className="w-4 h-4" /> },
  { label: 'Earnings', href: '/doctor/earnings', icon: <DollarSign className="w-4 h-4" /> },
  { label: 'Profile Settings', href: '/doctor/profile', icon: <Settings className="w-4 h-4" /> },
];

export default function DoctorSchedulePage() {
  const { currentUser, addDoctorSchedule, updateDoctor, showToast } = useApp();
  const doctorData = currentUser?.data as any;
  const [slotDuration, setSlotDuration] = useState('30');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [newSlot, setNewSlot] = useState('');
  const [schedule, setSchedule] = useState(doctorData?.schedule || {});

  const generateTimeSlots = (start: string, end: string, duration: string): string[] => {
    const slots: string[] = [];
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const durationMins = parseInt(duration);

    let currentTime = startH * 60 + startM;
    const endTimeMins = endH * 60 + endM;

    while (currentTime < endTimeMins) {
      const hours = Math.floor(currentTime / 60);
      const mins = currentTime % 60;
      slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
      currentTime += durationMins;
    }

    return slots;
  };

  const handleGenerateSlots = () => {
    const timeSlots = generateTimeSlots(startTime, endTime, slotDuration);
    const newSchedule = { ...schedule };

    selectedDays.forEach((day) => {
      newSchedule[day] = timeSlots;
    });

    setSchedule(newSchedule);
    showToast('Schedule updated successfully', 'success');
  };

  const handleAddSlot = (day: string) => {
    if (newSlot && newSlot.match(/^\d{2}:\d{2}$/)) {
      if (!schedule[day]) schedule[day] = [];
      if (!schedule[day].includes(newSlot)) {
        setSchedule({
          ...schedule,
          [day]: [...schedule[day], newSlot].sort(),
        });
        setNewSlot('');
      }
    }
  };

  const handleRemoveSlot = (day: string, slot: string) => {
    setSchedule({
      ...schedule,
      [day]: schedule[day].filter((s: string) => s !== slot),
    });
  };

  const handleSaveSchedule = () => {
    if (doctorData?.id) {
      addDoctorSchedule(doctorData.id, schedule);
      showToast('Schedule saved successfully', 'success');
    }
  };

  return (
    <AuthGuard allowedRoles={['doctor']} redirectTo="/login">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar links={doctorLinks} title="Doctor Dashboard" />

        <main className="flex-1 p-6 lg:p-8 overflow-hidden">
          <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
            <p className="text-gray-600 mt-2">Manage your availability and consultation slots</p>
          </div>

          {/* Schedule Builder */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Weekly Schedule</h2>

            <div className="space-y-6">
              {/* Days Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Working Days</label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() =>
                        setSelectedDays(
                          selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day]
                        )
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        selectedDays.includes(day)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slot Duration (minutes)</label>
                  <select
                    value={slotDuration}
                    onChange={(e) => setSlotDuration(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {SLOT_DURATIONS.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur} minutes
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateSlots}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Generate Slots
              </button>
            </div>
          </div>

          {/* Weekly Schedule Display */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Weekly Timetable</h2>
              <button
                onClick={handleSaveSchedule}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition"
              >
                Save Schedule
              </button>
            </div>

            <div className="space-y-6">
              {DAYS.map((day) => (
                <div key={day} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{day}</h3>
                    <span className="text-sm text-gray-600">{schedule[day]?.length || 0} slots</span>
                  </div>

                  {/* Time Slots */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {schedule[day]?.map((slot: string) => (
                      <div
                        key={slot}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <span className="text-sm font-medium text-blue-600">{slot}</span>
                        <button
                          onClick={() => handleRemoveSlot(day, slot)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Slot */}
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newSlot}
                      onChange={(e) => setNewSlot(e.target.value)}
                      placeholder="HH:MM"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleAddSlot(day)}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}
