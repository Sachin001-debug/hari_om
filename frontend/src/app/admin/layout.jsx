'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  LogOut,
  Building2,
  ExternalLink,
  Loader2,
  User,
  LayoutDashboard
} from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';

export default function AdminLayout({ children }) {
  const { admin, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // If this is the login page, render children directly without dashboard chrome
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500 mb-4" />
        <p className="text-slate-400 text-sm font-medium">Verifying Administrator Session...</p>
      </div>
    );
  }

  // If not authenticated, prevent flash of content before redirect
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand / Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-md shadow-orange-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                {siteConfig.name}
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Admin Portal
                </span>
              </span>
            </div>
          </div>

          {/* Right: Quick actions, Admin profile & Logout */}
          <div className="flex items-center gap-4">
            {/* Link to public website */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin badge */}
            <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-slate-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {admin?.name}
                </div>
                <div className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">
                  {admin?.role?.replace('_', ' ')}
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-4 h-4" />
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                title="Sign out of Admin Portal"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-red-100 border border-red-900/40 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

