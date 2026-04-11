import React from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  onChange,
  size = 18,
  disabled = false,
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const active = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            disabled={disabled}
            onClick={() => onChange?.(starValue)}
            className={disabled ? "cursor-default" : "cursor-pointer"}
          >
            <Star
              size={size}
              className={active ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  );
}
