"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { INDIAN_CITIES } from "@/utils/constants";
import { FiSearch, FiMapPin, FiArrowRight } from "react-icons/fi";

const STATS = [
  { v: "500+", l: "Hotels" },
  { v: "50+", l: "Destinations" },
  { v: "10K+", l: "Happy Guests" },
  { v: "4.9★", l: "Avg Rating" },
];

const CITY_EMOJIS: Record<string, string> = {
  "Mumbai": "🌆",
  "Delhi": "🕌",
  "Jaipur": "🏰",
  "Goa": "🏖️",
  "Kerala": "🌴",
  "Varanasi": "🕉️",
};

export default function HeroSection() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(search.trim() ? `/hotels?search=${encodeURIComponent(search)}` : "/hotels");
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Cinematic Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920&q=85')",
          transform: "scale(1.05)",
        }}
      />

      {/* Multi-layer atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      {/* Top gradient for Navbar visibility */}
      <div className="absolute top-0 left-0 right-0 h-40 z-20"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)" }} />
      {/* Warm golden tint at bottom for smooth section blend */}
      <div className="absolute bottom-0 left-0 right-0 h-48"
        style={{ background: "linear-gradient(to top, rgba(12,10,9,0.95) 0%, transparent 100%)" }} />

      {/* ── Decorative orbs ── */}
      <div className="absolute top-32 left-20 w-96 h-96 rounded-full blur-[130px] pointer-events-none"
        style={{ background: "rgba(217,119,6,0.12)" }} />
      <div className="absolute top-48 right-16 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
        style={{ background: "rgba(249,115,22,0.1)" }} />

      {/* ── Hero Content (centered, pushes naturally) ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 min-h-[85vh]">

        <div className="max-w-4xl w-full mx-auto text-center">

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full border border-white/10"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}
          >
            <span className="flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-saffron-400 inline-block" />
              <span className="w-2 h-2 rounded-full bg-white/90 inline-block" />
              <span className="w-2 h-2 rounded-full bg-india-green inline-block" />
            </span>
            <span className="text-white/85 text-sm font-medium tracking-wide">
              India's Premier Hotel Management Platform
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="font-display font-semibold text-white leading-[1.05] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)" }}
          >
            Discover
            <br />
            <span className="italic" style={{
              background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 45%, #f97316 85%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Incredible
            </span>{" "}
            <span className="text-white">India</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-white/65 mb-10 max-w-lg mx-auto leading-relaxed font-light"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.2rem)" }}
          >
            From royal palaces of Rajasthan to serene backwaters of Kerala —
            every stay curated with{" "}
            <em className="text-gold-300 not-italic font-medium">love</em>.
          </motion.p>

          {/* Search bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div
              className="flex gap-3 p-2.5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-5 py-3.5">
                <FiSearch className="text-stone-400 flex-shrink-0" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="City, hotel name, or destination…"
                  className="flex-1 text-stone-800 placeholder-stone-400 focus:outline-none text-[15px] bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold text-[15px] transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #d97706, #f59e0b, #f97316)",
                  boxShadow: "0 4px 20px rgba(217,119,6,0.4)",
                }}
              >
                <FiSearch size={16} />
                Search
              </button>
            </div>
          </motion.form>

          {/* City quick-links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex flex-wrap justify-center gap-2.5"
          >
            {INDIAN_CITIES.slice(0, 6).map((city, i) => (
              <motion.button
                key={city}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.07 }}
                onClick={() => router.push(`/hotels?city=${city}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white/90 text-sm font-medium transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <span className="text-base leading-none">{CITY_EMOJIS[city] || "📍"}</span>
                {city}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Stats bar — full-width bottom strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.0 }}
        className="relative z-10 w-full"
      >
        <div
          className="border-t"
          style={{
            background: "rgba(12,10,9,0.75)",
            backdropFilter: "blur(30px)",
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 py-5">
            <div className="grid grid-cols-4 gap-4 divide-x"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              {STATS.map((s, i) => (
                <div key={s.l}
                  className={`text-center ${i > 0 ? "border-l" : ""}`}
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <p
                    className="font-display font-semibold leading-none mb-1"
                    style={{
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
                      background: "linear-gradient(135deg,#fcd34d,#f59e0b,#f97316)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {s.v}
                  </p>
                  <p className="text-xs font-medium tracking-wide"
                    style={{ color: "rgba(255,255,255,0.45)" }}>
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </section>
  );
}