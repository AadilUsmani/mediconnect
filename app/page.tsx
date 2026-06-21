'use client';

import Link from 'next/link';
import { Check, Calendar, Users, Shield, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">MediConnect</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-700 hover:text-gray-900 font-medium">
              Sign In
            </Link>
            <Link href="/admin/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with Trusted Doctors, Anytime
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Book consultations with qualified healthcare professionals in minutes. Get expert medical advice from the comfort of your home.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-24 h-24 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Healthcare at your fingertips</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How MediConnect Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Browse Doctors', desc: 'Explore our network of verified healthcare professionals across multiple specializations.' },
              { step: '2', title: 'Check Availability', desc: 'View doctor schedules and select a time slot that works for you.' },
              { step: '3', title: 'Consultation Ready', desc: 'Pay for your consultation and get confirmed appointment within minutes.' },
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 transition">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Specializations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['General Medicine', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology'].map((spec) => (
              <div key={spec} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-gray-900 font-medium">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose MediConnect?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { icon: Users, title: 'Verified Doctors', desc: 'All our doctors are licensed and verified healthcare professionals.' },
              { icon: Calendar, title: 'Flexible Scheduling', desc: 'Book appointments at times that work best for your schedule.' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your health information is encrypted and kept completely confidential.' },
              { icon: Check, title: 'Quick Confirmations', desc: 'Get instant booking confirmations and appointment reminders.' },
            ].map((feature, i) => (
              <div key={i} className="flex gap-4">
                <feature.icon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of patients booking consultations with trusted doctors.</p>
          <Link href="/login" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold">
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 MediConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
