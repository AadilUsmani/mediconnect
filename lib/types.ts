export type UserRole = 'patient' | 'doctor' | 'admin';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  photo: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  whatsapp: string;
  bio: string;
  rating: number;
  totalReviews: number;
  isActive: boolean;
  joinedDate: string;
  schedule: DoctorSchedule;
}

export interface DoctorSchedule {
  [key: string]: string[]; // { 'Monday': ['09:00', '09:30', '10:00'], ... }
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  photo: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  emergencyContact: string;
}

export interface Booking {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending-payment' | 'payment-uploaded' | 'confirmed' | 'completed' | 'cancelled';
  paymentScreenshot?: string;
  fee: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  data: Patient | Doctor | null;
}

export interface AdminSettings {
  platformName: string;
  announcementBanner: boolean;
  announcement: string;
}
