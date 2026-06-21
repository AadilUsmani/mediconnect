'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getPatients() {
  const patients = await prisma.patient.findMany({
    include: { user: true },
  });
  
  return patients.map(p => ({
    id: p.userId,
    name: p.user.name,
    email: p.user.email,
    dateOfBirth: p.dateOfBirth.toISOString().split('T')[0],
    gender: p.gender,
    phone: p.phone,
    emergencyContact: p.emergencyContact,
    photo: '',
  }));
}

export async function getPatientById(id: string) {
  const p = await prisma.patient.findUnique({
    where: { userId: id },
    include: { user: true },
  });
  
  if (!p) return null;
  
  return {
    id: p.userId,
    name: p.user.name,
    email: p.user.email,
    dateOfBirth: p.dateOfBirth.toISOString().split('T')[0],
    gender: p.gender,
    phone: p.phone,
    emergencyContact: p.emergencyContact,
    photo: '',
  };
}

export async function updatePatientProfile(id: string, updates: any) {
  const patient = await prisma.patient.update({
    where: { userId: id },
    data: {
      dateOfBirth: updates.dateOfBirth ? new Date(updates.dateOfBirth) : undefined,
      gender: updates.gender,
      phone: updates.phone,
      emergencyContact: updates.emergencyContact,
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

  revalidatePath('/patient/profile');
  revalidatePath('/admin/patients');
  return patient;
}
