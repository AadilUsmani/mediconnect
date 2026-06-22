'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getDoctors() {
  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });
  return doctors.map((d) => ({
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
    photo: d.photo || '',
    rating: d.rating,
    totalReviews: d.totalReviews,
    isActive: d.isActive,
    joinedDate: d.joinedDate.toISOString(),
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
    photo: doctor.photo || '',
    rating: doctor.rating,
    totalReviews: doctor.totalReviews,
    isActive: doctor.isActive,
  };
}

export async function updateDoctorProfile(id: string, updates: any) {
  const doctorUpdateData: any = {};

  if (updates.specialization !== undefined) doctorUpdateData.specialization = updates.specialization;
  if (updates.licenseNumber !== undefined) doctorUpdateData.licenseNumber = updates.licenseNumber;
  if (updates.experience !== undefined) doctorUpdateData.experience = updates.experience;
  if (updates.consultationFee !== undefined) doctorUpdateData.consultationFee = updates.consultationFee;
  if (updates.whatsapp !== undefined) doctorUpdateData.whatsapp = updates.whatsapp;
  if (updates.bio !== undefined) doctorUpdateData.bio = updates.bio;
  if (updates.isActive !== undefined) doctorUpdateData.isActive = updates.isActive;
  if (updates.schedule !== undefined) doctorUpdateData.schedule = JSON.stringify(updates.schedule);

  const doctor = await prisma.doctor.update({
    where: { userId: id },
    data: doctorUpdateData,
  });

  if (updates.name || updates.email) {
    await prisma.user.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name }),
        ...(updates.email && { email: updates.email }),
      },
    });
  }

  revalidatePath('/doctor/profile');
  revalidatePath('/admin/doctors');
  revalidatePath('/patient/doctors');
  return doctor;
}
