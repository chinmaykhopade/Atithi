"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatINR, formatDate } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MyBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingStatus: "cancelled",
          paymentStatus: "refunded",
        }),
      });
      if (res.ok) {
        toast.success("Booking cancelled");
        fetchBookings();
      }
    } catch {
      toast.error("Failed to cancel");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/dashboard" className="text-saffron-500 text-sm hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">
            My Bookings
          </h1>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <span className="text-6xl block mb-4">📅</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
            <p className="text-gray-500 mb-4">Start exploring hotels and book your dream stay!</p>
            <Link href="/hotels" className="inline-block bg-saffron-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-md transition">
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking: any, i: number) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={booking.hotelId?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"}
                    alt={booking.hotelId?.name}
                    className="w-full md:w-32 h-24 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {booking.hotelId?.name || "Hotel"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {booking.hotelId?.city} • {booking.roomId?.type || "Room"}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.bookingStatus === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.bookingStatus === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.bookingStatus}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.paymentStatus === "paid"
                              ? "bg-blue-100 text-blue-700"
                              : booking.paymentStatus === "refunded"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <span>📅 {formatDate(booking.checkInDate)} → {formatDate(booking.checkOutDate)}</span>
                      <span className="font-semibold text-india-green">{formatINR(booking.totalAmount)}</span>
                    </div>

                    {booking.bookingStatus === "confirmed" && booking.paymentStatus === "paid" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium hover:underline"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}