'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, AdminSettings } from './types';
import { logoutUser } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

interface AppContextType {
  // Auth
  currentUser: any | null;
  setCurrentUser: (user: any | null) => void;
  logout: () => void;

  // Admin Settings
  adminSettings: AdminSettings;
  updateAdminSettings: (updates: Partial<AdminSettings>) => void;

  // Toast
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children, initialSession }: { children: ReactNode, initialSession: any }) {
  const [currentUser, setCurrentUserState] = useState<any | null>(initialSession?.user || null);
  const router = useRouter();

  const [adminSettings, setAdminSettings] = useState<AdminSettings>({
    platformName: 'MediConnect',
    announcementBanner: true,
    announcement: 'System maintenance scheduled on Sunday 2 AM to 4 AM IST',
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const setCurrentUser = useCallback((user: any | null) => {
    setCurrentUserState(user);
  }, []);

  const logout = useCallback(async () => {
    setCurrentUserState(null);
    await logoutUser();
    router.push('/login');
    router.refresh();
  }, [router]);

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
