'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/app-context';
import { Shield, ArrowLeft } from 'lucide-react';
import { loginUser } from '@/app/actions/auth';

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'role'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setCurrentUser } = useApp();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      if (result.success) {
        setCurrentUser(result.user);
        if (result.user.role === 'patient') {
          router.push('/patient/dashboard');
        } else if (result.user.role === 'doctor') {
          router.push('/doctor/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setErrorMsg(result.message || 'Login failed.');
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-blue-600">MediConnect</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {step === 'role' && (
            <button
              onClick={() => setStep('login')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          )}

          {step === 'login' ? (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600 mb-8">Sign in with your email and password to continue</p>

              {errorMsg && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-gray-600 mt-6">
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setStep('role')}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign up
                </button>
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">How do you want to use MediConnect?</h1>
              <p className="text-gray-600 mb-8">Choose your account type to create a new account</p>

              <div className="space-y-4">
                <button
                  onClick={() => router.push('/patient/onboarding')}
                  className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient</h3>
                  <p className="text-gray-600">Book consultations with doctors and manage your health</p>
                </button>

                <button
                  onClick={() => router.push('/doctor/onboarding')}
                  className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Doctor</h3>
                  <p className="text-gray-600">Offer consultations and manage your practice online</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
