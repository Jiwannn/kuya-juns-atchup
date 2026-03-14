"use client";

import { Star } from "lucide-react";

interface ReviewProps {
  review: {
    id: number;
    user_name: string;
    rating: number;
    review: string;
    created_at: string;
  };
}

export default function ReviewCard({ review }: ReviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <span className="text-orange-600 font-semibold text-sm">
              {review.user_name?.charAt(0) || 'U'}
            </span>
          </div>
          <span className="font-medium text-gray-800">{review.user_name || 'Anonymous'}</span>
        </div>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-2">{review.review}</p>
      <p className="text-xs text-gray-400">
        {new Date(review.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}