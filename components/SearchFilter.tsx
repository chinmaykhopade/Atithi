"use client";

import { useState } from "react";
import { INDIAN_CITIES } from "@/utils/constants";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

interface FilterState {
  search: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
}

interface Props {
  onFilter: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export default function SearchFilter({ onFilter, initialFilters }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    search: initialFilters?.search || "",
    city: initialFilters?.city || "",
    minPrice: initialFilters?.minPrice || "",
    maxPrice: initialFilters?.maxPrice || "",
    rating: initialFilters?.rating || "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const clearFilters = () => {
    const empty = { search: "", city: "", minPrice: "", maxPrice: "", rating: "" };
    setFilters(empty);
    onFilter(empty);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 md:p-6">
      {/* Main search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search hotels, cities..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition"
          />
        </div>
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none transition bg-white"
        >
          <option value="">All Cities</option>
          {INDIAN_CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition md:w-auto"
        >
          <FiFilter /> Filters
        </button>
        <button
          type="submit"
          className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-md transition"
        >
          Search
        </button>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Min Price (₹)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              placeholder="₹0"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-saffron-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Max Price (₹)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              placeholder="₹50,000"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-saffron-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Min Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-saffron-400 outline-none bg-white"
            >
              <option value="">Any Rating</option>
              <option value="3">3+ Stars</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
            </select>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="col-span-full text-sm text-red-500 hover:text-red-600 flex items-center gap-1 justify-center py-2"
          >
            <FiX /> Clear all filters
          </button>
        </div>
      )}
    </form>
  );
}