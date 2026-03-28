"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { Eye, MousePointerClick, Share2, Users, Loader2, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  const chartData = stats?.timeline?.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const existing = acc.find((d) => d.date === date);
    if (existing) {
      existing.views += item.views;
      existing.clicks += item.clicks;
      existing.shares += item.shares;
    } else {
      acc.push({ date, views: item.views, clicks: item.clicks, shares: item.shares });
    }
    return acc;
  }, []) || [];

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-500" />
            Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track your content performance</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                period === p
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Views"
              value={stats?.totals?.views?.toLocaleString() || "0"}
              icon={Eye}
              change={12}
            />
            <StatCard
              title="Total Clicks"
              value={stats?.totals?.clicks?.toLocaleString() || "0"}
              icon={MousePointerClick}
              change={8}
            />
            <StatCard
              title="Total Shares"
              value={stats?.totals?.shares?.toLocaleString() || "0"}
              icon={Share2}
              change={15}
            />
            <StatCard
              title="Unique Visitors"
              value={stats?.totals?.uniqueVisitors?.toLocaleString() || "0"}
              icon={Users}
              change={5}
            />
          </div>

          {/* Views Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Views Over Time</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-slate-400">
                No analytics data yet. Publish some blogs to start tracking!
              </div>
            )}
          </div>

          {/* Engagement Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Engagement Breakdown</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar dataKey="clicks" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="shares" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-slate-400">
                No engagement data available yet.
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
