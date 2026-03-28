"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import BlogCard from "@/components/ui/BlogCard";
import Link from "next/link";
import {
  FileText,
  Eye,
  MousePointerClick,
  Share2,
  Plus,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, blogsRes] = await Promise.all([
          fetch("/api/analytics?period=30d"),
          fetch("/api/blogs?limit=5"),
        ]);

        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setStats(data);
        }

        if (blogsRes.ok) {
          const data = await blogsRes.json();
          setRecentBlogs(data.blogs || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back! Here&apos;s your content overview.</p>
        </div>
        <Link
          href="/blogs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Generate Blog
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Blogs"
              value={stats?.totalBlogs || 0}
              icon={FileText}
              change={12}
            />
            <StatCard
              title="Total Views"
              value={stats?.totals?.views?.toLocaleString() || "0"}
              icon={Eye}
              change={8}
            />
            <StatCard
              title="Total Clicks"
              value={stats?.totals?.clicks?.toLocaleString() || "0"}
              icon={MousePointerClick}
              change={15}
            />
            <StatCard
              title="Shares"
              value={stats?.totals?.shares?.toLocaleString() || "0"}
              icon={Share2}
              change={5}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/blogs/new"
              className="flex items-center gap-4 p-5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white hover:shadow-lg transition"
            >
              <Sparkles className="w-8 h-8" />
              <div>
                <div className="font-semibold">AI Generate</div>
                <div className="text-sm text-indigo-200">Create a blog with AI</div>
              </div>
            </Link>
            <Link
              href="/calendar"
              className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition"
            >
              <TrendingUp className="w-8 h-8 text-green-500" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Content Calendar</div>
                <div className="text-sm text-slate-500">Schedule your posts</div>
              </div>
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition"
            >
              <Eye className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">View Analytics</div>
                <div className="text-sm text-slate-500">Track performance</div>
              </div>
            </Link>
          </div>

          {/* Blog Status Overview */}
          {stats?.blogStats && stats.blogStats.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Content Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {["DRAFT", "GENERATING", "REVIEW", "SCHEDULED", "PUBLISHED", "FAILED"].map((status) => {
                  const stat = stats.blogStats.find((s) => s.status === status);
                  return (
                    <div key={status} className="text-center">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stat?._count || 0}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{status}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Blogs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Blogs</h2>
              <Link href="/blogs" className="text-sm text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
            {recentBlogs.length > 0 ? (
              <div className="space-y-4">
                {recentBlogs.map((blog) => (
                  <BlogCard key={blog.id} blog={blog} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <Sparkles className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No blogs yet. Generate your first AI blog!</p>
                <Link
                  href="/blogs/new"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate First Blog
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
