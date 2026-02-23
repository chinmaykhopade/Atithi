"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { FiStar } from "react-icons/fi";

interface Props {
  hotelId: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({ hotelId, onReviewAdded }: Props) {
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please provide a rating and comment");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hotelId, rating, comment }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Review added!");
        setRating(0);
        setComment("");
        onReviewAdded();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <h4 className="font-semibold text-gray-800 mb-3">Write a Review</h4>

      {/* Star rating */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="transition transform hover:scale-110"
          >
            <FiStar
              size={24}
              className={
                (hoverRating || rating) >= star
                  ? "text-saffron-500 fill-saffron-500"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
        <span className="text-sm text-gray-500 ml-2 self-center">
          {rating > 0 && `${rating}/5`}
        </span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience..."
        rows={3}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-saffron-400 focus:ring-2 focus:ring-saffron-100 outline-none resize-none transition"
      />

      <button
        type="submit"
        disabled={submitting}
        className="mt-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-md transition disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}