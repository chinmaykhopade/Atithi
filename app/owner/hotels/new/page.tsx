"use client";

import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { INDIAN_CITIES, INDIAN_STATES, AMENITIES } from "@/utils/constants";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiUploadCloud, FiX, FiCheck, FiImage, FiArrowLeft, FiLoader } from "react-icons/fi";

const AMENITY_ICONS: Record<string, string> = {
  "WiFi": "📶", "Pool": "🏊", "Spa": "💆", "Gym": "🏋️",
  "Restaurant": "🍽️", "Bar": "🍸", "Parking": "🅿️", "AC": "❄️",
  "Breakfast": "🥐", "Pet Friendly": "🐾", "Room Service": "🛎️",
  "Laundry": "👕", "CCTV": "📷", "Power Backup": "⚡", "Hot Water": "🚿",
};

interface UploadedImage {
  url: string;
  public_id: string;
  uploading?: boolean;
  localPreview?: string;
  error?: string;
}

export default function NewHotelPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    state: "",
    address: "",
    pricePerNight: "",
    amenities: [] as string[],
  });

  const updateForm = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleAmenity = (amenity: string) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));

  const uploadFile = async (file: File): Promise<UploadedImage | null> => {
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} is not an image`);
      return null;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${file.name} exceeds 10MB limit`);
      return null;
    }

    const localPreview = URL.createObjectURL(file);
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Add placeholder with preview
    setImages((prev) => [...prev, { url: "", public_id: tempId, uploading: true, localPreview }]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Replace placeholder with real result
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === tempId
            ? { url: data.url, public_id: data.public_id, localPreview }
            : img
        )
      );
      return data;
    } catch (err: any) {
      setImages((prev) =>
        prev.map((img) =>
          img.public_id === tempId
            ? { ...img, uploading: false, error: err.message }
            : img
        )
      );
      toast.error(`Failed to upload ${file.name}`);
      return null;
    }
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 6 - images.length);
    if (fileArray.length === 0) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    await Promise.all(fileArray.map(uploadFile));
  }, [images.length, token]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (public_id: string) => {
    setImages((prev) => prev.filter((img) => img.public_id !== public_id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.state || !form.pricePerNight || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (images.some((img) => img.uploading)) {
      toast.error("Please wait for images to finish uploading");
      return;
    }

    const uploadedImages = images.filter((img) => img.url && !img.error).map((img) => img.url);

    setSaving(true);
    const toastId = toast.loading("Creating your hotel...");
    try {
      const res = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          pricePerNight: Number(form.pricePerNight),
          images: uploadedImages,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("🏨 Hotel created and is now live!", { id: toastId });
        router.push("/owner/hotels");
      } else {
        toast.error(data.error, { id: toastId });
      }
    } catch {
      toast.error("Failed to create hotel", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const uploadingCount = images.filter((i) => i.uploading).length;
  const readyImages = images.filter((i) => i.url && !i.error);

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "linear-gradient(135deg, #fff8f0 0%, #f0fdf4 100%)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/owner" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-saffron-600 transition mb-5">
            <FiArrowLeft size={15} /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-saffron-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              🏨
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                List Your Hotel
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">Fill in the details — your hotel goes live instantly!</p>
            </div>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ── Basic Info ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron-100 text-saffron-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hotel Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g., Taj Heritage Palace"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Describe your hotel — atmosphere, unique features, nearby attractions..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition resize-none text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* ── Location & Price ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron-100 text-saffron-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
              Location & Pricing
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City <span className="text-red-500">*</span></label>
                  <select
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none bg-white text-gray-800"
                    required
                  >
                    <option value="">Select City</option>
                    {INDIAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">State <span className="text-red-500">*</span></label>
                  <select
                    value={form.state}
                    onChange={(e) => updateForm("state", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 outline-none bg-white text-gray-800"
                    required
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="Street, locality, landmark..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition text-gray-800 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price Per Night (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                  <input
                    type="number"
                    value={form.pricePerNight}
                    onChange={(e) => updateForm("pricePerNight", e.target.value)}
                    placeholder="3000"
                    min="100"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition text-gray-800"
                    required
                  />
                </div>
                {form.pricePerNight && (
                  <p className="text-xs text-india-green mt-1.5 font-medium">
                    ✓ Guests will pay ₹{Number(form.pricePerNight).toLocaleString("en-IN")} per night
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Hotel Images ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron-100 text-saffron-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
              Hotel Photos
            </h2>
            <p className="text-sm text-gray-500 mb-5 ml-9">Upload up to 6 high-quality photos. First image is your cover photo.</p>

            {/* Drop Zone */}
            {images.length < 6 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 mb-5 ${isDragging
                    ? "border-saffron-400 bg-saffron-50 scale-[1.01]"
                    : "border-gray-200 hover:border-saffron-300 hover:bg-saffron-50/50"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDragging ? "bg-saffron-100" : "bg-gray-100"}`}>
                    <FiUploadCloud size={28} className={isDragging ? "text-saffron-500" : "text-gray-400"} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {isDragging ? "Drop your images here!" : "Click or drag images here"}
                    </p>
                    <p className="text-sm text-gray-400 mt-0.5">PNG, JPG, WEBP • Max 10MB each • Up to {6 - images.length} more</p>
                  </div>
                  {!isDragging && (
                    <button type="button" className="btn-primary !rounded-xl !py-2 !px-5 text-sm">
                      Browse Files
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Upload progress */}
            {uploadingCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-saffron-600 bg-saffron-50 px-4 py-2.5 rounded-xl mb-4 border border-saffron-100">
                <FiLoader className="animate-spin" size={15} />
                Uploading {uploadingCount} image{uploadingCount > 1 ? "s" : ""} to Cloudinary...
              </div>
            )}

            {/* Image Grid */}
            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {images.map((img, i) => (
                    <motion.div
                      key={img.public_id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative aspect-video rounded-xl overflow-hidden group border-2 border-gray-100"
                      style={{ borderColor: i === 0 ? "#FF9933" : undefined }}
                    >
                      <img
                        src={img.localPreview || img.url}
                        alt={`Hotel image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover badge */}
                      {i === 0 && img.url && (
                        <div className="absolute top-1.5 left-1.5 bg-saffron-500 text-white text-xs px-2 py-0.5 rounded-lg font-bold">
                          Cover
                        </div>
                      )}

                      {/* Uploading overlay */}
                      {img.uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}

                      {/* Error overlay */}
                      {img.error && (
                        <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                          <p className="text-white text-xs text-center px-2">Upload failed</p>
                        </div>
                      )}

                      {/* Success checkmark */}
                      {img.url && !img.uploading && !img.error && (
                        <div className="absolute top-1.5 right-8 w-5 h-5 bg-india-green rounded-full flex items-center justify-center">
                          <FiCheck size={11} className="text-white" />
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(img.public_id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-500 text-white rounded-lg flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <FiX size={12} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {images.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                <FiImage size={15} />
                No images yet — upload at least one to attract guests.
              </div>
            )}

            {readyImages.length > 0 && (
              <p className="text-sm text-india-green mt-3 font-medium">
                ✓ {readyImages.length} image{readyImages.length > 1 ? "s" : ""} uploaded to Cloudinary
              </p>
            )}
          </div>

          {/* ── Amenities ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
              <span className="w-7 h-7 bg-saffron-100 text-saffron-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
              Amenities
            </h2>
            <p className="text-sm text-gray-500 mb-5 ml-9">Select everything your hotel offers.</p>
            <div className="flex flex-wrap gap-2.5">
              {AMENITIES.map((a) => {
                const selected = form.amenities.includes(a);
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selected
                        ? "bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md shadow-saffron-100 scale-105"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-saffron-200 hover:bg-saffron-50"
                      }`}
                  >
                    <span>{AMENITY_ICONS[a] || "✓"}</span>
                    {a}
                    {selected && <FiCheck size={12} />}
                  </button>
                );
              })}
            </div>
            {form.amenities.length > 0 && (
              <p className="text-sm text-india-green mt-4 font-medium">
                ✓ {form.amenities.length} amenit{form.amenities.length > 1 ? "ies" : "y"} selected
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5 p-4 bg-green-50 rounded-xl border border-green-100">
              <span className="text-2xl">🚀</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Instant Listing</p>
                <p className="text-xs text-gray-500">Your hotel will be live immediately after submission.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploadingCount > 0}
              className="w-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-saffron-200 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Hotel...</>
              ) : uploadingCount > 0 ? (
                <><FiLoader className="animate-spin" /> Waiting for uploads...</>
              ) : (
                <>🏨 Create Hotel &amp; Go Live</>
              )}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}