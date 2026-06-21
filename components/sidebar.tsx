'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/app-context';
import { Shield, Menu, X } from 'lucide-react';
import { UserAvatar } from '@/components/user-avatar';
import { useState } from 'react';

interface SidebarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export function Sidebar({
  links,
  title,
}: {
  links: SidebarLink[];
  title: string;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white border border-gray-200 rounded-lg"
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 p-6 flex flex-col transition-all lg:relative lg:translate-x-0 ${
          open ? 'translate-x-0 z-40' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <Shield className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-blue-600">MediConnect</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                pathname === link.href
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="flex items-center gap-3">
            {currentUser?.name && <UserAvatar name={currentUser.name} />}
            <div className="text-sm">
              <p className="text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-900">{currentUser?.name || currentUser?.email}</p>
              <p className="text-xs text-gray-500 capitalize mt-1">{currentUser?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setOpen(false)} />}
    </>
  );
}
