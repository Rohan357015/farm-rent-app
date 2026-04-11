import mongoose from "mongoose";
import Supplier from "./supplier.model.js";

const productRatingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      default: "",
    },
  },
  { _id: false, timestamps: true }
);

const productSchema = new mongoose.Schema({

  equipmentName: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  yearOfManufacture: { type: Number },
  condition: { type: String, enum: ["Excellent", "Good", "Fair"], default: "Good" },
  description: { type: String },
  deliveryAndPickup: { type: Boolean, default: false },
  deliveryPrices: {
   type:Number,default:0
  },
  operator  : { type: Boolean, default: false },
  operatorCharges: { type: Number, default: 0 },

  // Equipment Images
  images: [{ type: String }],

  // Specifications & Features
  horsepower: { type: Number },
  operatingHours: { type: Number },
  features: {
    gpsEnabled: { type: Boolean, default: false },
    airCabin: { type: Boolean, default: false },
    powerSteering: { type: Boolean, default: false },
    automatic: { type: Boolean, default: false },
    fourWD: { type: Boolean, default: false },
    hydraulicLift: { type: Boolean, default: false },
  },
  additionalNotes: { type: String },

  // Pricing
  pricing: {
    dailyRate: { type: Number, required: true },
    weeklyRate: { type: Number },
    monthlyRate: { type: Number },
    securityDeposit: { type: Number },
    inclusions: {
      fuel: { type: Boolean, default: false },
      operator: { type: Boolean, default: false },
      maintenance: { type: Boolean, default: false },
      insurance: { type: Boolean, default: false },
    },
  },

  // Availability & Location
  availability: {
    available: { type: Boolean, default: true },
    availableFrom: { type: Date },
  },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
  location: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    deliveryRadius: { type: Number },
    deliveryChargePerKm: { type: Number },
  },
  ratings: {
    type: [productRatingSchema],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0,
  },

  // Terms & Conditions
  terms: {
    rentalTerms: { type: String },
    cancellationPolicy: { type: String },
    damagePolicy: { type: String },
  },
  agreement: {
    agreedToTerms: { type: Boolean, default: false },
    verifiedInformation: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Approved",
  },
}, { timestamps: true });

productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ status: 1, averageRating: -1, createdAt: -1 });
productSchema.index({ supplier: 1, createdAt: -1 });
productSchema.index({ equipmentName: "text", category: "text", brand: "text", model: "text" });
productSchema.index({ "location.city": 1, "location.state": 1, status: 1 });
productSchema.index({ "location.lat": 1, "location.lng": 1 });

export const Product = mongoose.model("Product", productSchema);
