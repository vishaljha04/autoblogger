"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Key,
  Shield,
  CreditCard,
  Save,
  Loader2,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    features: ["5 blogs/month", "1 platform", "Basic analytics", "Email support"],
    current: true,
  },
  {
    name: "Starter",
    price: "$19",
    features: ["25 blogs/month", "3 platforms", "Advanced analytics", "Priority support", "Custom scheduling"],
  },
  {
    name: "Pro",
    price: "$49",
    features: ["Unlimited blogs", "All platforms", "Full analytics", "API access", "Team members", "White-label"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Everything in Pro", "Custom AI models", "Dedicated support", "SLA guarantee", "Custom integrations"],
  },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-500" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    disabled
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "api" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">API Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    placeholder="sk-..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">Required for AI blog generation</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Subscription Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-xl border p-5 ${
                      plan.current
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                    }`}
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                      {plan.price}
                      {plan.price !== "Custom" && <span className="text-sm font-normal text-slate-500">/mo</span>}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((f) => (
                        <li key={f} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="text-green-500">&#10003;</span> {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition ${
                        plan.current
                          ? "bg-indigo-600 text-white"
                          : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {plan.current ? "Current Plan" : "Upgrade"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Blog generated", desc: "When AI finishes generating a blog" },
                  { label: "Blog published", desc: "When a blog is published to a platform" },
                  { label: "Publishing failed", desc: "When publishing encounters an error" },
                  { label: "Weekly digest", desc: "Weekly summary of your analytics" },
                ].map((item) => (
                  <label key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white text-sm">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Security Settings</h2>
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                  <input type="password" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input type="password" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg" />
                </div>
                <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition">
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
