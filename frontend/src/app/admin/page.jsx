'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  Users,
  ShieldCheck,
  FileCheck2,
  PlusCircle,
  Clock,
  KeyRound,
  Server,
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { admin } = useAuth();

  const formattedLastLogin = admin?.lastLoginAt
    ? new Date(admin.lastLoginAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'First session today';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Authenticated Session Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {admin?.name || 'Administrator'}!
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Hari Om Real Estate administrative control center. Manage properties, review buyer inquiries, and monitor security telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/#listings"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-orange-600/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Browse Public Catalog</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Catalog Listings
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">48 Properties</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-400 font-medium">18 Lands</span> • <span>30 Residential Homes</span>
          </div>
        </div>

        {/* Inquiries */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Client Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">24 Inquiries</div>
          <div className="text-xs text-slate-500 mt-1">
            <span className="text-orange-400 font-medium">8 new</span> in Butwal & Tilottama
          </div>
        </div>

        {/* Title Verification */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Title Assurance Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">100% Verified</div>
          <div className="text-xs text-emerald-400/90 mt-1">
            Clean titles guaranteed
          </div>
        </div>

        {/* Security Posture */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Security System
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">Hardened</div>
          <div className="text-xs text-purple-300 mt-1">
            Argon2id + Dual JWT Rotating
          </div>
        </div>
      </div>

      {/* Main Details: Administrator Session & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Administrator Profile Card */}
        <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-orange-400" />
            Administrator Credentials
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                Account Name
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {admin?.name}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                Email Address
              </div>
              <div className="text-sm font-medium text-slate-200 mt-0.5">
                {admin?.email}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                Assigned Role
              </div>
              <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {admin?.role}
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center gap-3">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <div className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                  Last Login Recorded
                </div>
                <div className="text-xs font-medium text-slate-300 mt-0.5">
                  {formattedLastLogin}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Backend Infrastructure Telemetry */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Live Backend Infrastructure Telemetry
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Sequelize Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Data Layer
              </div>
              <p className="text-slate-400 leading-relaxed">
                Sequelize v6 ORM configured with pooled MySQL connections (Port 3307), UTC timezone, and versioned migrations.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2">
              <div className="font-semibold text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                Session Architecture
              </div>
              <p className="text-slate-400 leading-relaxed">
                Rotating refresh tokens with automatic replay reuse detection, SHA-256 token hashing, and CSRF protection.
              </p>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Quick Administrative Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/listings"
                className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-slate-200 text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>View Property Listings</span>
                <span className="text-slate-500">→</span>
              </Link>
              <Link
                href="/about"
                className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-slate-200 text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Agency About Us</span>
                <span className="text-slate-500">→</span>
              </Link>
              <a
                href="http://localhost:5000/api/health"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/60 text-slate-200 text-xs font-medium flex items-center justify-between transition-colors"
              >
                <span>Raw Health API (/health)</span>
                <span className="text-slate-500">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

