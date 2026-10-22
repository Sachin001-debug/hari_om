import { LayoutDashboard, Home, Settings } from 'lucide-react';

export const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Home', href: '/', icon: Home, external: true },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];
