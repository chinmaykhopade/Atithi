"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { INDIAN_CITIES, INDIAN_STATES, AMENITIES } from "@/utils/constants";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function EditHotelPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    state: "",
    address: "",
    pricePerNight: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();
        if (data.hotel) {
          setForm({
            name: data.hotel.name,
            description: data.hotel.description,
            city: data.hotel.city,
            state: data.hotel.state,
            address: data.hotel.address,
            pricePerNight: data.hotel.pricePerNight.toString(),
            amenities: data.hotel.amenities || [],
          });
        }
      } catch {
        toast.error("Failed to load hotel");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          pricePerNight: Number(form.pricePerNight),
        }),
      });
      if (res.ok) {
        toast.success("Hotel updated!");
        router.push("/owner/hotels");
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading hotel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/owner/hotels" className="text-saffron-500 text-sm hover:underline mb-4 inline-block">
            ← Back to Hotels
          </Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">
            Edit Hotel
          </h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
            <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none transition" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => updateForm("description", e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none transition resize-none" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select value={form.city} onChange={(e) => updateForm("city", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none bg-white" required>
                <option value="">Select City</option>
                {INDIAN_CITIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select value={form.state} onChange={(e) => updateForm("state", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none bg-white" required>
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" value={form.address} onChange={(e) => updateForm("address", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none transition" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night (₹)</label>
            <input type="number" value={form.pricePerNight} onChange={(e) => updateForm("pricePerNight", e.target.value)} min="500" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none transition" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-full text-sm transition ${form.amenities.includes(a) ? "bg-saffron-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}