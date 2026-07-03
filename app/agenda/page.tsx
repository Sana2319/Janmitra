"use client";

import { useEffect, useState } from "react";
import { translations, Language } from "@/src/data/translations";

type Feedback = {
  _id: string;
  message: string;
  category: string;
  urgency: string;
  status: string;
  department: string;
};

export default function AgendaPage() {
  const [agenda, setAgenda] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [summonedDepartments, setSummonedDepartments] = useState<string[]>([]);
  const [totalComplaints, setTotalComplaints] = useState(0);

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
    async function loadAgenda() {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();

        if (!data.success) return;

        setTotalComplaints(data.feedbacks.length);
        const grouped: Record<string, any[]> = {};
        const departments = new Set<string>();

        data.feedbacks.forEach((item: Feedback) => {
          if (!grouped[item.category]) {
            grouped[item.category] = [];
          }
          grouped[item.category].push(item);
          
          const dept = item.department || "Panchayat";
          if (dept && dept !== "Other") departments.add(dept);
        });

        if (departments.size === 0) {
          departments.add("Panchayat");
        }
        setSummonedDepartments(Array.from(departments));

        const generated = Object.keys(grouped).map(category => {
          const complaints = grouped[category];
          const high = complaints.filter(c => c.urgency === "High").length;
          
          const displayCategory = category === "Other" ? "General Civic Issues" : category;
          const assignedDept = complaints[0]?.department || "Panchayat";

          return {
            title: displayCategory,
            priority: high >= 2 ? "High" : high === 1 ? "Medium" : "Low",
            department: assignedDept,
            description: `${complaints.length} citizen complaint(s) received regarding ${displayCategory}.`,
            recommendation: `Discuss ${displayCategory} during the next Gram Sabha meeting and assign resolving parameters to the ${assignedDept}.`,
            examples: complaints.map(c => c.message)
          };
        });

        setAgenda(generated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadAgenda();
  }, []);

  const t = translations[lang] || translations["en"];

  // Estimated Meeting Duration
  const estimatedDuration = agenda.length > 0 ? agenda.length * 20 + 30 : 60; // 20m per agenda item + 30m base

  // Generate WhatsApp Share Link
  const handleWhatsAppShare = () => {
    let shareText = t.agenda.whatsAppBriefing;
    agenda.forEach((item, index) => {
      shareText += `\n${index + 1}. *${item.title}* (${item.priority} Priority)\n   - ${item.description}\n   - _Summoned Department:_ ${item.department}\n`;
    });
    shareText += `\n🔗 Check live updates on JanMitra: ${window.location.origin}`;
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Water": return "💧";
      case "Roads": return "🛣️";
      case "Education": return "🏫";
      case "Healthcare": return "⚕️";
      case "Electricity": return "⚡";
      case "Sanitation": return "🧹";
      case "Agriculture": return "🌾";
      default: return "📋";
    }
  };

  return (
    <main className="relative min-h-screen text-slate-800 antialiased overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-5%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b border-slate-200/40 pb-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              {t.agenda.badge}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700">
              {t.agenda.title}
            </h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
              {t.agenda.desc}
            </p>
          </div>

          <button
            onClick={handleWhatsAppShare}
            disabled={agenda.length === 0}
            className="shrink-0 inline-flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-4 text-sm font-bold text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg transition active:scale-[0.98] disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
          >
            <span>💬</span>
            {t.agenda.shareWhatsApp}
          </button>
        </div>

        {/* Dynamic Assembly Summary Card */}
        {agenda.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white rounded-2xl p-8 shadow-xl border border-indigo-800/45 mb-8 space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
                ⚡ Agenda Executive Summary
              </span>
              <p className="mt-2 text-sm text-slate-100 leading-relaxed font-semibold">
                {lang === "hi"
                  ? `आगामी ग्राम सभा बैठक में मुख्य रूप से ${agenda.length} विषयों पर चर्चा होगी। कुल ${totalComplaints} नागरिक शिकायतों के विश्लेषण के आधार पर प्राथमिकताएं तय की गई हैं। संकल्प योजनाओं के प्रस्तुतीकरण के लिए ${summonedDepartments.length} विभागों को उपस्थित रहने का निर्देश दिया गया है।`
                  : lang === "bn"
                  ? `আসন্ন গ্রামসভা বৈঠকে মূলত ${agenda.length}টি এজেন্ডা নিয়ে আলোচনা হবে। মোট ${totalComplaints}টি নাগরিক অভিযোগ পর্যালোচনার ভিত্তিতে অগ্রাধিকার নির্ধারিত হয়েছে। সমাধানের কর্মপরিকল্পনা পেশ করতে ${summonedDepartments.length}টি বিভাগকে তলব করা হয়েছে।`
                  : `The upcoming assembly will address ${agenda.length} core agenda items derived from ${totalComplaints} community reports. High priority indicators require immediate debate. We have summoned representatives from ${summonedDepartments.length} local departments to present resolution plans.`}
              </p>
            </div>

            {/* Upcoming Meeting Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-indigo-700/60">
              <div>
                <p className="text-[10px] text-indigo-300 uppercase font-bold">{t.agenda.meetingDate}</p>
                <p className="mt-1.5 text-xs font-black">Next Sunday (July 5)</p>
              </div>
              <div>
                <p className="text-[10px] text-indigo-300 uppercase font-bold">{t.agenda.meetingTime}</p>
                <p className="mt-1.5 text-xs font-black">10:00 AM IST</p>
              </div>
              <div>
                <p className="text-[10px] text-indigo-300 uppercase font-bold">{t.agenda.meetingVenue}</p>
                <p className="mt-1.5 text-xs font-black">Panchayat Bhawan</p>
              </div>
              <div>
                <p className="text-[10px] text-indigo-300 uppercase font-bold">{t.agenda.meetingDuration}</p>
                <p className="mt-1.5 text-xs font-black">{estimatedDuration} Minutes</p>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-700/60 flex items-center justify-between text-xs text-indigo-200">
              <span className="font-bold">{t.agenda.presidedBy}: {t.agenda.sarpanchName}</span>
              <span className="font-bold bg-indigo-700/50 px-3 py-1 rounded-md border border-indigo-600">Active Briefing</span>
            </div>
          </div>
        )}

        {/* Agenda Cards List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.common.loading}
            </div>
          ) : agenda.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400 text-sm font-semibold">
              {t.agenda.emptyState}
            </div>
          ) : (
            agenda.map((item, index) => (
              <div
                key={index}
                className="glass-card p-8 space-y-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base shadow-inner">
                      {getCategoryIcon(item.title)}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-600 tracking-widest">
                        ITEM 0{index + 1}
                      </span>
                      <h2 className="text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border
                    ${
                      item.priority === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-100"
                        : item.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-emerald-50 text-emerald-700 border-emerald-100"
                    }`}
                  >
                    {item.priority === "High" ? t.agenda.priorityHigh : item.priority === "Medium" ? t.agenda.priorityMedium : t.agenda.priorityLow}
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                  {item.description}
                </p>

                {/* Summoned Department Badge */}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50/50 border border-slate-200/50 rounded-xl px-3.5 py-2.5 w-fit">
                  <span>🏢</span>
                  <span>{t.agenda.summonedDepts}: <span className="text-slate-950 font-bold">{item.department}</span></span>
                </div>

                {/* Citizen Reports bullet points */}
                <div className="border-t border-slate-100 pt-4">
                  <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    {lang === "hi" ? "शिकायत विवरण" : lang === "bn" ? "অভিযোগের বিবরণ" : "Report Details"}
                  </h4>
                  <ul className="mt-2.5 space-y-2 list-none">
                    {item.examples.map((example: string, idx: number) => (
                      <li key={idx} className="text-slate-600 text-xs flex items-start gap-2 font-medium">
                        <span className="text-indigo-500 select-none font-bold mt-0.5">•</span>
                        <span className="leading-relaxed">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendation box */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 border-l-4 border-l-indigo-600">
                  <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">
                    💡 {t.agenda.guidanceTitle}
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Global recommendation card */}
        <div className="mt-10 bg-indigo-50/30 border border-indigo-100 rounded-2xl p-8">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2">
            Panchayat Planning Policy
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed font-semibold">
            Prioritize topics holding high priority indicators or displaying critical utility needs to secure community satisfaction. Consider planning immediate budget allocations for these sectors in line with citizen consensus.
          </p>
        </div>
      </section>
    </main>
  );
}