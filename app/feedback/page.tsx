"use client";

import { useEffect, useState } from "react";
import { categorizeFeedback } from "@/src/ai/categorizeFeedbacks";
import { translations, Language } from "@/src/data/translations";

export default function FeedbackPage() {
  const [lang, setLang] = useState<Language>("en");
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ward, setWard] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

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

  async function handleSubmit() {
    if (!feedback.trim()) return;

    setLoading(true);
    setSuccessMsg("");
    const aiResult = categorizeFeedback(feedback);

    const langNameMap = {
      en: "English",
      hi: "हिन्दी",
      bn: "বাংলা"
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || "Anonymous",
          phone: phone.trim() || "",
          ward: ward || "General",
          language: langNameMap[lang],
          message: feedback,
          category: aiResult.category,
          urgency: aiResult.urgency,
          summary: feedback,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(translations[lang]?.feedback.success || "Submitted successfully!");
        setFeedback("");
        setName("");
        setPhone("");
        setWard("");
      } else {
        alert(data.message || "Failed to submit feedback");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  }

  const t = translations[lang] || translations["en"];

  return (
    <main className="relative min-h-screen text-slate-800 antialiased overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-5%] left-[-10%] h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-[30%] right-[-10%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none -z-10" />

      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="border-b border-slate-200/40 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            {t.feedback.badge}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700">
            {t.feedback.title}
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xl font-medium">
            {t.feedback.desc}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: "🤖",
              title: "AI Analysis",
              desc: "Automatically extracts urgency, category, and translates summary into administrative terms."
            },
            {
              icon: "📋",
              title: "Sabha Routing",
              desc: "Addressed reports map directly into local assembly agendas for Gram Sabha discussions."
            },
            {
              icon: "💰",
              title: "Budget Influence",
              desc: "Aggregated complaints directly determine public funding weights for the village planner."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Form Box */}
        <div className="glass-card p-8 space-y-6">
          
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-bold flex items-center gap-2.5 animate-fadeIn">
              ✅ {successMsg}
            </div>
          )}

          {/* Form Rows */}
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                {t.feedback.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.feedback.namePlaceholder}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm text-slate-800 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-100/50 outline-none transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                {t.feedback.phoneLabel}
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.feedback.phonePlaceholder}
                className="w-full rounded-xl border border-slate-200/80 bg-white/70 p-3 text-sm text-slate-800 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-100/50 outline-none transition font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                {t.feedback.wardLabel}
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="w-full rounded-xl border border-slate-200/80 p-3 text-sm text-slate-800 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-100/50 outline-none transition bg-white/70 font-medium"
              >
                <option value="">{t.feedback.wardPlaceholder}</option>
                <option value="Ward 1">Ward 1</option>
                <option value="Ward 2">Ward 2</option>
                <option value="Ward 3">Ward 3</option>
                <option value="Ward 4">Ward 4</option>
                <option value="Ward 5">Ward 5</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">
              {t.feedback.messageLabel}
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t.feedback.messagePlaceholder}
              className="w-full h-40 rounded-xl border border-slate-200/80 bg-white/70 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-500/80 focus:ring-4 focus:ring-indigo-100/50 outline-none transition duration-200 resize-none font-medium"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !feedback.trim()}
            className="w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md disabled:bg-slate-200 disabled:text-slate-400 transition active:scale-[0.98] cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.feedback.submitting}
              </span>
            ) : (
              t.feedback.submitBtn
            )}
          </button>

          <p className="text-center text-xs text-slate-400 leading-relaxed font-semibold pt-2">
            {t.feedback.footerSecured}
          </p>
        </div>
      </section>
    </main>
  );
}