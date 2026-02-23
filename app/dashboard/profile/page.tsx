"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/dashboard" className="text-saffron-500 text-sm hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">
            Edit Profile
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="w-16 h-16 bg-gradient-to-br from-saffron-400 to-saffron-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <span className="text-xs bg-saffron-100 text-saffron-700 px-2 py-0.5 rounded-full capitalize mt-1 inline-block">
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}