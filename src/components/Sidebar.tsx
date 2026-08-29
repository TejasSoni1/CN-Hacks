"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  Sparkles,
  BarChart3,
  Users,
  Settings,
  Database,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/projects/northstar", label: "Projects", icon: FolderKanban },
  { href: "/tracker", label: "Tasks", icon: CheckSquare },
  { href: "/crm", label: "CRM", icon: Database },
  { href: "/ai", label: "AI Assistant", icon: Sparkles },
  { href: "/github", label: "Development", icon: GitBranch },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200/80 bg-white">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chimp-primary text-lg">
          🐵
        </div>
        <div>
          <p className="text-sm font-bold text-chimp-navy">Chimp Manager</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            AI
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 px-3">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-chimp-primary/10 text-chimp-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-chimp-navy"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-chimp-bg p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chimp-violet/20 text-sm font-semibold text-chimp-violet">
            AM
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-chimp-navy">
              Alex Morgan
            </p>
            <p className="truncate text-xs text-slate-500">Project Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
