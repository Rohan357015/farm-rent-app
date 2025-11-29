import React from 'react';
import FarmerNavabar from './navBar2.jsx';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tractor, Star, Activity } from "lucide-react";
import AutoWeather from '../../components/weatherApp.jsx';
import MainDropDown from '../dashboard/MainDropDown.jsx';
import { useAuthStore } from '../../store/authstore.js';
import { useEffect } from 'react';
import EquipmentBrowser from './featured.jsx';


const FarmerDashboard = () => {
    const { user, getFarmerDashboard } = useAuthStore();
    useEffect(() => {
    getFarmerDashboard();
  }, []);
  const avgRating = user && user.ratings && user.ratings.length > 0
    ? (user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length).toFixed(1)
    : "NA";

    return (
        <div className="min-h-screen bg-[#12152D] text-white ">
            <FarmerNavabar />
            <div  className='flex justify-between items-start'>
              <div className='profile  w-[20%] h-screen overflow-y-auto flex flex-col gap-8 bg-white text-black'
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <section className="profile-info flex items-center flex-col">
                    <div className="rounded-full bg-green-600 w-24 h-24  mt-10 flex flex-col items-center justify-center">
                        <FontAwesomeIcon  className =" text-3xl" icon = {faUser}/>
                     
                    </div>
                    <h3 className='font-semibold text-[1rem] '>{user?.name}</h3>
                    <p className="text-gray-400">{user?.location}</p>
                </section>
                <section className='flex items-center justify-around text-lg font-serif'>
                    <div className='flex flex-col items-center'><h2 className='text-green-900'>{user?.rentals} </h2><p>Rentals</p></div>
                    <div className='flex flex-col items-center'><h2 className='text-green-900'> {avgRating} </h2><p>Ratings</p></div>
                    <div className='flex flex-col items-center'><h2 className='text-green-900'>{user?.activerentals}</h2><p>Active</p></div>
                </section>
                <section className="weather">
                 <AutoWeather/>
                </section>
                <hr  className='text-gray-300'/>
                <section className=' w-full  dropmenu '>
                    <MainDropDown />
                </section>
            </div>

            <div className="info bg-yellow-50 text-black w-[80%] h-screen overflow-y-auto flex  flex-col justify-start items-center"
                 style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <EquipmentBrowser />
            </div>
             </div>
        </div>
    );
}

export default FarmerDashboard;