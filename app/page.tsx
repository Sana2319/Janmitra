"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { translations, Language } from "@/src/data/translations";

type DashboardData = {
  total: number;
  pending: number;
  resolved: number;
  highPriority: number;
  recent: any[];
};

export default function HomePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
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
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error("Dashboard failed to load", err);
      }
    }
    loadDashboard();
  }, []);

  const t = translations[lang] || translations["en"];

  return (
    <main className="relative min-h-screen text-slate-800 antialiased overflow-hidden">
      {/* Premium Ambient Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[10%] left-[5%] h-[550px] w-[550px] rounded-full bg-indigo-500/4 blur-[130px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-24 border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 max-w-2xl space-y-6 text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-bold uppercase tracking-wider shadow-sm">
              ✨ {t.home.subtitle}
            </span>
            <h1 className="text-4xl sm:text-5xl leading-[1.12] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700">
              {t.home.title}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {t.home.desc}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/feedback"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-600/20 hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-200 active:translate-y-0"
              >
                📝 {t.home.ctaReport}
              </Link>
              <Link
                href="/agenda"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                📋 {t.home.ctaAgenda}
              </Link>
            </div>
          </div>

          {/* Right Stats Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 w-full">
            {[
              {
                label: t.home.statsComplaints,
                val: dashboard?.total ?? "--",
                icon: "📁",
                color: "text-slate-800",
                bg: "bg-white/70",
                border: "border-slate-200/60"
              },
              {
                label: t.home.statsResolved,
                val: dashboard?.resolved ?? "--",
                icon: "✅",
                color: "text-emerald-600",
                bg: "bg-emerald-50/30",
                border: "border-emerald-100/50"
              },
              {
                label: t.home.statsActive,
                val: dashboard?.highPriority ?? "--",
                icon: "⚠️",
                color: "text-rose-600",
                bg: "bg-rose-50/30",
                border: "border-rose-100/50"
              },
              {
                label: t.home.statsPending,
                val: dashboard?.pending ?? "--",
                icon: "⏱️",
                color: "text-amber-600",
                bg: "bg-amber-50/30",
                border: "border-amber-100/50"
              }
            ].map((stat, i) => (
              <div
                key={i}
                className={`glass-card p-6 flex flex-col justify-between`}
              >
                <div>
                  <div className="text-xl mb-3">{stat.icon}</div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
                <h2 className={`mt-2 text-3xl font-black tracking-tight ${stat.color}`}>
                  {stat.val}
                </h2>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Live Grievance Feed */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200/60 pb-6 mb-10">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              ⚡ {t.home.liveFeed}
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {t.home.recentComplaints}
            </h2>
            <p className="mt-1.5 text-slate-500 text-sm font-medium">
              {t.home.recentDesc}
            </p>
          </div>
          <Link
            href="/feedbackHistory"
            className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition gap-1 group"
          >
            {t.home.viewAll} <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        </div>

        <div className="glass-card divide-y divide-slate-100/80 overflow-hidden shadow-md">
          {!dashboard?.recent || dashboard.recent.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              No recent complaints logged yet.
            </div>
          ) : (
            dashboard.recent.map((item: any) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 hover:bg-white/40 transition-colors duration-200 gap-4"
              >
                <div className="space-y-2.5">
                  <h3 className="font-semibold text-slate-900 text-sm leading-relaxed max-w-2xl">
                    {item.message}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider">
                      {item.category === "Other" ? "General" : item.category}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider
                      ${
                        item.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.status === "In Progress"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.status === "Pending"
                        ? t.common.pending
                        : item.status === "In Progress"
                        ? t.common.inProgress
                        : t.common.resolved}
                    </span>
                  </div>
                </div>
                
                <span
                  className={`shrink-0 self-start sm:self-center inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                    ${
                      item.urgency === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : item.urgency === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}
                >
                  {item.urgency} Urgency
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Interactive Workflow */}
      <section className="relative overflow-hidden py-16 border-y border-slate-200/40 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              🔧 System Engine
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {t.home.workflowTitle}
            </h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed font-medium">
              {t.home.workflowDesc}
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.home.steps.map((item, idx) => (
              <div
                key={idx}
                className="glass-card p-6 group"
              >
                <p className="text-xs font-black text-indigo-600/80 tracking-wider">
                  0{idx + 1}
                </p>
                <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
            🏛️ Civic Features
          </span>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Complete Governance Suite
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              title: "📋 Gram Sabha Agenda Briefing",
              desc: "Aggregates, translates, and summarizes local grievances into structured draft points. Shares briefings via WhatsApp to keep everyone informed.",
              link: "/agenda"
            },
            {
              title: "📊 Live Community Pulse",
              desc: "Extracts community statistics, monitors urgency patterns, and aggregates local sentiments to identify immediate systemic problems.",
              link: "/pulse"
            },
            {
              title: "💰 Participatory Budget Planner",
              desc: "Translates complaint densities into evidence-based budget recommendations, explaining why funds should flow to public priorities.",
              link: "/budget"
            },
            {
              title: "🎮 Civic Leadership simulator",
              desc: "Lets young citizens act as a Sarpanch to manage budgets, review RTI queries, and handle emergencies. Encourages active civic participation.",
              link: "/simulator"
            }
          ].map((feat, idx) => (
            <div
              key={idx}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                <p className="mt-2 text-slate-500 text-xs leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>
              <Link
                href={feat.link}
                className="mt-6 inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-700 group gap-0.5"
              >
                Access Tool <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}