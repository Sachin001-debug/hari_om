'use client';

import Link from 'next/link';
import { ArrowUpRight, Plus, Settings, Globe2 } from 'lucide-react';
import { adminNav } from '@/config/adminNav';

export default function QuickActions() {
  const addPropertyHref = adminNav.find((item) => item.label === 'Add Property')?.href || '/admin/add-property';

  return <section className="rounded-xl border border-admin-border bg-admin-surface shadow-[0_1px_3px_rgb(31_41_55/0.04)] transition-colors duration-150 hover:border-admin-primary/30">
    <div className="border-b border-admin-border px-5 py-3 sm:px-6"><h2 className="text-sm font-semibold text-admin-text">Quick Actions</h2></div>
    <div className="space-y-3 p-4 sm:p-5">
      <Link href={addPropertyHref} className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg bg-admin-primary px-3 py-2.5 text-left text-xs font-medium text-white transition-colors hover:bg-admin-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary focus-visible:ring-offset-2"><span className="flex items-center gap-3"><Plus className="h-4 w-4" />Add Property</span><ArrowUpRight className="h-4 w-4" /></Link>
      <Link href="/" className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg border border-admin-primary px-3 py-2.5 text-xs font-medium text-admin-primary transition-colors duration-150 hover:bg-admin-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary"><span className="flex items-center gap-3"><Globe2 className="h-4 w-4" />View Website</span><ArrowUpRight className="h-4 w-4" /></Link>
      <Link href="/admin/settings" className="flex min-h-10 w-full items-center gap-3 rounded-lg border border-admin-border px-3 py-2.5 text-xs font-medium text-admin-text transition-colors duration-150 hover:border-admin-primary hover:text-admin-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary"><Settings className="h-4 w-4" />Settings</Link>
    </div>
  </section>;
}
