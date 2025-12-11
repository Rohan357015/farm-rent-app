// models/cart.model.js
import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  // suppliername: {type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true},
  quantity: { type: Number, default: 1 },
  
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true, unique: true },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);
