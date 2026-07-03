"use client";

import { useEffect, useState } from "react";
import { translations, Language } from "@/src/data/translations";

type Feedback = {
  _id: string;
  category: string;
  urgency: string;
  aiConfidence: number;
  message: string;
};

export default function BudgetPage() {
  const [budgetItems, setBudgetItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

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
    async function loadBudget() {
      try {
        const res = await fetch("/api/feedback");
        const data = await res.json();

        if (!data.success) return;

        const total = data.feedbacks.length;
        setTotalFeedbacks(total);

        const grouped: Record<string, Feedback[]> = {};
        data.feedbacks.forEach((item: Feedback) => {
          if (!grouped[item.category]) {
            grouped[item.category] = [];
          }
          grouped[item.category].push(item);
        });

        const generated = Object.keys(grouped).map(category => {
          const reports = grouped[category].length;
          const allocation = Math.round((reports / total) * 100);

          // Calculate average confidence
          const confSum = grouped[category].reduce((sum, item) => sum + (item.aiConfidence || 0.95), 0);
          const avgConfidence = Math.round((confSum / reports) * 100);

          return {
            category: category === "Other" ? "General Civic Issues" : category,
            rawCategory: category,
            reports,
            allocation,
            confidence: avgConfidence,
            messages: grouped[category].map(item => item.message)
          };
        });

        generated.sort((a, b) => b.allocation - a.allocation);
        setBudgetItems(generated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadBudget();
  }, []);

  const t = translations[lang] || translations["en"];

  // AI Reasoning translator based on category and language
  const getAIReasoning = (category: string) => {
    if (lang === "hi") {
      switch (category) {
        case "Water":
          return "जल स्तर में गिरावट और दूषित पानी की शिकायतों को देखते हुए, पाइपलाइनों के नवीनीकरण और नए हैंडपंप लगाने के लिए इस धन की आवश्यकता है।";
        case "Roads":
          return "मार्ग सुरक्षा सुनिश्चित करने और कृषि उपज परिवहन को सुगम बनाने हेतु सड़कों के गड्ढों को भरने और मरम्मत के लिए यह आवंटन आवश्यक है।";
        case "Education":
          return "स्कूल भवनों की संरचनात्मक सुरक्षा, शौचालय सुविधाओं के विकास और बच्चों के बैठने की व्यवस्था को बेहतर बनाने के लिए यह बजट जरूरी है।";
        case "Healthcare":
          return "आपातकालीन चिकित्सा शिविरों, आवश्यक दवाओं की उपलब्धता और स्थानीय स्वास्थ्य केंद्र में एम्बुलेंस सेवाओं की बहाली के लिए यह आवंटन अनुशंसित है।";
        case "Electricity":
          return "कृषि सिंचाई और रात्रि सुरक्षा सुनिश्चित करने के लिए नए ट्रांसफार्मर लगाने और क्षतिग्रस्त बिजली तारों को बदलने के लिए धन की आवश्यकता है।";
        case "Sanitation":
          return "सार्वजनिक स्थलों की सफाई, जल निकासी नालियों के कचरा मुक्त संचालन और ठोस अपशिष्ट प्रबंधन प्रणालियों के लिए यह आवंटन महत्वपूर्ण है।";
        case "Agriculture":
          return "सिंचाई नहरों के रख-रखाव, उर्वरक अनुदानों और किसानों को तकनीक सहायता प्रदान करने के लिए इस धन का नियोजन किया जाना चाहिए।";
        default:
          return "गांव के सामान्य वार्डों में छोटी समस्याओं को हल करने और नागरिक जीवन स्तर में सुधार लाने हेतु इस आकस्मिक निधि का उपयोग किया जाएगा।";
      }
    } else if (lang === "bn") {
      switch (category) {
        case "Water":
          return "পানির স্তর হ্রাস ও পাইপলাইন লিকেজের সমস্যা সমাধানে এবং বিশুদ্ধ পানীয় জল সরবরাহের ইউনিট স্থাপনে এই বাজেট বরাদ্দ আবশ্যক।";
        case "Roads":
          return "পথচারীদের নিরাপত্তা ও স্থানীয় ব্যবসা বৃদ্ধির লক্ষ্যে গ্রামের প্রধান রাস্তাগুলির পিচ গলিয়ে মেরামত কাজের জন্য এই বরাদ্দ প্রস্তাব করা হয়েছে।";
        case "Education":
          return "প্রাথমিক বিদ্যালয়ের পরিকাঠামো পুনর্গঠন, পানীয় জলের ব্যবস্থা এবং ছাত্রীদের শৌচাগার সংস্কার কাজের জন্য এই বাজেট প্রয়োজনীয়।";
        case "Healthcare":
          return "স্থানীয় ডিসপেনসারিতে সাপে কাটার ওষুধ ও প্রাথমিক চিকিৎসা সামগ্রী মজুত নিশ্চিত করতে এবং নিয়মিত স্বাস্থ্য শিবির পরিচালনায় এটি সাহায্য করবে।";
        case "Electricity":
          return "সেচ পাম্প সচল রাখতে এবং ঝুঁকিপূর্ণ ঝুলন্ত বৈদ্যুতিক তার পরিবর্তনের মাধ্যমে গ্রামের বিদ্যুৎ সরবরাহ ব্যবস্থা শক্তিশালী করতে এই অর্থ প্রয়োজন।";
        case "Sanitation":
          return "নর্দমা সংস্কার করে বর্ষার জমা জল নিষ্কাশন ত্বরান্বিত করতে এবং গ্রামের ময়লা পরিষ্কারের জন্য আবর্জনা বিন ক্রয়ের উদ্দেশ্যে এটি অনুशंसিত।";
        case "Agriculture":
          return "ক্ষতিগ্রস্ত সেচ খাল সংস্কার এবং কৃষকদের মাঝে ভর্তুকি মূল্যে কৃষি সরঞ্জাম বণ্টনের জন্য এই অর্থ বরাদ্দের সুপারিশ করা হচ্ছে।";
        default:
          return "গ্রামের বিভিন্ন সাধারণ ওয়ার্ডের বিক্ষিপ্ত সংস্কার কাজের সমাধানকল্পে এই জরুরি তহবিল পরিকল্পিত হয়েছে।";
      }
    } else {
      switch (category) {
        case "Water":
          return "Urgent drinking water pipeline reconstruction is required to fix systemic contamination and low water pressure reported by residents.";
        case "Roads":
          return "Repairing hazardous link road potholes is critical to prevent crop transit delays and pedestrian accidents during monsoons.";
        case "Education":
          return "Renovating primary school building roofs and structural toilets secures safe attendance and standard education resources.";
        case "Healthcare":
          return "Acquiring life-saving emergency anti-venoms and organizing primary health clinic driver schedules prevents medical emergencies.";
        case "Electricity":
          return "Upgrading market transformers and removing low-hanging high-voltage cables supports farming tractors and commercial growth.";
        case "Sanitation":
          return "Dredging blocked village drains and deploying mobile waste containers reduces water logging and disease vector growth.";
        case "Agriculture":
          return "Funding canal water distribution pumps and subsidizing soil testing seeds prepares farmers for seasonal monsoons.";
        default:
          return "Allocating contingency resources solves minor ward-level grievances that are outside key department boundaries.";
      }
    }
  };

  // Get participation mobilization level
  const getParticipationLevel = (count: number) => {
    if (lang === "hi") {
      if (count >= 5) return "🏆 उच्च नागरिक लामबंदी (व्यापक जन-भागीदारी)";
      if (count >= 2) return "⚖️ मध्यम जन-भागीदारी (सक्रिय नागरिक स्वर)";
      return "👤 व्यक्तिगत अनुरोध (कम लामबंदी)";
    } else if (lang === "bn") {
      if (count >= 5) return "🏆 উচ্চ नागरिक সম্পৃক্ততা (ব্যাপক জন-অংশগ্রহণ)";
      if (count >= 2) return "⚖️ মাঝারি অংশীদারিত্ব (সক্রিয় নাগরিক কণ্ঠ)";
      return "👤 व्यक्तिगत आवेदन (কম সম্পৃক্ততা)";
    } else {
      if (count >= 5) return "🏆 High Community Mobilization (Broad consensus)";
      if (count >= 2) return "⚖️ Medium Participation (Active feedback)";
      return "👤 Individual Concern (Low mobilization)";
    }
  };

  return (
    <main className="relative min-h-screen text-slate-800 antialiased overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-5%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b border-slate-200/40 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            {t.budget.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700">
            {t.budget.title}
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
            {t.budget.desc}
          </p>
        </div>

        {/* Budget List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.common.loading}
            </div>
          ) : budgetItems.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-400 text-sm font-semibold">
              {t.budget.emptyState}
            </div>
          ) : (
            budgetItems.map((item) => (
              <div
                key={item.category}
                className="glass-card p-8 space-y-5"
              >
                {/* Heading */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">
                      {item.category === "General Civic Issues" && lang !== "en"
                        ? translations[lang]?.agenda.whatsAppBriefing ? "সাধারণ নাগরিক সমস্যা" : item.category
                        : item.category}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">
                      📁 {t.budget.activeReports.replace("{count}", item.reports)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                      {t.budget.allocation}
                    </p>
                    <div className="text-2.5xl font-black text-indigo-600 tracking-tight mt-0.5">
                      {item.allocation}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${item.allocation}%` }}
                    />
                  </div>
                </div>

                {/* Info Cards Grid */}
                <div className="grid md:grid-cols-2 gap-4 pt-1">
                  {/* Citizen Mobilization */}
                  <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      👥 {t.budget.participation}
                    </span>
                    <p className="text-slate-700 text-xs font-bold">
                      {getParticipationLevel(item.reports)}
                    </p>
                  </div>

                  {/* AI Confidence */}
                  <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-4 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      🎯 {t.budget.confidence}
                    </span>
                    <p className="text-slate-700 text-xs font-black flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      <span>{item.confidence}% Confidence</span>
                    </p>
                  </div>
                </div>

                {/* AI Reasoning callout */}
                <div className="border-l-4 border-l-indigo-600 bg-indigo-50/20 p-4 rounded-r-xl">
                  <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">
                    💡 {t.budget.reasoning}
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium">
                    {getAIReasoning(item.rawCategory)}
                  </p>
                </div>

                {/* Supporting complaints summary */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                    💬 Supporting Grievances ({item.reports})
                  </span>
                  <div className="max-h-28 overflow-y-auto space-y-2 pr-2">
                    {item.messages.map((msg: string, idx: number) => (
                      <p key={idx} className="text-slate-500 text-[11px] leading-relaxed bg-slate-50/50 p-2.5 rounded border border-slate-200/50 font-medium">
                        "{msg}"
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}