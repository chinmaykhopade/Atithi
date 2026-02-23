"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/utils/formatCurrency";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import Link from "next/link";

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AdminRevenuePage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading revenue data...</div>
      </div>
    );
  }

  const maxRevenue = stats?.monthlyRevenue?.length
    ? Math.max(...stats.monthlyRevenue.map((m: any) => m.revenue))
    : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/admin"
            className="text-saffron-500 text-sm hover:underline mb-4 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">
            Revenue Analytics 📊
          </h1>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Revenue"
            value={formatINR(stats?.totalRevenue || 0)}
            icon="💰"
            color="bg-gradient-to-br from-india-green to-green-600"
            index={0}
          />
          <StatsCard
            title="Total Bookings"
            value={stats?.totalBookings || 0}
            icon="📋"
            color="bg-gradient-to-br from-saffron-500 to-saffron-600"
            index={1}
          />
          <StatsCard
            title="Total Hotels"
            value={stats?.totalHotels || 0}
            icon="🏨"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            index={2}
          />
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon="👥"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            index={3}
          />
        </div>

        {/* Monthly Revenue Bar Chart (CSS-based) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Monthly Revenue</h2>

          {stats?.monthlyRevenue?.length > 0 ? (
            <div className="space-y-4">
              {stats.monthlyRevenue.map((m: any, i: number) => {
                const percentage = (m.revenue / maxRevenue) * 100;
                return (
                  <motion.div
                    key={m._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-sm text-gray-500 w-24 flex-shrink-0 text-right">
                      {MONTH_NAMES[m._id] || `Month ${m._id}`}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(percentage, 5)}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                        className="h-full bg-gradient-to-r from-saffron-400 to-saffron-500 rounded-full flex items-center justify-end px-3"
                      >
                        <span className="text-xs text-white font-semibold whitespace-nowrap">
                          {formatINR(m.revenue)}
                        </span>
                      </motion.div>
                    </div>
                    <span className="text-xs text-gray-400 w-20 flex-shrink-0">
                      {m.count} booking{m.count !== 1 ? "s" : ""}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-5xl block mb-3">📉</span>
              <p className="text-gray-500">No revenue data yet</p>
            </div>
          )}
        </motion.div>

        {/* Revenue Breakdown Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Average Per Booking</p>
              <p className="text-2xl font-bold text-india-green">
                {stats?.totalBookings > 0
                  ? formatINR(Math.round(stats.totalRevenue / stats.totalBookings))
                  : "₹0"}
              </p>
            </div>
            <div className="text-center p-4 bg-saffron-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Average Per Hotel</p>
              <p className="text-2xl font-bold text-saffron-600">
                {stats?.totalHotels > 0
                  ? formatINR(Math.round(stats.totalRevenue / stats.totalHotels))
                  : "₹0"}
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-500 mb-1">Revenue Per User</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats?.totalUsers > 0
                  ? formatINR(Math.round(stats.totalRevenue / stats.totalUsers))
                  : "₹0"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}