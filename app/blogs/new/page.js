"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "components/layout/DashboardLayout";
import {
  Sparkles,
  Loader2,
  Search,
  PenTool,
  BarChart3,
  ImageIcon,
  CheckCircle,
} from "lucide-react";

const niches = [
  "Technology",
  "Finance",
  "Health & Wellness",
  "Marketing",
  "Travel",
  "Food & Cooking",
  "Education",
  "Business",
  "Lifestyle",
  "Science",
  "Sports",
  "Entertainment",
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "hi", name: "Hindi" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "pt", name: "Portuguese" },
];

const tones = ["Professional", "Casual", "Academic", "Conversational", "Persuasive", "Humorous"];

const pipelineStages = [
  { key: "researching", label: "Researching Topics", icon: Search },
  { key: "writing", label: "Writing Content", icon: PenTool },
  { key: "optimizing", label: "SEO Optimization", icon: BarChart3 },
  { key: "imaging", label: "Generating Image", icon: ImageIcon },
  { key: "complete", label: "Complete", icon: CheckCircle },
];

export default function GenerateBlogPage() {
  const router = useRouter();
  const [niche, setNiche] = useState("");
  const [language, setLanguage] = useState("en");
  const [tone, setTone] = useState("Professional");
  const [wordCount, setWordCount] = useState(1500);
  const [generateImage, setGenerateImage] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate(e) {
    e.preventDefault();
    if (!niche) {
      setError("Please select a niche");
      return;
    }

    setGenerating(true);
    setError("");
    setCurrentStage("researching");

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          language,
          tone: tone.toLowerCase(),
          wordCount,
          generateImage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setCurrentStage("complete");

      setTimeout(() => {
        router.push(`/blogs/${data.blog.id}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
      setGenerating(false);
      setCurrentStage("");
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            Generate Blog with AI
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Configure your blog settings and let AI do the rest.
          </p>
        </div>

        {generating ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 text-center">
              Generating Your Blog
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              {pipelineStages.map((stage) => {
                const stageIndex = pipelineStages.findIndex((s) => s.key === currentStage);
                const thisIndex = pipelineStages.findIndex((s) => s.key === stage.key);
                const isActive = stage.key === currentStage;
                const isDone = thisIndex < stageIndex || currentStage === "complete";

                return (
                  <div
                    key={stage.key}
                    className={`flex items-center gap-4 p-4 rounded-lg transition ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800"
                        : isDone
                        ? "bg-green-50 dark:bg-green-950/30"
                        : "opacity-40"
                    }`}
                  >
                    {isActive ? (
                      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                    ) : isDone ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <stage.icon className="w-5 h-5 text-slate-400" />
                    )}
                    <span
                      className={`font-medium ${
                        isActive
                          ? "text-indigo-700 dark:text-indigo-300"
                          : isDone
                          ? "text-green-700 dark:text-green-400"
                          : "text-slate-500"
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Niche Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                Select Niche *
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {niches.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNiche(n)}
                    className={`px-4 py-2.5 text-sm rounded-lg font-medium transition ${
                      niche === n
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Tone */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Word Count & Image */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    Target Word Count
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={wordCount}
                    onChange={(e) => setWordCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-slate-500 mt-1">{wordCount} words</div>
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={generateImage}
                      onChange={(e) => setGenerateImage(e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        Generate AI Image
                      </div>
                      <div className="text-xs text-slate-500">DALL-E 3 powered</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl transition shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Blog
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
