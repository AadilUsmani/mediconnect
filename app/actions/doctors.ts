'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getDoctors() {
  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });
  return doctors.map(d => ({
    id: d.userId,
    name: d.user.name,
    email: d.user.email,
    specialization: d.specialization,
    licenseNumber: d.licenseNumber,
    experience: d.experience,
    consultationFee: d.consultationFee,
    whatsapp: d.whatsapp,
    bio: d.bio,
    schedule: JSON.parse(d.schedule || '{}'),
    // Defaults for UI
    photo: '', 
    rating: 0,
    totalReviews: 0,
    isActive: true,
    joinedDate: new Date().toISOString(),
  }));
}

export async function getDoctorById(id: string) {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: id },
    include: { user: true },
  });
  
  if (!doctor) return null;
  
  return {
    id: doctor.userId,
    name: doctor.user.name,
    email: doctor.user.email,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    experience: doctor.experience,
    consultationFee: doctor.consultationFee,
    whatsapp: doctor.whatsapp,
    bio: doctor.bio,
    schedule: JSON.parse(doctor.schedule || '{}'),
    photo: '',
    rating: 0,
    totalReviews: 0,
    isActive: true,
  };
}

export async function updateDoctorProfile(id: string, updates: any) {
  const doctor = await prisma.doctor.update({
    where: { userId: id },
    data: {
      specialization: updates.specialization,
      licenseNumber: updates.licenseNumber,
      experience: updates.experience,
      consultationFee: updates.consultationFee,
      whatsapp: updates.whatsapp,
      bio: updates.bio,
      schedule: updates.schedule ? JSON.stringify(updates.schedule) : undefined,
    },
  });

  if (updates.name || updates.email) {
    await prisma.user.update({
      where: { id },
      data: {
        name: updates.name,
        email: updates.email,
      }
    });
  }

  revalidatePath('/doctor/profile');
  revalidatePath('/admin/doctors');
  revalidatePath('/patient/doctors');
  return doctor;
}
