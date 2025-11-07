import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className='w-full h-[70px] bg-[#272c4e] flex justify-between items-center px-8'>
      <div className='flex items-center gap-2'>
        <FontAwesomeIcon icon={faStar} className='text-yellow-400 text-[24px]' />
        <p className='text-white text-[24px] font-semibold'>AgroRent</p>
      </div>

      <ul className='flex items-center gap-8 text-white text-[18px]'>
        <li>
          <Link to="/" className='hover:text-yellow-400 cursor-pointer'>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className='hover:text-yellow-400 cursor-pointer'>
            About
          </Link>
        </li>
        <li>
          <Link to="/rentals" className='hover:text-yellow-400 cursor-pointer'>
            Rentals
          </Link>
        </li>
        <li>
          <Link to="/contact" className='hover:text-yellow-400 cursor-pointer'>
            Contact
          </Link>
        </li>
        <li>
          <Link
            to="/farmer-login"
            className='bg-transparent text-white border border-yellow-400 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition'
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/farmer-register"
            className='bg-yellow-400 text-blue-950 font-semibold border border-amber-400 px-4 py-2 rounded-lg hover:bg-transparent hover:text-yellow-400 transition'
          >
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
