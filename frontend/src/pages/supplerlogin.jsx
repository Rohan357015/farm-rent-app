import React from 'react'
import { motion } from 'framer-motion'
import tractor from '../assets/welcome.png'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../store/authstore'

function SupplierLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }
  const {SupplierLogin} = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    SupplierLogin(formData);
    navigate('/supplier-dashboard');
  }
  return (
    <div className='bg-[#12152D] h-screen flex justify-around items-center text-white overflow-hidden'>
      {/* Left Section - Tractor Image */}
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <img className='opacity-90' src={tractor} alt="Tractor" height={800} width={800} />
      </motion.div>

      {/* Right Section - Login Form */}
      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className='bg-[#F9EFE6] text-blue-950 p-10 rounded-lg flex justify-center items-center flex-col'
      >
        <h1 className='font-bold text-gray-500 text-[2rem]'>AgroRent</h1>
        <h3 className='text-gray-600'>Your farm equipment rentals</h3>

        {/* Toggle Buttons */}
        <div className='flex justify-around gap-12 mb-6'>
          <button
            onClick={() => navigate('/farmer-login')}
            className={`px-2 border-b-4 ${
              location.pathname === '/farmer-login'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-gray-600 hover:text-yellow-500'
            }`}
          >
            Renter Login
          </button>

          <button
            onClick={() => navigate('/supplier-login')}
            className={`px-2 border-b-4 ${
              location.pathname === '/supplier-login'
                ? 'border-yellow-500 text-yellow-500'
                : 'border-transparent text-gray-600 hover:text-yellow-500'
            }`}
          >
            Supplier Login
          </button>
        </div>

        {/* Login Form */}
        <form className='flex flex-col gap-8 mt-5'>
          <div className='flex flex-col gap-5'>
             <input 
                name="email"
                value={formData.email}
                onChange={handleChange} className='bg-white h-12 rounded-lg px-4' type="text" placeholder='Email' />
            <input 
                 name="password"
                value={formData.password}
                onChange={handleChange} 
                className='bg-white h-12 rounded-lg px-4' type="password" placeholder='Password' />
          </div>

          <a href="" className='text-gray-500 hover:text-yellow-500 transition'>Forgot Password?</a>

          <button className='bg-yellow-400 text-blue-950 font-semibold border border-amber-400 px-4 py-2 rounded-lg hover:bg-transparent hover:text-yellow-400 transition mt-[-3%]'>
            Login To Account
          </button>

          <div>
            <p>Don't have an account? <a href="##" className='text-yellow-500'>Register here</a></p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SupplierLogin;