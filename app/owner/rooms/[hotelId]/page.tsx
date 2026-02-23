"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROOM_TYPES } from "@/utils/constants";
import { formatINR } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";

export default function ManageRoomsPage() {
  const { hotelId } = useParams();
  const { token } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const [form, setForm] = useState({
    type: "",
    price: "",
    capacity: "2",
    description: "",
    availabilityStatus: true,
  });

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`/api/rooms?hotelId=${hotelId}`);
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ type: "", price: "", capacity: "2", description: "", availabilityStatus: true });
    setEditingRoom(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingRoom ? `/api/rooms/${editingRoom._id}` : "/api/rooms";
    const method = editingRoom ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          hotelId,
          price: Number(form.price),
          capacity: Number(form.capacity),
        }),
      });

      if (res.ok) {
        toast.success(editingRoom ? "Room updated!" : "Room added!");
        resetForm();
        fetchRooms();
      } else {
        const data = await res.json();
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save room");
    }
  };

  const startEdit = (room: any) => {
    setForm({
      type: room.type,
      price: room.price.toString(),
      capacity: room.capacity.toString(),
      description: room.description || "",
      availabilityStatus: room.availabilityStatus,
    });
    setEditingRoom(room);
    setShowForm(true);
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Delete this room?")) return;
    try {
      const res = await fetch(`/api/rooms/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Room deleted");
        fetchRooms();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link href="/owner/hotels" className="text-saffron-500 text-sm hover:underline mb-2 inline-block">← Back to Hotels</Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800">Manage Rooms</h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-md transition flex items-center gap-2"
          >
            <FiPlus /> Add Room
          </button>
        </motion.div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4"
          >
            <h3 className="font-semibold text-gray-800">
              {editingRoom ? "Edit Room" : "Add New Room"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Room Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none bg-white" required>
                  <option value="">Select Type</option>
                  {ROOM_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Price (₹/night)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} min="500" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Capacity (guests)</label>
                <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} min="1" max="10" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none" required />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Availability</label>
                <select value={form.availabilityStatus.toString()} onChange={(e) => setForm({ ...form, availabilityStatus: e.target.value === "true" })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none bg-white">
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Room description" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-saffron-500 text-white px-6 py-2.5 rounded-xl font-medium hover:shadow-md transition">
                {editingRoom ? "Update" : "Add Room"}
              </button>
              <button type="button" onClick={resetForm} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </motion.form>
        )}

        {/* Rooms List */}
        {loading ? (
          <div className="animate-pulse text-center py-12 text-gray-400">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <span className="text-5xl block mb-3">🛏️</span>
            <p className="text-gray-500">No rooms added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room: any, i: number) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{room.type}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <FiUsers size={14} /> {room.capacity} guests
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${room.availabilityStatus ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {room.availabilityStatus ? "Available" : "Unavailable"}
                  </span>
                </div>
                {room.description && <p className="text-sm text-gray-500 mb-3">{room.description}</p>}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <p className="text-xl font-bold text-india-green">{formatINR(room.price)}<span className="text-sm font-normal text-gray-400">/night</span></p>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(room)} className="p-2 text-saffron-500 hover:bg-saffron-50 rounded-lg transition"><FiEdit2 /></button>
                    <button onClick={() => deleteRoom(room._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"><FiTrash2 /></button>
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