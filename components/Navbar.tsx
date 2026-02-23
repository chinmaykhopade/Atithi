"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiHome, FiSearch, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLoading } from "@/context/LoadingProvider";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { startLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "owner") return "/owner";
    return "/dashboard";
  };

  const navLinks = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/hotels", label: "Browse Hotels", icon: FiSearch },
  ];

  const isHeroPage = pathname === "/";

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${scrolled || !isHeroPage
        ? "bg-white/96 backdrop-blur-2xl shadow-[0_2px_24px_rgba(0,0,0,0.06)] border-b border-stone-100/60"
        : "bg-transparent backdrop-blur-md"
        }`}
    >
      <div className="india-stripe" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px]">

          {/* ── Logo ── */}
          <Link href="/" onClick={startLoading} className="flex items-center gap-3 group px-1">
            <div className="relative w-10 h-10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/atithi-logo.svg"
                alt="Atithi Logo"
                width={40}
                height={40}
                className="rounded-xl shadow-[0_4px_16px_rgba(217,119,6,0.35)]"
                priority
              />
            </div>
            <div className="leading-none">
              <span
                className="font-display text-[1.55rem] font-semibold tracking-wide block"
                style={{
                  background: "linear-gradient(135deg,#92400e,#d97706,#f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Atithi
              </span>
              <p className="text-[9px] text-gold-500 tracking-[0.22em] uppercase font-medium -mt-0.5 ml-0.5">
                अतिथि देवो भव
              </p>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${active
                    ? "text-gold-600 bg-gold-50"
                    : scrolled || !isHeroPage
                      ? "text-stone-600 hover:text-gold-600 hover:bg-gold-50/70"
                      : "text-white/95 hover:text-white hover:bg-white/10 [text-shadow:0_1px_2px_rgba(0,0,0,0.3)]"
                    }`}
                  onClick={() => { if (href === "/") startLoading(); }}
                >
                  <Icon size={14} />
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-1 left-4 right-4 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg,#d97706,#f97316)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Auth area ── */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-200 border ${scrolled || !isHeroPage
                    ? "border-gold-100 bg-cream-50 hover:shadow-gold"
                    : "border-white/15 bg-white/10 hover:bg-white/15"
                    }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-saffron-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left leading-none">
                    <p className={`text-sm font-semibold ${scrolled || !isHeroPage ? "text-stone-800" : "text-white"}`}>
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-gold-500 capitalize mt-0.5 font-medium">{user.role}</p>
                  </div>
                  <FiChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""} ${scrolled || !isHeroPage ? "text-stone-400" : "text-white/60"}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute right-0 mt-2.5 w-64 bg-white rounded-2xl shadow-luxury border border-stone-100 overflow-hidden"
                    >
                      <div className="px-5 py-4 border-b border-gold-100/60"
                        style={{ background: "linear-gradient(135deg,#fdfaf4,#fef3c7)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-gradient-to-br from-gold-500 to-saffron-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-gold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-800 text-sm">{user.name}</p>
                            <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
                            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-gold-700 bg-gold-100 px-2 py-0.5 rounded-full">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href={getDashboardLink()} onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-gold-50 hover:text-gold-700 transition-all">
                          <FiGrid size={14} /> Dashboard
                        </Link>
                        <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-gold-50 hover:text-gold-700 transition-all">
                          <FiUser size={14} /> My Profile
                        </Link>
                        <div className="my-1.5 border-t border-stone-100" />
                        <button onClick={() => { logout(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                          <FiLogOut size={14} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login"
                  className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${scrolled || !isHeroPage
                    ? "text-stone-600 hover:text-gold-600 hover:bg-gold-50"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}>
                  Sign In
                </Link>
                <Link href="/register" className="btn-gold !text-sm !px-5 !py-2.5 !rounded-xl shadow-gold">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile burger ── */}
          <button
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all ${scrolled || !isHeroPage
              ? "bg-cream-100 text-stone-700 hover:bg-gold-50 hover:text-gold-600"
              : "bg-white/10 text-white hover:bg-white/20"
              }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-3 px-3 rounded-xl text-stone-700 hover:bg-gold-50 hover:text-gold-700 font-medium transition-all">
                  {label}
                </Link>
              ))}
              <div className="border-t border-stone-100 my-2" />
              {user ? (
                <>
                  <div className="px-3 py-3 rounded-xl mb-2"
                    style={{ background: "linear-gradient(135deg,#fdfaf4,#fef3c7)" }}>
                    <p className="font-semibold text-stone-800 text-sm">{user.name}</p>
                    <p className="text-xs text-gold-600 capitalize font-medium mt-0.5">{user.role}</p>
                  </div>
                  <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}
                    className="flex py-3 px-3 rounded-xl text-stone-700 hover:bg-gold-50 font-medium transition-all">
                    📊 Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full text-left py-3 px-3 rounded-xl text-red-400 hover:bg-red-50 font-medium transition-all">
                    ← Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}
                    className="block py-3 px-3 rounded-xl text-stone-700 hover:bg-gold-50 font-medium transition-all">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}
                    className="block text-center py-3.5 px-3 rounded-xl font-bold text-white mt-2 shadow-gold"
                    style={{ background: "linear-gradient(135deg,#d97706,#f59e0b,#f97316)" }}>
                    Get Started →
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}