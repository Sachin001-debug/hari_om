'use client'


export default function PageHeader({ title, description, meta, actions, className }) {
  return (
    <header
      className={[
        "flex flex-col gap-4 border-b border-admin-border pb-5",
        "sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Title + description */}
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-admin-fg sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-admin-muted">
            {description}
          </p>
        )}
      </div>

      {/* Meta (date, status, etc.) + optional actions */}
      {(meta || actions) && (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {meta && (
            <div className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-admin-surface px-3 py-1.5 text-xs font-medium text-admin-muted">
              {meta}
            </div>
          )}
          {actions}
        </div>
      )}
    </header>
  );
}