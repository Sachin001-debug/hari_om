'use client';

import Link from 'next/link';
import { ArrowUpRight, Plus, Settings, Globe2 } from 'lucide-react';

export default function QuickActions() {
  return <section className="rounded-xl border border-admin-border bg-admin-surface shadow-[0_1px_3px_rgb(31_41_55/0.04)] transition-colors duration-150 hover:border-admin-primary/30">
    <div className="border-b border-admin-border px-5 py-4 sm:px-6"><h2 className="text-base font-semibold text-admin-text">Quick Actions</h2></div>
    <div className="space-y-3 p-4 sm:p-5">
      <button type="button" disabled className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg bg-admin-primary px-4 py-3 text-left text-sm font-medium text-white opacity-80 disabled:cursor-not-allowed"><span className="flex items-center gap-3"><Plus className="h-5 w-5" />Add Listing</span><span className="shrink-0 rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium">Coming soon</span></button>
      <Link href="/" className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-admin-primary px-4 py-3 text-sm font-medium text-admin-primary transition-colors duration-150 hover:bg-admin-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary"><span className="flex items-center gap-3"><Globe2 className="h-5 w-5" />View Website</span><ArrowUpRight className="h-4 w-4" /></Link>
      <Link href="/admin/settings" className="flex min-h-11 w-full items-center gap-3 rounded-lg border border-admin-border px-4 py-3 text-sm font-medium text-admin-text transition-colors duration-150 hover:border-admin-primary hover:text-admin-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary"><Settings className="h-5 w-5" />Settings</Link>
    </div>
  </section>;
}
