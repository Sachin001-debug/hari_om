"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Building2, CalendarDays, CheckCircle2, CircleDollarSign,
  Home, Mail, Map, Star, BadgeCheck,
} from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import SystemOverview from "@/components/admin/SystemOverview";
import QuickActions from "@/components/admin/QuickActions";

const propertyStats = [
  { label: "Total Listings", hint: "All properties", icon: Building2, value: 0 },
  { label: "Active Listings", hint: "Currently live", icon: CheckCircle2, value: 0 },
  { label: "Houses", hint: "Residential homes", icon: Home, value: 0 },
  { label: "Plots", hint: "Land listings", icon: Map, value: 0 },
];

const activityStats = [
  { label: "Featured", hint: "Highlighted on site", icon: Star, value: 0 },
  { label: "Enquiries", hint: "Total received", icon: Mail, value: 0 },
  { label: "Negotiable", hint: "Open to offers", icon: CircleDollarSign, value: 0 },
  { label: "Sold", hint: "Completed sales", icon: BadgeCheck, value: 0 },
];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric",
});
const loginFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium", timeStyle: "short",
});

function StatCard({ label, hint, icon: Icon, value }) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-admin-border bg-admin-card p-5 shadow-sm transition-all hover:border-admin-accent/40 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-admin-accent/10 text-admin-accent transition-colors group-hover:bg-admin-accent/15">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-2xl font-semibold tabular-nums text-admin-fg">
          {value}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-admin-fg">{label}</p>
        <p className="mt-0.5 text-xs text-admin-muted">{hint}</p>
      </div>
    </div>
  );
}

function StatGroup({ title, items }) {
  return (
    <section aria-label={title} className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-admin-muted">
          {title}
        </h2>
        <span className="h-px flex-1 bg-admin-border" />
        <span className="rounded-full border border-admin-border px-2 py-0.5 text-[11px] font-medium text-admin-muted">
          {items.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const firstName = admin?.name?.split(" ")[0];
  const lastLogin = admin?.lastLoginAt ? loginFormat.format(new Date(admin.lastLoginAt)) : "—";

  return (
    <div className="mx-auto max-w-[1280px] space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back${firstName ? `, ${firstName}` : ""}. Here is an overview of your listings.`}
        meta={
          <>
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {dateFormat.format(new Date())}
          </>
        }
      />

      <StatGroup title="Properties" items={propertyStats} />
      <StatGroup title="Activity" items={activityStats} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <SystemOverview lastLogin={lastLogin} />
        </div>
        <QuickActions />
      </div>
    </div>
  );
}