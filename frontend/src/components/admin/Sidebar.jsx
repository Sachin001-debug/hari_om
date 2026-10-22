'use client';

import { Building2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { siteConfig } from '@/data/siteConfig';
import { adminNav } from '@/config/adminNav';
import SidebarItem from './SidebarItem';

export default function Sidebar({ pathname, admin, logout, collapsed, onToggle, onNavigate, mobile = false }) {
  const initials = (admin?.name || 'Admin').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return <aside className={`flex h-full min-h-0 flex-col border-r border-admin-border bg-admin-surface ${mobile ? 'w-[min(300px,85vw)]' : collapsed ? 'w-[72px]' : 'w-[260px]'}`}>
    <div className={`flex h-20 shrink-0 items-center gap-3 px-5 ${collapsed && !mobile ? 'justify-center px-2' : ''}`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-admin-primary-soft text-admin-primary"><Building2 className="h-5 w-5" /></div>
      {(!collapsed || mobile) && <div className="min-w-0"><div className="truncate text-sm font-semibold text-admin-text">{siteConfig.name}</div><div className="mt-0.5 text-xs text-admin-muted">Admin</div></div>}
      {!mobile && <button type="button" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} className={`ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-lg text-admin-muted hover:bg-admin-bg hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary ${collapsed ? 'absolute left-[52px] top-5 z-10 bg-admin-surface' : ''}`}>
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>}
    </div>

    <nav aria-label="Admin navigation" className="flex-1 space-y-1 px-3 py-4">
      {adminNav.map((item) => <SidebarItem key={item.href} item={item} active={item.href === '/' ? false : pathname === item.href || (item.href === '/admin/dashboard' && pathname === '/admin')} collapsed={collapsed && !mobile} onNavigate={onNavigate} />)}
    </nav>

    <div className={`border-t border-admin-border p-3 ${collapsed && !mobile ? 'flex flex-col items-center' : ''}`}>
      <div className={`flex min-h-12 items-center gap-3 rounded-lg px-2 ${collapsed && !mobile ? 'justify-center px-0' : ''}`}>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-admin-primary-soft text-xs font-semibold text-admin-primary" aria-hidden="true">{initials}</div>
        {(!collapsed || mobile) && <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium text-admin-text">{admin?.name || 'Administrator'}</div><div className="truncate text-xs text-admin-muted">{(admin?.role || 'Admin').replaceAll('_', ' ')}</div></div>}
      </div>
      <button type="button" onClick={logout} title={collapsed && !mobile ? 'Log out' : undefined} aria-label="Log out" className={`mt-2 flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-admin-muted transition-colors duration-150 hover:bg-admin-primary-soft hover:text-admin-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary ${collapsed && !mobile ? 'justify-center px-0' : ''}`}>
        <LogOut className="h-5 w-5 shrink-0" />{(!collapsed || mobile) && <span>Log out</span>}
      </button>
    </div>
  </aside>;
}
