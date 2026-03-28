import Link from "next/link";
import {
  Sparkles,
  Zap,
  BarChart3,
  Globe,
  Calendar,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Blog Generation",
    description: "Generate SEO-optimized blog posts with GPT-4 powered AI agents that research, write, and optimize content automatically.",
  },
  {
    icon: Globe,
    title: "Multi-Platform Publishing",
    description: "Auto-publish to WordPress, Medium, LinkedIn, and Twitter with secure OAuth integrations.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Set daily or weekly schedules and let the AI pipeline handle everything from topic research to publishing.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track views, engagement, click-through rates, and get AI-powered suggestions for improvement.",
  },
  {
    icon: Zap,
    title: "Automated Pipeline",
    description: "End-to-end automation: topic research, content generation, SEO optimization, image creation, and publishing.",
  },
  {
    icon: Shield,
    title: "Multi-Tenant SaaS",
    description: "Built for teams with role-based access, subscription plans, and organization management.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold">Autoblogger AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-indigo-200 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 rounded-lg transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 rounded-full text-indigo-300 text-sm mb-8">
          <Sparkles className="w-4 h-4" />
          Powered by GPT-4 & LangChain
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          AI-Powered Blog
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Automation Platform
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
          Generate, optimize, and publish high-quality blog posts daily across
          multiple platforms. Fully automated with AI agents.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3.5 text-lg font-medium bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-500/25"
          >
            Start Blogging with AI
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 text-lg font-medium border border-white/20 hover:bg-white/10 rounded-xl transition"
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10K+", label: "Blogs Generated" },
            { value: "4", label: "Publishing Platforms" },
            { value: "50+", label: "Supported Niches" },
            { value: "99.9%", label: "Uptime" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-indigo-400">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Everything You Need</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          A complete platform for automated blog content creation, optimization, and distribution.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition"
            >
              <feature.icon className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Automate Your Blog?</h2>
        <p className="text-slate-400 mb-8">
          Join thousands of content creators who save hours every week with AI-powered blogging.
        </p>
        <Link
          href="/register"
          className="inline-flex px-8 py-3.5 text-lg font-medium bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-500/25"
        >
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Autoblogger AI
          </div>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
