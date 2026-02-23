"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminHotelsPage() {
  const { token } = useAuth();
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await fetch("/api/admin/hotels", {
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

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      if (res.ok) {
        toast.success(!currentStatus ? "Hotel approved!" : "Hotel rejected");
        fetchHotels();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteHotel = async (id: string) => {
    if (!confirm("Delete this hotel permanently?")) return;
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="text-saffron-500 text-sm hover:underline mb-4 inline-block">
            ← Back to Admin
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">
            All Hotels ({hotels.length})
          </h1>
        </motion.div>

        {/* Pending Approvals Section */}
        {hotels.filter((h) => !h.isApproved).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
              ⏳ Pending Approval ({hotels.filter((h) => !h.isApproved).length})
            </h2>
            <div className="space-y-3">
              {hotels
                .filter((h) => !h.isApproved)
                .map((hotel: any) => (
                  <motion.div
                    key={hotel._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
                        <p className="text-sm text-gray-500">
                          {hotel.city}, {hotel.state} • {formatINR(hotel.pricePerNight)}/night
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Owner: {hotel.ownerId?.name} ({hotel.ownerId?.email})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleApproval(hotel._id, hotel.isApproved)}
                          className="px-4 py-2 bg-india-green text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => deleteHotel(hotel._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                        >
                          🗑️ Reject
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* All Hotels Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="p-4 font-medium">Hotel</th>
                  <th className="p-4 font-medium hidden sm:table-cell">City</th>
                  <th className="p-4 font-medium hidden md:table-cell">Owner</th>
                  <th className="p-4 font-medium">Price</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hotels.map((hotel: any) => (
                  <tr key={hotel._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            hotel.images?.[0] ||
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"
                          }
                          alt={hotel.name}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <span className="font-medium text-gray-800">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 hidden sm:table-cell">{hotel.city}</td>
                    <td className="p-4 text-gray-600 hidden md:table-cell">
                      {hotel.ownerId?.name || "—"}
                    </td>
                    <td className="p-4 font-semibold text-india-green">
                      {formatINR(hotel.pricePerNight)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          hotel.isApproved
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {hotel.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleApproval(hotel._id, hotel.isApproved)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                            hotel.isApproved
                              ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {hotel.isApproved ? "Revoke" : "Approve"}
                        </button>
                        <button
                          onClick={() => deleteHotel(hotel._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}