"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatINR, formatDate } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OwnerBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/owner" className="text-saffron-500 text-sm hover:underline mb-4 inline-block">← Back to Dashboard</Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">All Bookings</h1>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <span className="text-5xl block mb-3">📅</span>
            <p className="text-gray-500">No bookings received yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="p-4 font-medium">Guest</th>
                    <th className="p-4 font-medium">Hotel</th>
                    <th className="p-4 font-medium hidden md:table-cell">Check-in</th>
                    <th className="p-4 font-medium hidden md:table-cell">Check-out</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Payment</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b: any) => (
                    <tr key={b._id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <p className="font-medium text-gray-800">{b.userId?.name || "Guest"}</p>
                        <p className="text-xs text-gray-400">{b.userId?.email}</p>
                      </td>
                      <td className="p-4 text-gray-600">{b.hotelId?.name || "—"}</td>
                      <td className="p-4 text-gray-600 hidden md:table-cell">{formatDate(b.checkInDate)}</td>
                      <td className="p-4 text-gray-600 hidden md:table-cell">{formatDate(b.checkOutDate)}</td>
                      <td className="p-4 font-semibold text-india-green">{formatINR(b.totalAmount)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : b.paymentStatus === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.bookingStatus === "confirmed" ? "bg-blue-100 text-blue-700" : b.bookingStatus === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}