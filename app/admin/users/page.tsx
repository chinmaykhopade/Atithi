"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/admin" className="text-saffron-500 text-sm hover:underline mb-4 inline-block">← Back to Admin</Link>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6">
            All Users ({users.length})
          </h1>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Phone</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{u.name}</td>
                    <td className="p-4 text-gray-600">{u.email}</td>
                    <td className="p-4 text-gray-600 hidden sm:table-cell">{u.phone}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        u.role === "admin" ? "bg-purple-100 text-purple-700" :
                        u.role === "owner" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 hidden md:table-cell">{formatDate(u.createdAt)}</td>
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