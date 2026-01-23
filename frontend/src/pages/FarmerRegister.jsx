import React from "react";
import { motion } from "framer-motion";
import tractor from "../assets/welcome.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authstore.js";
import toast from "react-hot-toast";

function FarmerRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "farmer",
  });

  const FarmerRegister = useAuthStore((state) => state.FarmerRegister);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const requiredFields = ["name", "phone", "email", "password", "location"];
    const emptyFields = requiredFields.filter((f) => !formData[f]);
    if (emptyFields.length > 0) {
      alert(`Please fill in: ${emptyFields.join(", ")}`);
      return;
    }

    try {
      const success = await FarmerRegister(formData);
      if (success) navigate("/farmer-dashboard");
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-[#12152D] min-h-screen flex flex-col lg:flex-row justify-around items-center text-white overflow-x-hidden px-4 lg:px-0">
      
      {/* LEFT IMAGE */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="hidden lg:block"
      >
        <img
          className="opacity-90"
          src={tractor}
          alt="Tractor"
          height={800}
          width={800}
        />
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="bg-[#F9EFE6] text-blue-950 p-6 sm:p-10 w-full sm:w-[90%] md:w-[70%] lg:w-2/5 min-h-[90vh] rounded-lg flex justify-center items-center flex-col"
      >
        <h1 className="font-bold text-gray-500 text-[2rem]">AgroRent</h1>
        <h3 className="text-gray-600">Your farm equipment rentals</h3>

        {/* TOGGLE */}
        <div className="flex justify-around gap-8 mb-6 pt-4">
          <button
            onClick={() => navigate("/farmer-register")}
            className={`px-2 border-b-4 ${
              location.pathname === "/farmer-register"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-600 hover:text-yellow-500"
            }`}
          >
            Renter Register
          </button>

          <button
            onClick={() => navigate("/supplier-register")}
            className={`px-2 border-b-4 ${
              location.pathname === "/supplier-register"
                ? "border-yellow-500 text-yellow-500"
                : "border-transparent text-gray-600 hover:text-yellow-500"
            }`}
          >
            Supplier register
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 mt-2 w-full items-center"
        >
          <div className="flex flex-col gap-4 w-full items-center">
            <input className="bg-white h-10 w-full max-w-md rounded-lg px-6" type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
            <input className="bg-white h-10 w-full max-w-md rounded-lg px-6" type="text" placeholder="Phone No" name="phone" value={formData.phone} onChange={handleChange} />
            <input className="bg-white h-10 w-full max-w-md rounded-lg px-6" type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
            <input className="bg-white h-10 w-full max-w-md rounded-lg px-6" type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            <input className="bg-white h-10 w-full max-w-md rounded-lg px-6" type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            <input className="bg-white h-10 w-full max-w-md rounded-lg px-6" type="text" placeholder="Location" name="location" value={formData.location} onChange={handleChange} />

            <select
              name="role"
              className="bg-white h-10 w-full max-w-md rounded-lg px-6"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="supplier">Supplier</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <button className="bg-yellow-400 text-blue-950 font-semibold border border-amber-400 px-6 py-2 rounded-lg hover:bg-transparent hover:text-yellow-400 transition">
            Register
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <a href="/farmer-login" className="text-yellow-500">
              Login here
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default FarmerRegister;
