"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { formatINR, formatDate } from "@/utils/formatCurrency";
import { motion } from "framer-motion";
import { FiMapPin, FiStar, FiUsers, FiCheck, FiArrowRight, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function HotelDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const router = useRouter();
  const [hotel, setHotel] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/hotels/${id}`);
      const data = await res.json();
      if (res.ok) {
        setHotel(data.hotel);
        setRooms(data.rooms || []);
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: `${hotel?.name} | Atithi Luxury`,
      text: `Check out this amazing property: ${hotel?.name} on Atithi.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Could not share");
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Review deleted");
        fetchData();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-saffron-200 rounded-full mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😢</span>
          <h2 className="text-2xl font-bold text-gray-700">Hotel Not Found</h2>
          <Link href="/hotels" className="text-saffron-500 mt-4 inline-block hover:underline">
            Back to Hotels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={hotel.images?.[selectedImage] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Image thumbnails */}
        {hotel.images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {hotel.images.map((_: string, i: number) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-3 h-3 rounded-full transition ${i === selectedImage ? "bg-white scale-125" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}

        {/* Hotel title overlay */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-white mb-2 leading-tight">
                {hotel.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/90">
                <span className="flex items-center gap-1 text-sm">
                  <FiMapPin /> {hotel.city}, {hotel.state}
                </span>
                <span className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-sm">
                  <FiStar className="fill-saffron-400 text-saffron-400" /> {hotel.rating} ({hotel.totalReviews} reviews)
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-full transition-all duration-200 group border border-white/20"
                >
                  <FiShare2 size={13} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-medium">Share</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">About This Hotel</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              <p className="text-sm text-gray-500 mt-3">📍 {hotel.address}</p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.amenities?.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-2 text-gray-600">
                    <FiCheck className="text-india-green flex-shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Rooms</h2>
              {rooms.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No rooms available currently</p>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room: any) => (
                    <div
                      key={room._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-saffron-200 hover:bg-saffron-50/30 transition"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">{room.type}</h3>
                        <p className="text-sm text-gray-500">
                          <FiUsers className="inline mr-1" />
                          Up to {room.capacity} guests
                        </p>
                        {room.description && (
                          <p className="text-xs text-gray-400 mt-1">{room.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-india-green">{formatINR(room.price)}</p>
                          <p className="text-xs text-gray-400">per night</p>
                        </div>
                        {room.availabilityStatus ? (
                          <button
                            onClick={() => {
                              if (!user) {
                                router.push(`/login?redirect=/booking/${hotel._id}?roomId=${room._id}`);
                              } else {
                                router.push(`/booking/${hotel._id}?roomId=${room._id}`);
                              }
                            }}
                            className="bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-md transition flex items-center gap-1 whitespace-nowrap"
                          >
                            Book Now <FiArrowRight />
                          </button>
                        ) : (
                          <span className="text-red-500 text-sm font-medium px-4 py-2 bg-red-50 rounded-xl">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Reviews ({reviews.length})
              </h2>

              {user && user.role === "customer" && (
                <div className="mb-6">
                  <ReviewForm hotelId={hotel._id} onReviewAdded={fetchData} />
                </div>
              )}

              {reviews.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                  <p className="text-gray-500">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review: any) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      canDelete={
                        user?._id === review.userId?._id || user?.role === "admin"
                      }
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Sidebar - Booking summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-500">Starting from</p>
                  <p className="text-3xl font-bold text-india-green">
                    {formatINR(hotel.pricePerNight)}
                  </p>
                  <p className="text-sm text-gray-400">per night</p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rating</span>
                    <span className="font-semibold flex items-center gap-1">
                      <FiStar className="text-saffron-500 fill-saffron-500" size={14} />
                      {hotel.rating}/5
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reviews</span>
                    <span className="font-semibold">{hotel.totalReviews}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rooms Available</span>
                    <span className="font-semibold">
                      {rooms.filter((r: any) => r.availabilityStatus).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">City</span>
                    <span className="font-semibold">{hotel.city}</span>
                  </div>
                </div>

                {rooms.length > 0 && (
                  <button
                    onClick={() => {
                      const availableRoom = rooms.find((r: any) => r.availabilityStatus);
                      if (availableRoom) {
                        if (!user) {
                          router.push(`/login?redirect=/booking/${hotel._id}?roomId=${availableRoom._id}`);
                        } else {
                          router.push(`/booking/${hotel._id}?roomId=${availableRoom._id}`);
                        }
                      }
                    }}
                    className="w-full mt-6 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-[1.02]"
                  >
                    Book Now
                  </button>
                )}

                <p className="text-center text-xs text-gray-400 mt-3">
                  🔒 Secure booking with Razorpay
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}