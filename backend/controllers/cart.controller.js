import Cart from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import Supplier from "../models/supplier.model.js";
import mongoose from "mongoose";

/*****************************
 * Helper to get/create cart
 *****************************/
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

/*****************************
 * GET CART
 *****************************/
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId })
  .populate({
    path: "items.equipmentId",
    model: "Product",
    select: "equipmentName category images pricing supplier",
    populate: {
      path: "supplier",      // yahi se supplier document aayega
      model: "Supplier",
      select: "name companyName",        // sirf name chahiye
    },
  });
      
     

    if (!cart) return res.json({ items: [], subtotal: 0 });

    // Build response
    const items = cart.items.map((item) => {
      const prod = item.equipmentId;
   

      if (!prod) return null;

      const price = prod.pricing?.dailyRate ?? 0;

      return {
        _id: prod._id,
        name: prod.equipmentName,
        image: prod.images?.[0] || null,
        category: prod.category,
        supplier: prod.supplier ? prod.supplier.name : "Unknown Supplier",
        companyName: prod.supplier ? prod.supplier.companyName : "",

        pricePerDay: price,
        quantity: item.quantity,
        totalPrice: price * item.quantity
      };
    }).filter(Boolean);

    const subtotal = items.reduce((s, x) => s + x.totalPrice, 0);

    res.json({ items, subtotal });

  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/*****************************
 * ADD TO CART
 *****************************/
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { equipmentId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find product + supplier
    const product = await Product.findById(equipmentId).populate("supplier", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const supplierId = product.supplier?._id;

    const cart = await getOrCreateCart(userId);

    // Check if item already exists
    const existing = cart.items.find(
      (i) => i.equipmentId.toString() === equipmentId.toString()
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({
        equipmentId,
        supplierId,     // store supplier reference
        quantity
      });
    }

    await cart.save();

    res.json({ message: "Added to cart", cart });

  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/*****************************
 * UPDATE CART ITEM
 *****************************/
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { equipmentId } = req.params;
    const { quantity } = req.body;

    const cart = await getOrCreateCart(userId);

    const item = cart.items.find(
      (i) => i.equipmentId.toString() === equipmentId.toString()
    );

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (i) => i.equipmentId.toString() !== equipmentId.toString()
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json({ message: "Cart updated", cart });

  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/*****************************
 * REMOVE FROM CART
 *****************************/
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { equipmentId } = req.body;

    const cart = await getOrCreateCart(userId);

    if (!equipmentId) {
      cart.items = [];
    } else {
      cart.items = cart.items.filter(
        (i) => i.equipmentId.toString() !== equipmentId.toString()
      );
    }

    await cart.save();
    res.json({ message: "Item removed", cart });

  } catch (err) {
    console.error("REMOVE CART ITEM ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
