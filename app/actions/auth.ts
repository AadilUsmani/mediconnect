'use server';

import { prisma } from '@/lib/db';
import * as argon2 from 'argon2';

export async function registerUser(data: any) {
  try {
    const { email, password, name, role, additionalData } = data;

    // Server-side validation
    if (!email || !password || !name || !role) {
      return { success: false, message: 'All fields are required.' };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // Password validation
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { success: false, message: 'Password does not meet complexity requirements.' };
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user and profile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

      if (role === 'doctor') {
        await tx.doctor.create({
          data: {
            userId: user.id,
            specialization: additionalData.specialization || '',
            licenseNumber: additionalData.licenseNumber || '',
            experience: additionalData.experience ? parseInt(additionalData.experience) : 0,
            consultationFee: additionalData.consultationFee ? parseFloat(additionalData.consultationFee) : 0,
            whatsapp: additionalData.whatsapp || '',
            bio: additionalData.bio || '',
            schedule: '{}',
          },
        });
      } else if (role === 'patient') {
        await tx.patient.create({
          data: {
            userId: user.id,
            dateOfBirth: additionalData.dateOfBirth ? new Date(additionalData.dateOfBirth) : new Date(),
            gender: additionalData.gender || 'other',
            phone: additionalData.phone || '',
            emergencyContact: additionalData.emergencyContact || '',
          },
        });
      }

      return user;
    });

    return { success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role } };

  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, message: 'An unexpected error occurred during registration.' };
  }
}

export async function loginUser(data: any) {
  try {
    const { email, password } = data;

    if (!email || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        doctor: true,
        patient: true,
      }
    });

    if (!user) {
      return { success: false, message: 'Invalid credentials. User not found.' };
    }

    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return { success: false, message: 'Invalid credentials. Incorrect password.' };
    }

    // Prepare response object matching frontend context needs
    const userData: any = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      data: null,
    };

    if (user.role === 'doctor' && user.doctor) {
      userData.data = {
        ...user.doctor,
        schedule: JSON.parse(user.doctor.schedule || '{}'),
      };
    } else if (user.role === 'patient' && user.patient) {
      userData.data = {
        ...user.patient,
        dateOfBirth: user.patient.dateOfBirth.toISOString(),
      };
    }

    return { success: true, user: userData };

  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, message: 'An unexpected error occurred during login.' };
  }
}
