"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRatingInput({
  name,
  required = false,
}: {
  name: string;
  required?: boolean;
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      <input type="hidden" name={name} value={rating} required={required} />
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${star} out of 5 stars`}
            className="p-0.5"
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                filled ? "fill-sun-400 text-sun-400" : "fill-slate-200 text-slate-200"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
