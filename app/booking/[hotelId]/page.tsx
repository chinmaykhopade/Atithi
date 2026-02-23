"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import RazorpayButton from "@/components/RazorpayButton";
import { formatINR } from "@/utils/formatCurrency";
import { calculateNights } from "@/utils/helpers";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";

export default function BookingPage() {
  const { hotelId } = useParams();
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const { user, token } = useAuth();
  const router = useRouter();

  const [hotel, setHotel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);

  const nights = calculateNights(checkIn, checkOut);
  const totalAmount = room ? room.price * Math.max(nights, 1) : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`);
        const data = await res.json();
        if (res.ok) {
          setHotel(data.hotel);
          if (roomId) {
            const selectedRoom = data.rooms?.find((r: any) => r._id === roomId);
            setRoom(selectedRoom || data.rooms?.[0]);
          } else if (data.rooms?.length > 0) {
            setRoom(data.rooms[0]);
          }
        }
      } catch {
        toast.error("Failed to load hotel");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId, roomId]);

  const createBooking = async () => {
    if (nights < 1) {
      toast.error("Check-out must be after check-in");
      return null;
    }

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId,
          roomId: room._id,
          checkInDate: checkIn,
          checkOutDate: checkOut,
          totalAmount,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setBookingId(data.booking._id);
        return data.booking._id;
      } else {
        toast.error(data.error);
        return null;
      }
    } catch {
      toast.error("Failed to create booking");
      return null;
    }
  };

  const handlePaymentFlow = async () => {
    const bId = await createBooking();
    if (bId) {
      setBookingId(bId);
    }
  };

  const handlePaymentSuccess = async () => {
    toast.success("Booking confirmed! 🎉");
    router.push("/dashboard/bookings");
  };

  const handlePaymentFailure = () => {
    toast.error("Payment failed. Please try again.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Loading booking...</div>
      </div>
    );
  }

  if (!hotel || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-6xl block mb-4">😢</span>
          <h2 className="text-xl font-bold text-gray-700">Hotel or room not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-heading font-bold text-gray-800 mb-6"
        >
          Complete Your Booking
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Hotel Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex gap-4">
                <img
                  src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"}
                  alt={hotel.name}
                  className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">{hotel.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiMapPin size={14} /> {hotel.city}, {hotel.state}
                  </p>
                  <p className="text-sm text-saffron-600 font-medium mt-1">
                    {room.type} Room • <FiUsers className="inline" size={14} /> {room.capacity} guests
                  </p>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FiCalendar /> Select Dates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value >= checkOut) {
                        const nextDay = new Date(e.target.value);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setCheckOut(nextDay.toISOString().split("T")[0]);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none transition"
                  />
                </div>
              </div>
              {nights > 0 && (
                <p className="text-sm text-gray-500 mt-3">
                  📅 {nights} night{nights > 1 ? "s" : ""}
                </p>
              )}
            </div>

            {/* Guest Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Guest Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Price Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Price Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{room.type} Room</span>
                  <span>{formatINR(room.price)}/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span>{nights} night{nights > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Taxes & Fees</span>
                  <span className="text-india-green">Included</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-india-green">
                    {formatINR(totalAmount)}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                {!bookingId ? (
                  <button
                    onClick={handlePaymentFlow}
                    disabled={nights < 1}
                    className="w-full bg-gradient-to-r from-saffron-500 to-saffron-600 text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    Proceed to Payment
                  </button>
                ) : (
                  <RazorpayButton
                    amount={totalAmount}
                    bookingId={bookingId}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                  />
                )}
              </div>

              <p className="text-center text-xs text-gray-400 mt-3">
                🔒 Powered by Razorpay • 100% Secure
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}