"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { translations, Language } from "@/src/data/translations";

export default function Navbar() {
  const [lang, setLang] = useState<Language>("en");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("janmitra_lang") as Language;
    if (saved && (saved === "en" || saved === "hi" || saved === "bn")) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang: Language) => {
    localStorage.setItem("janmitra_lang", newLang);
    setLang(newLang);
    window.dispatchEvent(new Event("janmitra_language_change"));
  };

  const t = translations[lang]?.nav || translations["en"].nav;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white text-lg shadow-[0_4px_12px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-all duration-300">
            🏛
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
              JanMitra
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">
              AI Civic Hub
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1.5">
          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 text-sm font-semibold"
          >
            {t.home}
          </Link>
          <Link
            href="/agenda"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 text-sm font-semibold"
          >
            {t.agenda}
          </Link>
          <Link
            href="/budget"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 text-sm font-semibold"
          >
            {t.budget}
          </Link>
          <Link
            href="/pulse"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 text-sm font-semibold"
          >
            {t.pulse}
          </Link>
          <Link
            href="/simulator"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 text-sm font-semibold"
          >
            {t.simulator}
          </Link>
          <Link
            href="/feedback"
            className="px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200 text-sm font-semibold"
          >
            {t.feedback}
          </Link>
          <Link
            href="/admin"
            className="px-4 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200 text-sm font-bold shadow-sm"
          >
            {t.admin}
          </Link>
        </div>

        {/* Language Switcher & Hamburger */}
        <div className="flex items-center gap-3">
          {/* Custom pill language selector */}
          <div className="bg-slate-100/80 p-0.5 rounded-lg flex items-center border border-slate-200/50">
            {(["en", "hi", "bn"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => changeLanguage(l)}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  lang === l
                    ? "bg-white text-slate-900 shadow-[0_2px_6px_rgba(0,0,0,0.06)]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {l === "en" ? "EN" : l === "hi" ? "हिं" : "বাং"}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
            aria-label="Toggle Menu"
          >
            <span className="text-xl">☰</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex flex-col gap-2 shadow-inner">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            {t.home}
          </Link>
          <Link
            href="/agenda"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            {t.agenda}
          </Link>
          <Link
            href="/budget"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            {t.budget}
          </Link>
          <Link
            href="/pulse"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            {t.pulse}
          </Link>
          <Link
            href="/simulator"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            {t.simulator}
          </Link>
          <Link
            href="/feedback"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-bold"
          >
            {t.feedback}
          </Link>
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-bold"
          >
            {t.admin}
          </Link>
        </div>
      )}
    </nav>
  );
}