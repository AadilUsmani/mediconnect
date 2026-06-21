'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, Doctor, Patient, Booking, AdminSettings } from './types';
import { mockDoctors, mockPatients, mockBookings } from './mock-data';

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;

  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (doctorId: string, updates: Partial<Doctor>) => void;
  removeDoctor: (doctorId: string) => void;
  addDoctorSchedule: (doctorId: string, schedule: any) => void;

  // Patients
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  removePatient: (patientId: string) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  getPatientBookings: (patientId: string) => Booking[];
  getDoctorBookings: (doctorId: string) => Booking[];

  // Admin Settings
  adminSettings: AdminSettings;
  updateAdminSettings: (updates: Partial<AdminSettings>) => void;

  // Toast
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    platformName: 'MediConnect',
    announcementBanner: true,
    announcement: 'System maintenance scheduled on Sunday 2 AM to 4 AM IST',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Wrap setCurrentUser to keep it consistent
  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
  }, []);

  const addDoctor = useCallback((doctor: Doctor) => {
    setDoctors((prev) => [...prev, doctor]);
  }, []);

  const updateDoctor = useCallback((doctorId: string, updates: Partial<Doctor>) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, ...updates } : doc))
    );
    // Also update currentUser.data if this is the logged-in doctor
    setCurrentUserState((prev) => {
      if (prev && prev.role === 'doctor' && prev.data && (prev.data as Doctor).id === doctorId) {
        return {
          ...prev,
          name: updates.name || prev.name,
          data: { ...(prev.data as Doctor), ...updates },
        };
      }
      return prev;
    });
  }, []);

  const removeDoctor = useCallback((doctorId: string) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== doctorId));
  }, []);

  const addDoctorSchedule = useCallback((doctorId: string, schedule: any) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId ? { ...doc, schedule } : doc
      )
    );
    // Also update currentUser.data
    setCurrentUserState((prev) => {
      if (prev && prev.role === 'doctor' && prev.data && (prev.data as Doctor).id === doctorId) {
        return {
          ...prev,
          data: { ...(prev.data as Doctor), schedule },
        };
      }
      return prev;
    });
  }, []);

  const addPatient = useCallback((patient: Patient) => {
    setPatients((prev) => [...prev, patient]);
  }, []);

  const updatePatient = useCallback((patientId: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((pat) => (pat.id === patientId ? { ...pat, ...updates } : pat))
    );
    // Also update currentUser.data if this is the logged-in patient
    setCurrentUserState((prev) => {
      if (prev && prev.role === 'patient' && prev.data && (prev.data as Patient).id === patientId) {
        return {
          ...prev,
          name: updates.name || prev.name,
          data: { ...(prev.data as Patient), ...updates },
        };
      }
      return prev;
    });
  }, []);

  const removePatient = useCallback((patientId: string) => {
    setPatients((prev) => prev.filter((pat) => pat.id !== patientId));
  }, []);

  const createBooking = useCallback((booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
  }, []);

  const updateBooking = useCallback((bookingId: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((book) => (book.id === bookingId ? { ...book, ...updates } : book))
    );
  }, []);

  const getPatientBookings = useCallback((patientId: string) => {
    return bookings.filter((b) => b.patientId === patientId);
  }, [bookings]);

  const getDoctorBookings = useCallback((doctorId: string) => {
    return bookings.filter((b) => b.doctorId === doctorId);
  }, [bookings]);

  const logout = useCallback(() => {
    setCurrentUserState(null);
  }, []);

  const updateAdminSettings = useCallback((updates: Partial<AdminSettings>) => {
    setAdminSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        doctors,
        addDoctor,
        updateDoctor,
        removeDoctor,
        addDoctorSchedule,
        patients,
        addPatient,
        updatePatient,
        removePatient,
        bookings,
        createBooking,
        updateBooking,
        getPatientBookings,
        getDoctorBookings,
        adminSettings,
        updateAdminSettings,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg text-white ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                  ? 'bg-red-500'
                  : 'bg-blue-600'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
