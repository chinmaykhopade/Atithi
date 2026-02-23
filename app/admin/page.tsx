"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import StatsCard from "@/components/StatsCard";
import { formatINR, formatDate } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      fetchStats();
    }
  }, [user, authLoading]);

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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800">Admin Dashboard 🛡️</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="bg-gradient-to-br from-saffron-500 to-saffron-600" index={0} />
          <StatsCard title="Total Hotels" value={stats?.totalHotels || 0} icon="🏨" color="bg-gradient-to-br from-india-green to-green-600" index={1} />
          <StatsCard title="Total Bookings" value={stats?.totalBookings || 0} icon="📋" color="bg-gradient-to-br from-blue-500 to-blue-600" index={2} />
          <StatsCard title="Revenue" value={formatINR(stats?.totalRevenue || 0)} icon="💰" color="bg-gradient-to-br from-purple-500 to-purple-600" index={3} />
          <StatsCard title="Pending Approvals" value={stats?.pendingApprovals || 0} icon="⏳" color="bg-gradient-to-br from-yellow-500 to-orange-500" index={4} />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link href="/admin/users" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-saffron-200 transition text-center">
            <span className="text-3xl block mb-2">👥</span>
            <span className="font-medium text-gray-700">Manage Users</span>
          </Link>
          <Link href="/admin/hotels" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-saffron-200 transition text-center">
            <span className="text-3xl block mb-2">🏨</span>
            <span className="font-medium text-gray-700">Manage Hotels</span>
          </Link>
          <Link href="/admin/revenue" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-saffron-200 transition text-center">
            <span className="text-3xl block mb-2">📊</span>
            <span className="font-medium text-gray-700">Revenue Analytics</span>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h2>
          {stats?.recentBookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Hotel</th>
                    <th className="pb-3 font-medium hidden sm:table-cell">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentBookings.map((b: any) => (
                    <tr key={b._id} className="hover:bg-gray-50">
                      <td className="py-3">{b.userId?.name || "Guest"}</td>
                      <td className="py-3">{b.hotelId?.name || "—"}</td>
                      <td className="py-3 hidden sm:table-cell font-semibold text-india-green">{formatINR(b.totalAmount)}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No recent bookings</p>
          )}
        </div>
      </div>
    </div>
  );
}