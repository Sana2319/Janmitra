"use client";

import { useEffect, useState } from "react";
import { translations, Language } from "@/src/data/translations";

type Feedback = {
  _id: string;
  name: string;
  phone: string;
  ward: string;
  message: string;
  category: string;
  urgency: string;
  sentiment: string;
  status: string;
  createdAt: string;
};

export default function FeedbackHistoryPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lang, setLang] = useState<Language>("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLang = () => {
      const saved = localStorage.getItem("janmitra_lang") as Language;
      if (saved && (saved === "en" || saved === "hi" || saved === "bn")) {
        setLang(saved);
      }
    };
    getLang();
    window.addEventListener("janmitra_language_change", getLang);
    return () => window.removeEventListener("janmitra_language_change", getLang);
  }, []);

  useEffect(() => {
    async function loadFeedbacks() {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();
        if (data.success) {
          setFeedbacks(data.feedbacks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFeedbacks();
  }, []);

  const t = translations[lang] || translations["en"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Water": return "💧";
      case "Roads": return "🛣️";
      case "Education": return "🏫";
      case "Healthcare": return "⚕️";
      case "Electricity": return "⚡";
      case "Sanitation": return "🧹";
      case "Agriculture": return "🌾";
      default: return "📝";
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b border-slate-200/60 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
            🏛️ {t.home.liveFeed}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.admin.title === "Government Control Command" ? "Grievance Feed" : "Feedback Records"}
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl">
            {t.home.recentDesc}
          </p>
        </div>

        {/* Feedback Cards List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.common.loading}
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center text-slate-400 text-sm">
              {t.pulse.emptyState}
            </div>
          ) : (
            feedbacks.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.02)] hover:border-slate-300 transition duration-200 space-y-4"
              >
                {/* Meta Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center text-sm shadow-inner">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.name || t.common.anonymous}
                      </h3>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.ward || "General"}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                    ${
                      item.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : item.status === "In Progress"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {item.status === "Pending"
                      ? t.common.pending
                      : item.status === "In Progress"
                      ? t.common.inProgress
                      : t.common.resolved}
                  </span>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed">
                  {item.message}
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border
                      ${
                        item.urgency === "High"
                          ? "bg-rose-50 text-rose-700 border-rose-100"
                          : item.urgency === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border-emerald-100"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {new Date(item.createdAt).toLocaleString(lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "bn-IN")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}