import Link from "next/link";
import { Calendar, Clock, Eye, Tag } from "lucide-react";
import { cn, formatDate, truncate } from "@/lib/utils";

const statusColors = {
  DRAFT: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  GENERATING: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  REVIEW: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  SCHEDULED: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function BlogCard({ blog }) {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-tight flex-1 mr-3">
            {truncate(blog.title, 80)}
          </h3>
          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0", statusColors[blog.status])}>
            {blog.status}
          </span>
        </div>

        {blog.excerpt && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
            {blog.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {blog.readingTime} min read
          </span>
          {blog.niche && (
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              {blog.niche}
            </span>
          )}
          {blog._count?.analytics > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {blog._count.analytics} views
            </span>
          )}
        </div>

        {blog.publications?.length > 0 && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {blog.publications.map((pub) => (
              <span
                key={pub.id}
                className={cn(
                  "text-xs px-2 py-0.5 rounded",
                  pub.status === "PUBLISHED"
                    ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                    : "bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                )}
              >
                {pub.platform?.type || "Unknown"}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
