"use client";

import { Bell, Plus, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-chimp-navy">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-chimp-navy"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-white hover:text-chimp-navy"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-chimp-danger" />
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-chimp-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-chimp-violet"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>
    </header>
  );
}
