"use client";

import { useEffect, useState } from "react";
import { generatePulse } from "@/src/utils/generatePulse";
import { translations, Language } from "@/src/data/translations";

type Feedback = {
  _id: string;
  category: string;
  urgency: string;
  sentiment: string;
  status: string;
  message: string;
};

export default function PulsePage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
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
    async function loadData() {
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
    loadData();
  }, []);

  const t = translations[lang] || translations["en"];

  const priorities = generatePulse(feedbacks);
  const topPriority = priorities[0];

  // Sentiment Breakdown
  const total = feedbacks.length;
  const posCount = feedbacks.filter(f => f.sentiment === "Positive").length;
  const negCount = feedbacks.filter(f => f.sentiment === "Negative").length;
  const neuCount = feedbacks.filter(f => f.sentiment === "Neutral" || !f.sentiment).length;

  const posPct = total > 0 ? Math.round((posCount / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((negCount / total) * 100) : 0;
  const neuPct = total > 0 ? Math.round((neuCount / total) * 100) : 0;

  const high = feedbacks.filter(f => f.urgency === "High").length;
  const medium = feedbacks.filter(f => f.urgency === "Medium").length;
  const low = feedbacks.filter(f => f.urgency === "Low").length;

  // Contextual Action Recommendations based on top priority category
  const getContextualAIRecommendation = (category: string) => {
    if (lang === "hi") {
      switch (category) {
        case "Water":
          return "पीने के पानी की आपूर्ति को सुचारू करने के लिए जल शोधन संयंत्र का तत्काल निरीक्षण और लीक पाइपलाइनों को ठीक करना आवश्यक है।";
        case "Roads":
          return "मुख्य संपर्क सड़कों के गड्ढों को भरने और लोक निर्माण विभाग (PWD) के माध्यम से त्वरित पैचवर्क के निर्देश जारी किए जाने चाहिए।";
        case "Education":
          return "सरकारी प्राथमिक विद्यालय की छत की मरम्मत के लिए पंचायत विकास निधि से तत्काल धन स्वीकृत किया जाना चाहिए।";
        case "Healthcare":
          return "प्राथमिक स्वास्थ्य केंद्र में आवश्यक दवाओं का स्टॉक सुनिश्चित करने और आपातकालीन डॉक्टर की ड्यूटी तय करने की आवश्यकता है।";
        case "Electricity":
          return "बाजार क्षेत्र में बार-बार बिजली कटने और लटकते तारों की समस्या के समाधान के लिए विद्युत बोर्ड के साथ बैठक आयोजित की जाए।";
        case "Sanitation":
          return "कचरा निपटान के लिए नए डस्टबिन स्थापित करने और सप्ताह में दो बार जल निकासी नालियों की सफाई का अभियान शुरू किया जाए।";
        case "Agriculture":
          return "फसलों के नुकसान की समीक्षा करने और किसानों के लिए सब्सिडी वाले बीजों की उपलब्धता सुनिश्चित करने की आवश्यकता है।";
        default:
          return "आगामी ग्राम सभा बैठक में सामान्य जन-समस्याओं के समाधान हेतु एक विशेष शिकायत निवारण समिति का गठन किया जाना चाहिए।";
      }
    } else if (lang === "bn") {
      switch (category) {
        case "Water":
          return "বিশুদ্ধ পানীয় জলের সরবরাহ নিশ্চিত করতে ফিল্টারিং ইউনিটগুলির তাত্ক্ষণিক সংস্কার এবং পাইপলাইন মেরামত করা অত্যন্ত জরুরি।";
        case "Roads":
          return "প্রধান যোগাযোগ রাস্তার খানাখন্দ মেরামত করার জন্য গণপূর্ত বিভাগকে (PWD) অবিলম্বে নির্দেশ দেওয়া প্রয়োজন।";
        case "Education":
          return "সরকারি প্রাথমিক বিদ্যালয়ের অবকাঠামোগত উন্নয়নের জন্য পঞ্চায়েত তহবিল থেকে তাত্ক্ষণিক অনুদান মঞ্জুর করা উচিত।";
        case "Healthcare":
          return "স্থানীয় স্বাস্থ্যকেন্দ্রে জীবনদায়ী ওষুধ মজুত নিশ্চিত করতে এবং চিকিৎসকদের নিয়মিত উপস্থিতি তদারকি করা প্রয়োজন।";
        case "Electricity":
          return "বাজার এলাকায় ঘন ঘন লোডশেডিং এবং বিপজ্জনক বিদ্যুৎ পরিবাহী তার সংস্কারের জন্য বিদ্যুৎ পর্ষদের সাথে আলোচনা করা প্রয়োজন।";
        case "Sanitation":
          return "আবর্জনা অপসারণের জন্য নির্দিষ্ট ডাস্টবিন স্থাপন এবং নিয়মিত নর্দমা সাফাই অভিযান শুরু করা দরকার।";
        case "Agriculture":
          return "ফসলের ক্ষতি পূরণের জন্য ব্লক কৃষি দপ্তরের সাথে যোগাযোগ করা এবং সেচ ব্যবস্থার উন্নয়ন করা প্রয়োজন।";
        default:
          return "আসন্ন গ্রামসভা বৈঠকে সাধারণ নাগরিক সমস্যা সমাধানের জন্য একটি বিশেষ উপদেষ্টা কমিটি গঠন করা উচিত।";
      }
    } else {
      switch (category) {
        case "Water":
          return "Prioritize pipe leak maintenance in Wards 1 & 2, and schedule a water quality audit with the local filtration committee.";
        case "Roads":
          return "Deploy short-term asphalt patches to dangerous curves, and petition the District Magistrate for PWD asphalt road grants.";
        case "Education":
          return "Allocate Panchayat maintenance budget for roof leaks and toilet renovations in the local girls' school.";
        case "Healthcare":
          return "Summon Block Medical Officers to stock basic vaccines at the village clinic and schedule a weekly health camp.";
        case "Electricity":
          return "Request the Electricity Board to repair the sparking commercial transformer and relocate low-hanging lines near markets.";
        case "Sanitation":
          return "Inaugurate a clean-up drive in congested wards and add three secondary waste sorting bins near Panchayat Bhawan.";
        case "Agriculture":
          return "Set up an agricultural information desk at the upcoming Gram Sabha to assist farmers with credit subsidies.";
        default:
          return "Organize a special grievance cell to evaluate community priorities and catalog minor ward-level feedback reports.";
      }
    }
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
      default: return "📝";
    }
  };

  const aiInsight = topPriority
    ? `${topPriority.category === "Other" ? "General Civic Issues" : topPriority.category} ${
        lang === "hi"
          ? `वर्तमान में गांव का सबसे महत्वपूर्ण मुद्दा है, जो कुल शिकायतों का ${topPriority.percentage}% हिस्सा है। इस क्षेत्र में सुधार से नागरिकों की संतुष्टि में उल्लेखनीय वृद्धि होगी।`
          : lang === "bn"
          ? `বর্তমানে গ্রামের সবচেয়ে গুরুত্বপূর্ণ সমস্যা, যা মোট অভিযোগের ${topPriority.percentage}% অংশ। এই খাতের উন্নয়ন করা হলে নাগরিকদের সন্তুষ্টি বৃদ্ধি পাবে।`
          : `constitutes the highest percentage (${topPriority.percentage}%) of active complaints. Resolving issues in this sector will immediately uplift village health indices.`
      }`
    : t.pulse.emptyState;

  const dynamicAIRecommendation = topPriority
    ? getContextualAIRecommendation(topPriority.category)
    : t.pulse.emptyState;

  if (loading) {
    return (
      <main className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-pulse">📊</div>
          <p className="mt-4 text-sm font-semibold text-slate-500">{t.common.loading}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen text-slate-800 antialiased overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-5%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b border-slate-200/40 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            {t.pulse.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700">
            {t.pulse.title}
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
            {t.pulse.desc}
          </p>
        </div>

        {/* Mini KPI Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.home.statsComplaints, value: total, color: "text-slate-900" },
            { label: t.agenda.priorityHigh, value: high, color: "text-rose-600" },
            { label: t.agenda.priorityMedium, value: medium, color: "text-amber-600" },
            { label: t.agenda.priorityLow, value: low, color: "text-emerald-600" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="glass-card p-5"
            >
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-black tracking-tight ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Priorities & Sentiment Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Priorities Breakdown */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              {t.pulse.breakdownTitle}
            </h2>

            <div className="space-y-4 pt-1">
              {priorities.length > 0 ? (
                priorities.map((priority) => (
                  <div key={priority.category} className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <span>{getCategoryIcon(priority.category)}</span>
                        <span>{priority.category === "Other" ? "General Issues" : priority.category}</span>
                      </span>
                      <span className="text-indigo-600 font-black">
                        {priority.percentage}% ({priority.count})
                      </span>
                    </div>

                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-1000"
                        style={{ width: `${priority.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs py-4 text-center font-medium">
                  {t.pulse.emptyState}
                </p>
              )}
            </div>
          </div>

          {/* Sentiment Gauge Card */}
          <div className="glass-card p-6 flex flex-col justify-between gap-6">
            <div>
              <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                {t.pulse.sentimentTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-semibold">
                Calculated by AI analyzing language syntax and urgency levels of complaints.
              </p>
            </div>

            <div className="space-y-3.5">
              {/* Positive */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-600">
                  <span>😊 Positive Sentiment</span>
                  <span className="text-emerald-600 font-black">{posPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${posPct}%` }} />
                </div>
              </div>
              
              {/* Neutral */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-600">
                  <span>😐 Neutral Tone</span>
                  <span className="text-amber-500 font-black">{neuPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${neuPct}%` }} />
                </div>
              </div>

              {/* Negative */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-600">
                  <span>😡 Negative Tone</span>
                  <span className="text-rose-600 font-black">{negPct}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${negPct}%` }} />
                </div>
              </div>
            </div>

            <div className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200/60 p-3 rounded-xl text-center leading-relaxed">
              {negPct > 50
                ? "⚠️ High negative sentiment alert: Action is advised to avoid citizen trust degradation."
                : "✅ Community sentiment indices are stable at typical operational values."}
            </div>
          </div>
        </div>

        {/* Double column AI details */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* AI Insight */}
          <div className="border-l-4 border-indigo-600 bg-indigo-50/20 p-6 rounded-r-2xl border-y border-r border-slate-200/40 shadow-sm">
            <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest block mb-2">
              {t.pulse.insightTitle}
            </span>
            <p className="text-slate-600 text-xs leading-relaxed font-semibold">
              {aiInsight}
            </p>
          </div>

          {/* Suggested Agenda */}
          <div className="border-l-4 border-emerald-600 bg-emerald-50/25 p-6 rounded-r-2xl border-y border-r border-slate-200/40 shadow-sm">
            <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block mb-2">
              {t.pulse.agendaTitle}
            </span>
            <h4 className="text-slate-900 font-black text-xs mb-1.5 uppercase tracking-wider">
              {topPriority
                ? `${topPriority.category === "Other" ? "General Issues" : topPriority.category} Action Plan`
                : "Action Plan Needed"}
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed font-semibold">
              {dynamicAIRecommendation}
            </p>
          </div>
        </div>

        {/* Live Activity Ticker Box */}
        {feedbacks.length > 0 && (
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              📡 Recent Grievance Activity Log
            </h2>
            <div className="space-y-3">
              {feedbacks.slice(0, 3).map((f) => (
                <div key={f._id} className="flex justify-between items-center text-xs border-b border-slate-100/80 pb-2.5 last:border-b-0 last:pb-0 gap-4">
                  <span className="text-slate-600 truncate max-w-md font-semibold font-medium" title={f.message}>
                    {f.message}
                  </span>
                  <span className={`shrink-0 font-extrabold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded
                    ${
                      f.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-700"
                        : f.status === "In Progress"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}