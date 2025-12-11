import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },

    // Supplier or Owner (from Rental listing)
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",  
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },
    pickUpLocation: { 
      type: String,
      required: true,
    },
    returnLocation: { 
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    operators: {
      type: Boolean,
      default: false,
    },

    totalPrice: Number,

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
