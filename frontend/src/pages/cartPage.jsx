// src/pages/CartPage.jsx
import React, { useEffect } from "react";
import { useCartStore } from "../store/useCartStore.js";
import FarmerNavabar from "./dashboard/navBar2.jsx";

export default function CartPage() {
  const { cart, subtotal, total, fetchCart, addToCart, updateCartItem, removeFromCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, []);

  const increment = (item) => {
    updateCartItem(item._id, { quantity: item.quantity + 1 });
  };

  const decrement = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item._id);
    } else {
      updateCartItem(item._id, { quantity: item.quantity - 1 });
    }
  };

  return (
    <div className="w-full bg-yellow-50 min-h-screen">
      <FarmerNavabar />
      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-semibold mb-3 text-green-700">Your Cart</h1>
          <p className="bg-green-100 text-green-800 px-3 py-1 rounded w-fit text-sm mb-2">
            {cart.length} items in cart
          </p>

          {cart.map(item => (
            <div key={item._id} className="bg-white shadow-sm border rounded-xl p-4 flex gap-4">
              <img src={item.image || "https://via.placeholder.com/100"} alt="" className="w-32 h-32 object-cover rounded-lg" />
              <div className="flex-1">
                <span className="text-xs font-semibold text-blue-600">{item.category}</span>
                <h2 className="text-lg font-semibold text-black">{item.name}</h2>
                <p className="text-sm text-gray-500"> From  {item.supplier}</p>
                <p className="text-sm text-gray-500"> Company: {item.companyName}</p>

                <p className="text-gray-700 font-medium mt-1">
                  ₹{item.pricePerDay.toLocaleString()}/day
                </p>

                
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => decrement(item)} className="bg-green-700 px-3 py-1 rounded">–</button>
                  <span className="text-black font-semibold">{item.quantity}</span>
                  <button onClick={() => increment(item)} className="bg-green-700 px-3 py-1 rounded">+</button>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end">
                <button onClick={() => removeFromCart(item._id)} className="text-red-500 text-sm underline">Remove</button>

                <p className="text-lg font-semibold text-green-600">
                  ₹{(item.totalPrice ?? (item.pricePerDay * item.days * item.quantity)).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-80 bg-white border shadow-sm rounded-xl p-5 h-fit mt-20">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{cart.length} items</span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            {/* you can add delivery/deposit/taxes UI here if required */}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-lg font-bold text-green-700">
            <span>Total Amount:</span>
            <span>₹{(total || subtotal).toLocaleString()}</span>
          </div>

          <button className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium">
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
