'use client';

import { adminNav } from '@/config/adminNav';
import Link from 'next/link';

export default function MobileBottomNav({ pathname }) {
  return <nav aria-label="Admin tabs" className="fixed inset-x-0 bottom-0 z-30 border-t border-admin-border bg-admin-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
    <div className="grid h-16 grid-cols-5">
      {adminNav.map((item) => {
        const Icon = item.icon;
        const active = !item.external && (pathname === item.href || (item.href === '/admin/dashboard' && pathname === '/admin'));
        const className = `flex min-h-11 flex-col items-center justify-center gap-1 text-[9px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-primary sm:text-[10px] ${active ? 'text-admin-primary' : 'text-admin-muted hover:text-admin-text'}`;
        const children = <><Icon aria-hidden="true" className="h-5 w-5" /><span>{item.label}</span></>;
        return item.external
          ? <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
          : <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={className}>{children}</Link>;
      })}
    </div>
  </nav>;
}
