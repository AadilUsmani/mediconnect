'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getBookings() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return bookings.map((b) => ({
    id: b.id,
    patientId: b.patientId,
    doctorId: b.doctorId,
    date: b.date, // already a String in schema
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
    orderBy: { createdAt: 'desc' },
  });
  return bookings.map((b) => ({
    id: b.id,
    patientId: b.patientId,
    doctorId: b.doctorId,
    date: b.date, // already a String in schema
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
    orderBy: { createdAt: 'desc' },
  });
  return bookings.map((b) => ({
    id: b.id,
    patientId: b.patientId,
    doctorId: b.doctorId,
    date: b.date, // already a String in schema
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
      date: data.date, // store as string directly (schema field is String)
      time: data.time,
      reason: data.reason,
      status: data.status || 'pending-payment',
      fee: data.fee,
      paymentScreenshot: data.paymentScreenshot || null,
    },
  });
  revalidatePath('/patient/bookings');
  revalidatePath('/doctor/appointments');
  return {
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  };
}

export async function updateBookingStatus(id: string, updates: any) {
  const booking = await prisma.booking.update({
    where: { id },
    data: {
      status: updates.status,
      paymentScreenshot: updates.paymentScreenshot,
    },
  });
  revalidatePath('/patient/bookings');
  revalidatePath('/doctor/appointments');
  revalidatePath('/admin/dashboard');
  return {
    ...booking,
    createdAt: booking.createdAt.toISOString(),
  };
}
