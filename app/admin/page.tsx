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
  status: string;
  createdAt: string;
};

export default function AdminPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [lang, setLang] = useState<Language>("en");

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
    loadFeedbacks();
  }, []);

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

  const t = translations[lang] || translations["en"];

  const total = feedbacks.length;
  const pending = feedbacks.filter(f => f.status === "Pending").length;
  const progress = feedbacks.filter(f => f.status === "In Progress").length;
  const resolved = feedbacks.filter(f => f.status === "Resolved").length;

  async function generateReport() {
    try {
      setReportLoading(true);
      const res = await fetch("/api/report");
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/feedback", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });
      if (res.ok) {
        loadFeedbacks();
      }
    } catch (err) {
      console.error(err);
    }
  }

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

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse text-indigo-600">🏛</div>
          <p className="mt-6 text-sm font-semibold text-slate-500">
            {t.admin.loadingReport}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen text-slate-800 antialiased overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-5%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <section className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="border-b border-slate-200/40 pb-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              {t.admin.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700">
              {t.admin.title}
            </h1>
            <p className="mt-1.5 text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
              {t.admin.desc}
            </p>
          </div>

          <button
            onClick={generateReport}
            disabled={reportLoading}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-6 py-4 text-xs font-bold text-white shadow-md disabled:bg-slate-200 disabled:text-slate-400 transition active:scale-[0.98] cursor-pointer"
          >
            {reportLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.admin.loadingReport}
              </span>
            ) : (
              t.admin.btnReport
            )}
          </button>
        </div>

        {/* Mini stats cards grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.admin.kpiTotal, value: total, color: "text-slate-900", icon: "📁" },
            { label: t.admin.kpiPending, value: pending, color: "text-rose-600", icon: "⏱️" },
            { label: t.admin.kpiProgress, value: progress, color: "text-amber-600", icon: "⚙️" },
            { label: t.admin.kpiResolved, value: resolved, color: "text-emerald-600", icon: "✅" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-extrabold uppercase tracking-widest">{stat.label}</span>
                <span className="text-base">{stat.icon}</span>
              </div>
              <p className={`mt-3 text-3xl font-black tracking-tight ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Generated Report section */}
        {report && (
          <div className="glass-card p-8 border-l-4 border-l-indigo-600 mb-8 animate-fadeIn space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-indigo-950">
                📋 {t.admin.briefTitle}
              </h2>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-extrabold text-slate-400">{t.admin.briefHealth}:</span>
                <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full font-black text-sm border
                  ${
                    report.villageHealthScore >= 75
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : report.villageHealthScore >= 50
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {report.villageHealthScore}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    📄 {t.admin.briefExec}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {report.executiveSummary}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    🚨 {t.admin.briefIssues}
                  </h4>
                  <ul className="space-y-2.5">
                    {report.topIssues.map((issue: string, idx: number) => (
                      <li key={idx} className="text-slate-600 text-xs font-semibold flex items-start gap-2.5">
                        <span className="text-indigo-500 select-none font-bold">•</span>
                        <span className="leading-relaxed">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    💰 {t.admin.briefBudget}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {report.budgetRecommendation}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                    📌 {t.admin.briefAgenda}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {report.agendaRecommendation}
                  </p>
                </div>

                {report.departmentActions && report.departmentActions.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                      🏢 Department Directives
                    </h4>
                    <ul className="space-y-2.5">
                      {report.departmentActions.map((action: string, idx: number) => (
                        <li key={idx} className="text-slate-600 text-xs font-semibold flex items-start gap-2.5">
                          <span className="text-indigo-500 select-none">🏢</span>
                          <span className="leading-relaxed">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Complaints Table section */}
        <div className="glass-card shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/50 text-slate-400 font-extrabold uppercase tracking-widest text-[10px]">
                  <th className="p-5">{t.admin.tableHeaderCitizen}</th>
                  <th className="p-5">{t.admin.tableHeaderMessage}</th>
                  <th className="p-5">{t.admin.tableHeaderCategory}</th>
                  <th className="p-5">{t.admin.tableHeaderUrgency}</th>
                  <th className="p-5">{t.admin.tableHeaderAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {feedbacks.map((item) => (
                  <tr key={item._id} className="hover:bg-white/40 transition-colors">
                    <td className="p-5">
                      <div className="font-bold text-slate-900">{item.name || t.common.anonymous}</div>
                      <div className="text-[10px] text-slate-400 font-extrabold mt-0.5">{item.ward || "General"}</div>
                    </td>
                    <td className="p-5 max-w-sm truncate text-slate-600 font-semibold" title={item.message}>
                      {item.message}
                    </td>
                    <td className="p-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100/80 text-slate-600 border border-slate-200/50">
                        {getCategoryIcon(item.category)} {item.category}
                      </span>
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
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
                    </td>
                    <td className="p-5">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-100/50 bg-white/70 cursor-pointer font-bold text-slate-700"
                        aria-label={t.admin.tableHeaderAction}
                      >
                        <option value="Pending">{t.common.pending}</option>
                        <option value="In Progress">{t.common.inProgress}</option>
                        <option value="Resolved">{t.common.resolved}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}