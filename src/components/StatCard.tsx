import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  color?: "purple" | "blue" | "green" | "red";
  children?: React.ReactNode;
}

const accent = {
  purple: "text-chimp-primary",
  blue: "text-blue-500",
  green: "text-chimp-success",
  red: "text-chimp-danger",
};

export function StatCard({
  label,
  value,
  trend,
  color = "purple",
  children,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-card">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={cn("mt-2 text-3xl font-bold", accent[color])}>{value}</p>
      {trend && <p className="mt-1 text-xs text-slate-400">{trend}</p>}
      {children && <div className="mt-4 h-10">{children}</div>}
    </div>
  );
}
