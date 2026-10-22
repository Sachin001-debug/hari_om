'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export default function SidebarItem({ item, active, collapsed = false, onNavigate }) {
  const Icon = item.icon;
  const classes = `group relative flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-primary ${active ? 'bg-admin-primary-soft text-admin-primary' : 'text-admin-muted hover:bg-admin-bg hover:text-admin-text'} ${collapsed ? 'justify-center px-0' : ''}`;
  const content = <>
    <Icon aria-hidden="true" className={`h-5 w-5 shrink-0 ${active ? 'text-admin-primary' : ''}`} />
    <span className={collapsed ? 'sr-only' : 'truncate'}>{item.label}</span>
    {item.external && !collapsed && <ExternalLink aria-hidden="true" className="ml-auto h-3.5 w-3.5" />}
    {active && !collapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-admin-primary" />}
    {collapsed && <span className="pointer-events-none absolute left-full z-50 ml-3 hidden whitespace-nowrap rounded-md border border-admin-border bg-admin-surface px-2 py-1 text-xs text-admin-text shadow-sm group-hover:block group-focus-visible:block">{item.label}</span>}
  </>;

  if (item.external) return <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} onClick={onNavigate} className={classes}>{content}</a>;
  return <Link href={item.href} aria-label={item.label} aria-current={active ? 'page' : undefined} onClick={onNavigate} className={classes}>{content}</Link>;
}
