'use client';

import { Home, LogOut, Menu } from 'lucide-react';

export default function Topbar({ title, admin, logout, onOpenMenu }) {
  const initials = (admin?.name || 'Admin').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-admin-border bg-admin-surface px-4 sm:px-6 lg:px-8">
    <div className="flex min-w-0 items-center gap-3">
      <button type="button" onClick={onOpenMenu} aria-label="Open navigation menu" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-admin-muted hover:bg-admin-bg hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary lg:hidden"><Menu className="h-5 w-5" /></button>
      <div className="flex min-w-0 items-center gap-2"><Home aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-admin-primary sm:block" /><h1 className="truncate text-base font-semibold text-admin-text sm:text-lg">{title}</h1></div>
    </div>
    <div className="flex shrink-0 items-center gap-3">
      <div className="hidden text-right sm:block"><div className="max-w-48 truncate text-sm font-medium text-admin-text">{admin?.name || 'Administrator'}</div><div className="mt-0.5 inline-flex rounded-full bg-admin-primary-soft px-2 py-0.5 text-[11px] font-medium capitalize text-admin-primary">{(admin?.role || 'Admin').replaceAll('_', ' ')}</div></div>
      <div aria-label={admin?.name || 'Administrator'} className="grid h-9 w-9 place-items-center rounded-full bg-admin-primary-soft text-xs font-semibold text-admin-primary sm:hidden">{initials}</div>
      <button type="button" onClick={logout} className="hidden min-h-11 items-center gap-2 rounded-lg border border-admin-border px-3 text-sm font-medium text-admin-muted transition-colors duration-150 hover:border-admin-primary hover:text-admin-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary lg:inline-flex"><LogOut className="h-4 w-4" />Logout</button>
    </div>
  </header>;
}
