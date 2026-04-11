import React from "react";
import StarRating from "./StarRating.jsx";

export default function RenterRatingCard({
  farmer,
  onSubmit,
  loading = false,
}) {
  const [rating, setRating] = React.useState(0);
  const [review, setReview] = React.useState("");

  return (
    <div className="mt-4 rounded-lg border bg-gray-50 p-4">
      <p className="font-medium text-gray-800">Rate renter</p>
      <p className="mt-1 text-sm text-gray-600">
        {farmer?.name} average rating: {farmer?.averageRating || 0}
      </p>

      <div className="mt-3 space-y-3">
        <StarRating value={rating} onChange={setRating} />
        <textarea
          rows="2"
          value={review}
          onChange={(event) => setReview(event.target.value)}
          placeholder="Optional review"
          className="w-full rounded-lg border p-2"
        />
        <button
          type="button"
          disabled={!rating || loading}
          onClick={() => onSubmit({ rating, review })}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Save renter rating
        </button>
      </div>
    </div>
  );
}
