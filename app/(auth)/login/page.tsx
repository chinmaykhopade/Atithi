"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) { toast.success("Welcome back! 🙏"); router.push(redirect); }
    else toast.error(result.error || "Login failed");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16"
      style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(217,119,6,0.07) 0%,transparent 70%), #fdfaf4" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-luxury border border-stone-100/60 overflow-hidden">
          {/* Header gradient strip */}
          <div className="h-1.5 bg-gradient-to-r from-gold-500 via-saffron-400 to-india-green" />

          <div className="p-9">
            {/* Logo */}
            <div className="text-center mb-9">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-400 to-saffron-500 rounded-2xl text-3xl shadow-gold mb-4">
                🙏
              </div>
              <h1 className="font-display text-3xl font-semibold text-stone-900 mb-1">Welcome Back</h1>
              <p className="text-stone-400 text-sm">Sign in to your Atithi account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  className="input-luxury !pl-11"
                />
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required className="input-luxury !pl-11 !pr-11"
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-gold-600 transition-colors">
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold w-full !rounded-xl !py-3.5 !text-base relative overflow-hidden disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : "Sign In →"}
              </button>
            </form>

            <p className="text-center text-sm text-stone-400 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-gold-600 font-semibold hover:text-gold-700">Register</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginContent /></Suspense>;
}