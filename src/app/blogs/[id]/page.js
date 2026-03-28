"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowLeft,
  Save,
  Trash2,
  Send,
  Loader2,
  Calendar,
  Clock,
  Tag,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function BlogDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchBlog();
  }, [id]);

  async function fetchBlog() {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
        setEditData({
          title: data.title,
          content: data.content,
          metaTitle: data.metaTitle || "",
          metaDesc: data.metaDesc || "",
        });
      } else {
        router.push("/blogs");
      }
    } catch {
      router.push("/blogs");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updated = await res.json();
        setBlog(updated);
        setEditing(false);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      router.push("/blogs");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!blog) return null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        <div className="flex items-center gap-3">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-red-200 dark:border-red-800 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 hover:bg-green-500 text-white rounded-lg">
                <Send className="w-3.5 h-3.5" />
                Publish
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            {editing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full text-2xl font-bold bg-transparent border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <textarea
                  value={editData.content}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  rows={25}
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {blog.title}
                </h1>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                    {blog.content}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meta Info */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="w-4 h-4" />
                Created: {formatDate(blog.createdAt)}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4" />
                {blog.readingTime} min read ({blog.wordCount} words)
              </div>
              {blog.niche && (
                <div className="flex items-center gap-2 text-slate-500">
                  <Tag className="w-4 h-4" />
                  {blog.niche}
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-500">
                <Globe className="w-4 h-4" />
                {blog.language?.toUpperCase()}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">SEO</h3>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={editData.metaTitle}
                    onChange={(e) => setEditData({ ...editData, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Meta Description</label>
                  <textarea
                    value={editData.metaDesc}
                    onChange={(e) => setEditData({ ...editData, metaDesc: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm text-slate-500">
                <p><strong>Title:</strong> {blog.metaTitle || "Not set"}</p>
                <p><strong>Description:</strong> {blog.metaDesc || "Not set"}</p>
              </div>
            )}
          </div>

          {/* Keywords */}
          {blog.keywords?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-full"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Publications */}
          {blog.publications?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Published To</h3>
              <div className="space-y-2">
                {blog.publications.map((pub) => (
                  <div key={pub.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{pub.platform?.type}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        pub.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {pub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
