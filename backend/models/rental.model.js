import mongoose from "mongoose";
import Farmer from "./farmer.model.js";

const rentalSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    pricePerDay: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["tractor", "harvester", "sprayer", "plough", "other"],
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    // ⭐ ACTIVE / INACTIVE STATUS
    status: {
      type: String,
      enum: ["active", "inactive", "booked"],
      default: "active",
    },

    location: {
      type: String,
      required: true,
    },

    // Availability
    availableFrom: Date,
    availableTill: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Rental", rentalSchema);
