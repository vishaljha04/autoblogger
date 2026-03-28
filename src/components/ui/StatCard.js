import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, change, className }) {
  const isPositive = change && change > 0;

  return (
    <div className={cn("bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
            <Icon className="w-5 h-5 text-indigo-500" />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      {change !== undefined && (
        <p className={cn("text-sm mt-1", isPositive ? "text-green-600" : "text-red-500")}>
          {isPositive ? "+" : ""}{change}% from last period
        </p>
      )}
    </div>
  );
}
