"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock } from "react-icons/fi";

const ROLES = [
  { value: "customer", label: "🧳 Traveller", desc: "Browse & book hotels" },
  { value: "owner", label: "🏨 Hotel Owner", desc: "List & manage properties" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "customer" });
  const [loading, setLoading] = useState(false);
  const update = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.phone) { toast.error("Please fill all fields"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome to Atithi! 🙏");
      router.push(form.role === "owner" ? "/owner" : form.role === "admin" ? "/admin" : "/dashboard");
    } else toast.error(result.error || "Registration failed");
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16"
      style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(19,136,8,0.06) 0%,transparent 70%), #fdfaf4" }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-luxury border border-stone-100/60 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-india-green via-gold-500 to-saffron-500" />

          <div className="p-9">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-india-green to-emerald-deep rounded-2xl text-3xl shadow-[0_8px_24px_rgba(19,136,8,0.25)] mb-4">
                🙏
              </div>
              <h1 className="font-display text-3xl font-semibold text-stone-900 mb-1">Join Atithi</h1>
              <p className="text-stone-400 text-sm">Create your account — it's free</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {ROLES.map((r) => (
                  <button key={r.value} type="button" onClick={() => update("role", r.value)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${form.role === r.value
                        ? "border-gold-500 bg-gold-50 shadow-gold"
                        : "border-stone-100 bg-stone-50 hover:border-stone-200"
                      }`}
                  >
                    <span className="text-sm font-bold block text-stone-800">{r.label}</span>
                    <span className="text-xs text-stone-400">{r.desc}</span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                  placeholder="Full Name" required className="input-luxury !pl-11" />
              </div>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                  placeholder="Email Address" required className="input-luxury !pl-11" />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 9876543210" required className="input-luxury !pl-11" />
              </div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input type="password" value={form.password} onChange={(e) => update("password", e.target.value)}
                  placeholder="Password (min 6 chars)" minLength={6} required className="input-luxury !pl-11" />
              </div>

              <button type="submit" disabled={loading}
                className="btn-gold w-full !rounded-xl !py-3.5 !text-base disabled:opacity-60 mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account…
                  </span>
                ) : "Create Account →"}
              </button>
            </form>

            <p className="text-center text-sm text-stone-400 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-gold-600 font-semibold hover:text-gold-700">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}