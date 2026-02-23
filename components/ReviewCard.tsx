"use client";

import { FiStar, FiTrash2 } from "react-icons/fi";
import { formatDate } from "@/utils/formatCurrency";

interface Review {
  _id: string;
  userId: { _id: string; name: string; profileImage?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  review: Review;
  canDelete?: boolean;
  onDelete?: (id: string) => void;
}

export default function ReviewCard({ review, canDelete, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-saffron-100 rounded-full flex items-center justify-center text-saffron-600 font-bold">
            {review.userId?.name?.charAt(0) || "U"}
          </div>
          <div>
            <p className="font-medium text-gray-800">{review.userId?.name || "User"}</p>
            <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-saffron-50 px-2 py-1 rounded-full">
            <FiStar className="text-saffron-500 fill-saffron-500" size={12} />
            <span className="text-sm font-semibold text-saffron-700">{review.rating}</span>
          </div>
          {canDelete && onDelete && (
            <button
              onClick={() => onDelete(review._id)}
              className="text-red-400 hover:text-red-600 transition p-1"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="mt-3 text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}