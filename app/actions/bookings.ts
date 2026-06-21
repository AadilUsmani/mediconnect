'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getBookings() {
  const bookings = await prisma.booking.findMany();
  return bookings.map(b => ({
    id: b.id,
    patientId: b.patientId,
    doctorId: b.doctorId,
    date: b.date.toISOString().split('T')[0],
    time: b.time,
    reason: b.reason,
    status: b.status,
    fee: b.fee,
    paymentScreenshot: b.paymentScreenshot || undefined,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function getPatientBookings(patientId: string) {
  const bookings = await prisma.booking.findMany({
    where: { patientId },
  });
  return bookings.map(b => ({
    id: b.id,
    patientId: b.patientId,
    doctorId: b.doctorId,
    date: b.date.toISOString().split('T')[0],
    time: b.time,
    reason: b.reason,
    status: b.status,
    fee: b.fee,
    paymentScreenshot: b.paymentScreenshot || undefined,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function getDoctorBookings(doctorId: string) {
  const bookings = await prisma.booking.findMany({
    where: { doctorId },
  });
  return bookings.map(b => ({
    id: b.id,
    patientId: b.patientId,
    doctorId: b.doctorId,
    date: b.date.toISOString().split('T')[0],
    time: b.time,
    reason: b.reason,
    status: b.status,
    fee: b.fee,
    paymentScreenshot: b.paymentScreenshot || undefined,
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function createBooking(data: any) {
  const booking = await prisma.booking.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      date: new Date(data.date),
      time: data.time,
      reason: data.reason,
      status: data.status || 'pending-payment',
      fee: data.fee,
      paymentScreenshot: data.paymentScreenshot,
    }
  });
  revalidatePath('/patient/bookings');
  revalidatePath('/doctor/appointments');
  return booking;
}

export async function updateBookingStatus(id: string, updates: any) {
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: updates.status,
      paymentScreenshot: updates.paymentScreenshot,
    }
  });
  revalidatePath('/patient/bookings');
  revalidatePath('/doctor/appointments');
  revalidatePath('/admin/dashboard');
  return booking;
}
