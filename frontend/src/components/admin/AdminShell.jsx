'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileBottomNav from './MobileBottomNav';

export default function AdminShell({ children }) {
  const { admin, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const triggerRef = useRef(null);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const pageTitles = {
    '/admin/settings': 'Settings',
    '/admin/add-property': 'Add Property',
    '/admin/properties': 'Properties',
  };
  const title = pageTitles[pathname] || 'Dashboard';

  useEffect(() => { closeDrawer(); }, [pathname, closeDrawer]);
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { closeDrawer(); triggerRef.current?.focus(); }
      if (event.key !== 'Tab') return;
      const nodes = drawerRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!nodes?.length) return;
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); };
  }, [drawerOpen, closeDrawer]);

  return <div className="admin-theme min-h-dvh bg-admin-bg text-admin-text">
    <div className="flex min-h-dvh">
      <div className="hidden shrink-0 lg:block"><div className="fixed inset-y-0 left-0 z-20 transition-[width] duration-150"><Sidebar pathname={pathname} admin={admin} logout={logout} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} /></div><div className={collapsed ? 'w-[72px]' : 'w-[260px]'} /></div>
      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        <Topbar title={title} admin={admin} logout={logout} onOpenMenu={(event) => { triggerRef.current = event.currentTarget; setDrawerOpen(true); }} />
        <main className="w-full flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
      </div>
    </div>
    <MobileBottomNav pathname={pathname} />
    {drawerOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button type="button" aria-label="Close navigation menu" onClick={() => { closeDrawer(); triggerRef.current?.focus(); }} className="absolute inset-0 h-full w-full bg-admin-text/40" />
      <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Admin navigation" className="absolute inset-y-0 left-0 flex max-w-[85vw] shadow-lg">
        <Sidebar pathname={pathname} admin={admin} logout={logout} collapsed={false} mobile onNavigate={closeDrawer} />
        <button type="button" aria-label="Close navigation menu" onClick={() => { closeDrawer(); triggerRef.current?.focus(); }} className="absolute right-3 top-4 grid h-11 w-11 place-items-center rounded-lg bg-admin-surface text-admin-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary"><X className="h-5 w-5" /></button>
      </div>
    </div>}
  </div>;
}
