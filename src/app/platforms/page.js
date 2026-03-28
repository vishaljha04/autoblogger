"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Globe,
  Plus,
  Loader2,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

const platformTypes = [
  { type: "WORDPRESS", name: "WordPress", icon: "🌐", color: "bg-blue-500" },
  { type: "MEDIUM", name: "Medium", icon: "📝", color: "bg-green-600" },
  { type: "LINKEDIN", name: "LinkedIn", icon: "💼", color: "bg-blue-700" },
  { type: "TWITTER", name: "Twitter (X)", icon: "🐦", color: "bg-sky-500" },
];

const platformFields = {
  WORDPRESS: [
    { key: "apiUrl", label: "WordPress URL", type: "url", placeholder: "https://yourblog.com" },
    { key: "username", label: "Username", type: "text", placeholder: "admin" },
    { key: "appPassword", label: "App Password", type: "password", placeholder: "xxxx xxxx xxxx xxxx" },
  ],
  MEDIUM: [
    { key: "accessToken", label: "Access Token", type: "password", placeholder: "Your Medium integration token" },
  ],
  LINKEDIN: [
    { key: "accessToken", label: "Access Token", type: "password", placeholder: "Your LinkedIn OAuth token" },
  ],
  TWITTER: [
    { key: "apiKey", label: "API Key", type: "password", placeholder: "Consumer API Key" },
    { key: "apiSecret", label: "API Secret", type: "password", placeholder: "Consumer API Secret" },
    { key: "accessToken", label: "Access Token", type: "password", placeholder: "OAuth Access Token" },
    { key: "accessTokenSecret", label: "Access Token Secret", type: "password", placeholder: "OAuth Access Token Secret" },
  ],
};

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [credentials, setCredentials] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  async function fetchPlatforms() {
    try {
      const res = await fetch("/api/platforms");
      if (res.ok) {
        const data = await res.json();
        setPlatforms(data);
      }
    } catch (err) {
      console.error("Failed to fetch platforms:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedType,
          type: selectedType,
          credentials,
        }),
      });
      if (res.ok) {
        const platform = await res.json();
        setPlatforms([...platforms, platform]);
        setShowForm(false);
        setSelectedType(null);
        setCredentials({});
      }
    } catch (err) {
      console.error("Failed to add platform:", err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-500" />
            Publishing Platforms
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Connect your publishing platforms</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Add Platform
        </button>
      </div>

      {/* Add Platform Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          {!selectedType ? (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Select Platform</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platformTypes.map((pt) => (
                  <button
                    key={pt.type}
                    onClick={() => setSelectedType(pt.type)}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition text-center"
                  >
                    <span className="text-3xl mb-2 block">{pt.icon}</span>
                    <span className="font-medium text-slate-900 dark:text-white">{pt.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreate}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Configure {platformTypes.find((p) => p.type === selectedType)?.name}
                </h2>
                <button
                  type="button"
                  onClick={() => { setSelectedType(null); setCredentials({}); }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {platformFields[selectedType]?.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={credentials[field.key] || ""}
                      onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={creating}
                className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Connect Platform
              </button>
            </form>
          )}
        </div>
      )}

      {/* Connected Platforms */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : platforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((platform) => {
            const pt = platformTypes.find((p) => p.type === platform.type);
            return (
              <div
                key={platform.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl ${pt?.color || "bg-slate-500"} flex items-center justify-center text-2xl`}>
                  {pt?.icon || "🔗"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{pt?.name || platform.type}</h3>
                  <p className="text-xs text-slate-500">
                    {platform._count?.publications || 0} publications
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      platform.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {platform.isActive ? "Connected" : "Inactive"}
                  </span>
                  <a href="#" className="text-slate-400 hover:text-indigo-500 transition">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No platforms connected. Add one to start publishing!</p>
        </div>
      )}
    </DashboardLayout>
  );
}
