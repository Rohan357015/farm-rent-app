export const calculateAverageRating = (ratings = []) => {
  if (!ratings.length) {
    return 0;
  }

  const total = ratings.reduce((sum, item) => sum + Number(item.rating || 0), 0);
  return Number((total / ratings.length).toFixed(1));
};

export const addOrUpdateRating = ({ ratings = [], userId, rating, review = "" }) => {
  const ratingValue = Number(rating);
  const nextRatings = [...ratings];
  const existingIndex = nextRatings.findIndex(
    (item) => item.userId?.toString() === userId.toString()
  );

  const nextRating = {
    userId,
    rating: ratingValue,
    review,
  };

  if (existingIndex >= 0) {
    nextRatings[existingIndex] = nextRating;
  } else {
    nextRatings.push(nextRating);
  }

  return {
    ratings: nextRatings,
    averageRating: calculateAverageRating(nextRatings),
  };
};
