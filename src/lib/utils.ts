import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusColor(status: string) {
  switch (status) {
    case "on_track":
    case "done":
    case "complete":
    case "passed":
    case "approved":
      return "text-chimp-success bg-green-50";
    case "at_risk":
    case "in_progress":
    case "review":
      return "text-amber-700 bg-amber-50";
    case "blocked":
    case "critical":
    case "failed":
      return "text-red-700 bg-red-50";
    default:
      return "text-slate-600 bg-slate-50";
  }
}
