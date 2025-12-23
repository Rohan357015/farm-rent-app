import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../store/authstore';
import { useNavigate } from 'react-router-dom';
import { Menu } from "lucide-react";


const FarmerNavabar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    return (
        <nav className='w-full border border-gray-300 bg-white text-black h-[70px] flex justify-between items-center px-8 shadow-2xl'>
            <div>
                <Menu
                    onClick={onMenuClick}
                    className="text-black cursor-pointer "
                />
            </div>
            <div className='flex items-center gap-2 relative right-[15%] text-3xl font-bold'>
                <Link to="/farmer-dashboard">🌽 AgroRent</Link>
            </div>
            <div>
                <ul className='flex justify-between items-center gap-8 text-lg font-semibold'>
                    <li><Link to={user.role === "farmer" ? "/farmer-dashboard" : "/supplier-dashboard"} className='hover:text-yellow-500 transition'>Dashboard</Link></li>
                    <li>
                        <Link
                            to={user.role === "farmer" ? "" : "/supplier-equipments"}
                            className='hover:text-yellow-500 transition'
                        >
                            Equipment
                        </Link>
                    </li>
                    <li><Link to={user.role === "farmer" ? "/farmer-bookings" : "/supplier-rentals"} className='hover:text-yellow-500 transition'>Rental</Link></li>
                    <li><Link to={user.role === "farmer" ? "/farmer-earnings" : "/supplier-earnings"} className='hover:text-yellow-500 transition'>Earnings</Link></li>
                    <li><Link to={user.role === "farmer" ? "/farmer-help" : "/supplier-help"} className='hover:text-yellow-500 transition'>Help</Link></li>
                </ul>
            </div>
            <div>
                <ul className='flex justify-between items-center gap-8 text-lg font-semibold'>
                    <li><Link to="/farmer-notifications"><FontAwesomeIcon icon={faBell} className='text-blue-950 text-2xl hover:text-yellow-600 transition' /></Link></li>
                    <li><Link to="/farmer-profile"><FontAwesomeIcon icon={faUser} className='text-blue-950 text-2xl hover:text-yellow-600 transition' /></Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default FarmerNavabar;