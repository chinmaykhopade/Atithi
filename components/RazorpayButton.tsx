"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface Props {
  amount: number;
  bookingId: string;
  onSuccess: (paymentData: any) => void;
  onFailure: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({ amount, bookingId, onSuccess, onFailure }: Props) {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const loadScript = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) {
      toast.error("Failed to load Razorpay. Check internet connection.");
      setLoading(false);
      return;
    }

    try {
      // Create order on server
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, bookingId }),
      });

      const { order } = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Atithi",
        description: "Hotel Booking — Atithi Platform",
        order_id: order.id,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            }),
          });

          if (verifyRes.ok) {
            toast.success("Payment successful! 🎉");
            onSuccess(response);
          } else {
            toast.error("Payment verification failed");
            onFailure();
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: "#d97706",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      toast.error("Payment failed");
      onFailure();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="btn-gold w-full !rounded-xl !py-3.5 !text-base disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing Payment…
        </span>
      ) : `Pay Securely ₹${amount.toLocaleString("en-IN")}`}
    </button>
  );
}