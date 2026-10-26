import { Building2, LayoutDashboard, Home, Plus, Settings } from 'lucide-react';

export const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Properties', href: '/admin/properties', icon: Building2 },
  { label: 'Add Property', href: '/admin/add-property', icon: Plus },
  { label: 'Home', href: '/', icon: Home, external: true },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];
