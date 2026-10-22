import { Activity, Clock3, FileText, House } from 'lucide-react';

const overview = [
  { label: 'Total Content', value: '0', icon: FileText },
  { label: 'Listings Live', value: '0', icon: House },
  { label: 'Last Login', value: 'Today', icon: Clock3 },
  { label: 'System Status', value: 'Active', icon: Activity },
];

export default function SystemOverview({ lastLogin = '—' }) {
  const items = overview.map((item) => item.label === 'Last Login' ? { ...item, value: lastLogin } : item);
  return <section className="rounded-xl border border-admin-border bg-admin-surface shadow-[0_1px_3px_rgb(31_41_55/0.04)] transition-colors duration-150 hover:border-admin-primary/30">
    <div className="border-b border-admin-border px-5 py-4 sm:px-6"><h2 className="text-base font-semibold text-admin-text">System Overview</h2></div>
    <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6">
      {items.map(({ label, value, icon: Icon }) => <div key={label} className="flex min-w-0 items-center gap-3 rounded-lg border border-admin-border p-3 sm:p-4"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-admin-primary-soft text-admin-primary"><Icon aria-hidden="true" className="h-5 w-5" /></div><div className="min-w-0"><div className="truncate text-base font-semibold text-admin-text">{value}</div><div className="mt-0.5 truncate text-xs text-admin-muted">{label}</div></div></div>)}
    </div>
  </section>;
}
