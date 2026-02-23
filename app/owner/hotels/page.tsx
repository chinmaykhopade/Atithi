"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function OwnerHotelsPage() {
  const { user, token } = useAuth();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHotels();
  }, [user]);

  const fetchHotels = async () => {
    try {
      const res = await fetch(`/api/hotels?ownerId=${user?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHotels(data.hotels || []);
    } catch {
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  const deleteHotel = async (id: string) => {
    if (!confirm("Delete this hotel and all its rooms? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Hotel deleted");
        fetchHotels();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading hotels...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link href="/owner" className="text-saffron-500 text-sm hover:underline mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800">
              My Hotels
            </h1>
          </div>
          <Link
            href="/owner/hotels/new"
            className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-md transition"
          >
            + Add Hotel
          </Link>
        </motion.div>

        {hotels.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <span className="text-6xl block mb-4">🏗️</span>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hotels Yet</h3>
            <Link href="/owner/hotels/new" className="text-saffron-500 font-medium hover:underline">
              Add your first hotel →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotels.map((hotel: any, i: number) => (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <img
                  src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
                  alt={hotel.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg">{hotel.name}</h3>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        hotel.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {hotel.isApproved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{hotel.city}, {hotel.state}</p>
                  <p className="text-lg font-bold text-india-green mb-4">
                    {formatINR(hotel.pricePerNight)} <span className="text-sm font-normal text-gray-400">/night</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      href={`/owner/hotels/${hotel._id}/edit`}
                      className="px-4 py-2 bg-saffron-50 text-saffron-600 rounded-lg text-sm font-medium hover:bg-saffron-100 transition"
                    >
                      ✏️ Edit
                    </Link>
                    <Link
                      href={`/owner/rooms/${hotel._id}`}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                    >
                      🛏️ Rooms
                    </Link>
                    <button
                      onClick={() => deleteHotel(hotel._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      🗑️ Delete
                    </button>
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