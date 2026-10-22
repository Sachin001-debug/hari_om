export default function StatCard({ icon: Icon, label, value = '0', hint, loading = false }) {
  return <article className="flex min-w-0 items-center gap-3 rounded-xl border border-admin-border bg-admin-surface p-4 shadow-[0_1px_3px_rgb(31_41_55/0.04)] transition-colors duration-150 hover:border-admin-primary/40 sm:gap-4 sm:p-5">
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-admin-primary-soft text-admin-primary sm:h-12 sm:w-12"><Icon aria-hidden="true" className="h-5 w-5 sm:h-5 sm:w-5" /></div>
    <div className="min-w-0">
      {loading ? <><div className="mb-2 h-7 w-10 animate-pulse rounded bg-admin-bg" /><div className="mb-2 h-4 w-24 animate-pulse rounded bg-admin-bg" /><div className="h-3 w-20 animate-pulse rounded bg-admin-bg" /></> : <><div className="text-2xl font-semibold leading-7 text-admin-text">{value}</div><div className="mt-1 truncate text-sm font-medium text-admin-text">{label}</div><div className="mt-0.5 truncate text-xs text-admin-muted">{hint}</div></>}
    </div>
  </article>;
}
