"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import HotelCard from "@/components/HotelCard";
import SearchFilter from "@/components/SearchFilter";
import Pagination from "@/components/Pagination";
import { HotelCardSkeleton } from "@/components/LoadingSkeleton";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

function HotelsContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const initialCity = searchParams.get("city") || "";
  const initialSearch = searchParams.get("search") || "";

  const fetchHotels = async (filters: any = {}, pageNum: number = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.city) params.set("city", filters.city);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.rating) params.set("rating", filters.rating);
    params.set("page", pageNum.toString());
    params.set("limit", "9");

    try {
      const res = await fetch(`/api/hotels?${params.toString()}`);
      const data = await res.json();
      setHotels(data.hotels || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels({ city: initialCity, search: initialSearch });
  }, [initialCity, initialSearch]);

  const handleFilter = (filters: any) => fetchHotels(filters, 1);
  const handlePageChange = (newPage: number) => {
    fetchHotels({}, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-saffron-950 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,153,51,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron-500 via-white to-india-green" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-saffron-400 bg-saffron-500/10 px-4 py-1.5 rounded-full mb-5 border border-saffron-500/20">
              🏨 Browse All Hotels
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {initialCity ? (
                <>Hotels in <span className="gradient-text-saffron">{initialCity}</span></>
              ) : (
                <>Explore Hotels Across <span className="gradient-text-saffron">India</span></>
              )}
            </h1>
            <p className="text-gray-400 text-lg">
              {initialSearch
                ? `Results for "${initialSearch}"`
                : "Find your perfect stay from our curated collection"}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Floating Filter Card */}
        <div className="-mt-6 mb-8 relative z-20">
          <SearchFilter
            onFilter={handleFilter}
            initialFilters={{ city: initialCity, search: initialSearch }}
          />
        </div>

        {/* Results Header */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {total > 0 ? (
                  <>Showing <span className="font-semibold text-gray-800">{hotels.length}</span> of <span className="font-semibold text-gray-800">{total}</span> hotels</>
                ) : (
                  "No hotels found"
                )}
              </span>
            </div>
            {total > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-saffron-600 bg-saffron-50 px-3 py-1.5 rounded-lg">
                <FiStar className="fill-saffron-500 text-saffron-500" size={12} />
                All hotels verified
              </div>
            )}
          </div>
        )}

        {/* Hotel Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => <HotelCardSkeleton key={i} />)}
          </div>
        ) : hotels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm"
          >
            <span className="text-7xl block mb-5">🏨</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              No Hotels Found
            </h3>
            <p className="text-gray-400 mb-8 text-lg">Try adjusting your search or clearing the filters.</p>
            <button
              onClick={() => fetchHotels({})}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {hotels.map((hotel: any, i: number) => (
                <HotelCard key={hotel._id} hotel={hotel} index={i} />
              ))}
            </div>
            <div className="mt-10">
              <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent" />
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}