"use client";

import { motion } from "framer-motion";

interface Props {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  index?: number;
}

export default function StatsCard({ title, value, icon, color, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${color} rounded-2xl p-6 text-white shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
    </motion.div>
  );
}