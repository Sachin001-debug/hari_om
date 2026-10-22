'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) router.replace('/admin/login');
  }, [isAuthenticated, isLoading, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (isLoading) return <div className="admin-theme flex min-h-dvh flex-col items-center justify-center bg-admin-bg text-admin-text"><Loader2 className="mb-4 h-10 w-10 animate-spin text-admin-primary" /><p className="text-sm font-medium text-admin-muted">Verifying administrator session...</p></div>;
  if (!isAuthenticated) return null;
  return <AdminShell>{children}</AdminShell>;
}
