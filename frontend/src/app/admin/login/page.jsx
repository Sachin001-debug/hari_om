'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both your administrator email and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Very subtle background tint */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-orange-50/50 to-transparent pointer-events-none" />

      {/* Brand Header (Above Card) */}
      <div className="flex flex-col items-center mb-8 relative z-10">
        {/* Logo Placeholder - replace with actual image if you have one */}
        <div className="w-16 h-16 bg-orange-600 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 p-2">
      <p className='text-white font-bold'>Logo</p>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">
          {siteConfig.name}
        </h1>
        <p className="text-sm text-slate-500 mb-4">Administrative Management System</p>
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure Admin Portal
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 sm:p-8 relative z-10">
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500">Enter your credentials to access the admin panel</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email / Username */}
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-4 pr-11 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 mt-2 cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 text-white text-sm font-medium transition-colors hover:bg-orange-700 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Copyright */}
      <div className="mt-8 text-center text-xs text-slate-400 relative z-10">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </div>
  );
}