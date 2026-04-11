import Farmer from "../models/farmer.model.js";
import Supplier from "../models/supplier.model.js";
import { Product } from "../models/product.model.js";
import { addOrUpdateRating } from "../utils/rating.js";

const validateRatingInput = ({ targetId, rating }) => {
  const numericRating = Number(rating);

  if (!targetId) {
    return "Target id is required";
  }

  if (!numericRating || numericRating < 1 || numericRating > 5) {
    return "Rating must be between 1 and 5";
  }

  return null;
};

export const rateProduct = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only renters can rate equipment" });
    }

    const { productId, rating, review } = req.body;
    const validationError = validateRatingInput({ targetId: productId, rating });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const result = addOrUpdateRating({
      ratings: product.ratings,
      userId: req.user._id,
      rating,
      review,
    });

    product.ratings = result.ratings;
    product.averageRating = result.averageRating;
    await product.save();

    return res.status(200).json({
      message: "Equipment rating saved",
      averageRating: product.averageRating,
      ratings: product.ratings,
    });
  } catch (error) {
    console.error("Rate product error:", error);
    return res.status(500).json({ message: "Failed to rate equipment" });
  }
};

export const rateSupplier = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Only renters can rate suppliers" });
    }

    const { supplierId, rating, review } = req.body;
    const validationError = validateRatingInput({ targetId: supplierId, rating });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const result = addOrUpdateRating({
      ratings: supplier.ratings,
      userId: req.user._id,
      rating,
      review,
    });

    supplier.ratings = result.ratings;
    supplier.averageRating = result.averageRating;
    await supplier.save();

    return res.status(200).json({
      message: "Supplier rating saved",
      averageRating: supplier.averageRating,
      ratings: supplier.ratings,
    });
  } catch (error) {
    console.error("Rate supplier error:", error);
    return res.status(500).json({ message: "Failed to rate supplier" });
  }
};

export const rateRenter = async (req, res) => {
  try {
    if (req.user.role !== "supplier") {
      return res.status(403).json({ message: "Only suppliers can rate renters" });
    }

    const { renterId, rating, review } = req.body;
    const validationError = validateRatingInput({ targetId: renterId, rating });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const renter = await Farmer.findById(renterId);
    if (!renter) {
      return res.status(404).json({ message: "Renter not found" });
    }

    const result = addOrUpdateRating({
      ratings: renter.ratings,
      userId: req.user._id,
      rating,
      review,
    });

    renter.ratings = result.ratings;
    renter.averageRating = result.averageRating;
    await renter.save();

    return res.status(200).json({
      message: "Renter rating saved",
      averageRating: renter.averageRating,
      ratings: renter.ratings,
    });
  } catch (error) {
    console.error("Rate renter error:", error);
    return res.status(500).json({ message: "Failed to rate renter" });
  }
};
