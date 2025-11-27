import React from "react";
import { motion } from "framer-motion";
import tractor from "../assets/welcome.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authstore.js";
function SupplierRegister() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    companyName: "",
    role: "supplier",
  });

const registerUser = useAuthStore((state) => state.SupplierRegister);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validate passwords match
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  // Validate required fields
  const requiredFields = ['name', 'phone', 'email', 'password', 'location', 'companyName'];
  const emptyFields = requiredFields.filter(field => !formData[field]);
  if (emptyFields.length > 0) {
    alert(`Please fill in: ${emptyFields.join(', ')}`);
    return;
  }

  try {
    await registerUser(formData);
    navigate('/supplier-login'); // Redirect after successful registration
  } catch (error) {
    console.error('Registration failed:', error);
    alert('Registration failed. Please try again.');
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-[#12152D] h-screen flex justify-around items-center text-white overflow-hidden">
        {/* Left Section - Registration Image or Graphic */}
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <img className="opacity-90" src={tractor} alt="Tractor" height={800} width={800} />
        </motion.div>

        {/* Right Section - Registration Form */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }} 
          className="bg-[#F9EFE6] text-blue-950 p-15  w-2/5 h-[90vh] rounded-lg flex justify-center items-center flex-col gap-[-0.5rem]"
        >
          <h1 className="font-bold text-gray-500 text-[2rem]">AgroRent</h1>
          <h3 className="text-gray-600">Your farm equipment rentals</h3>
            {/* Toggle Buttons */}
            <div className='flex justify-around gap-12 mb-6 pt-2'>
          <button
            onClick={() => navigate('/farmer-register')}
            className={`px-2 border-b-4 ${
              location.pathname === '/farmer-register'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-gray-600 hover:text-yellow-500'
            }`}
          >
            Renter Register
          </button>

          <button
            onClick={() => navigate('/supplier-register')}
            className={`px-2 border-b-4 ${
              location.pathname === '/supplier-register'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-gray-600 hover:text-yellow-500'
            }`}
          >
            Supplier Register
          </button>
        </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 mt-2">
            <div className="flex flex-col gap-4">
              <input
                className="bg-white h-8  w-120 rounded-lg px-10"
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                className="bg-white h-8 w-120 rounded-lg px-10"
                type="text"
                placeholder="Phone No"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                className="bg-white h-8 w-120 rounded-lg px-10"
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                className="bg-white h-8 w-120 rounded-lg px-10"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                className="bg-white h-8 w-120 rounded-lg px-10"
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <input
                className="bg-white h-8 w-120 rounded-lg px-10"
                type="text"
                placeholder="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
              <input
                className="bg-white h-8 w-120 rounded-lg px-10"
                type="text"
                placeholder="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
              <select
                name="role"
                className="bg-white h-8 rounded-lg px-10"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="supplier">Supplier</option>
                <option value="farmer">Farmer</option>
              </select>

            </div>

            <button className="bg-yellow-400 text-blue-950 font-semibold border border-amber-400 px-4 py-2 rounded-lg hover:bg-transparent hover:text-yellow-400 transition mt-[-3%]">
              Register
            </button>

            <div>
              <p>
                Already have an account?{" "}
                <a href="/supplier-login" className="text-yellow-500">
                  Login here
                </a>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
  );
};

export default SupplierRegister;