"use client";

import Link from "next/link";
import { formatINR } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiArrowUpRight, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  state: string;
  pricePerNight: number;
  rating: number;
  totalReviews: number;
  images: string[];
  amenities: string[];
  description?: string;
}

const AMENITY_ICONS: Record<string, string> = {
  "WiFi": "📶", "Pool": "🏊", "Spa": "💆", "Gym": "🏋️",
  "Restaurant": "🍽️", "AC": "❄️", "Breakfast": "🥐",
};

export default function HotelCard({ hotel, index = 0 }: { hotel: Hotel; index?: number }) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent navigation

    const url = `${window.location.origin}/hotels/${hotel._id}`;
    const shareData = {
      title: `${hotel.name} | Atithi Luxury`,
      text: `Check out this amazing property: ${hotel.name} on Atithi.`,
      url: url,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => { });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.09, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hotel-card group"
    >
      <Link href={`/hotels/${hotel._id}`}>
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-stone-100/80 h-full flex flex-col">

          {/* ── Image ── */}
          <div className="relative h-60 overflow-hidden">
            <img
              src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Rating pill */}
            <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-sm text-stone-600 hover:text-gold-600 hover:scale-105 active:scale-95 transition-all"
              >
                <FiShare2 size={13} />
              </button>
              <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-xl shadow-sm font-bold text-stone-800">
                <FiStar className="fill-amber-400 text-amber-400" size={12} />
                <span className="text-sm">{hotel.rating > 0 ? hotel.rating : "New"}</span>
                {hotel.totalReviews > 0 && (
                  <span className="text-[10px] text-stone-400 ml-0.5">({hotel.totalReviews})</span>
                )}
              </div>
            </div>

            {/* Location pill */}
            <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white/90 px-3 py-1 rounded-xl text-xs font-medium">
              <FiMapPin size={10} /> {hotel.city}, {hotel.state}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-5 flex flex-col flex-1">
            <h3
              className="font-display text-[1.2rem] font-semibold text-stone-900 group-hover:text-gold-600 transition-colors duration-200 mb-1.5 line-clamp-1 leading-snug"
            >
              {hotel.name}
            </h3>

            {hotel.description && (
              <p className="text-sm text-stone-400 mb-3 line-clamp-2 leading-relaxed">{hotel.description}</p>
            )}

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {hotel.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 text-[11px] bg-cream-100 text-gold-700 px-2.5 py-1 rounded-lg font-medium border border-gold-100/60">
                    {AMENITY_ICONS[a] || "✓"} {a}
                  </span>
                ))}
                {hotel.amenities.length > 3 && (
                  <span className="text-[11px] bg-stone-50 text-stone-400 px-2.5 py-1 rounded-lg border border-stone-100 font-medium">
                    +{hotel.amenities.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-auto">
              <div>
                <span className="font-display text-2xl font-semibold gradient-green">
                  {formatINR(hotel.pricePerNight)}
                </span>
                <span className="text-xs text-stone-400 block -mt-0.5">per night</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-saffron-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-gold group-hover:shadow-[0_8px_24px_rgba(217,119,6,0.45)] transition-all duration-300 group-hover:scale-105">
                Book Now <FiArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}