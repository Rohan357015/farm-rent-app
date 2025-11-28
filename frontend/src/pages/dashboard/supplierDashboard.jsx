import React from 'react';
import FarmerNavabar from './navBar2.jsx';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tractor, Star, Activity, Search } from "lucide-react";
import AutoWeather from '../../components/weatherApp.jsx';
import SupplierDropDown from './supplierdropdown.jsx';
import { useAuthStore } from '../../store/authstore.js';
import { useEffect } from 'react';
import DashboardCentre from './dashboardcentre.jsx';
// import { useNavigation } from 'react-router-dom';



const SupplierDashboard = () => {
    const { supplierStats, getSupplierDashboard } = useAuthStore();
    useEffect(() => {
        getSupplierDashboard();
    }, []);
    // const navigate = useNavigation();
    return (
        <div className="min-h-screen bg-[#12152D] text-white ">
            <FarmerNavabar />
            <div className='flex justify-between items-start'>
                <div className='profile  w-[20%] h-screen overflow-y-auto flex flex-col gap-8 bg-white text-black'
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <section className="profile-info flex items-center flex-col">
                        <div className="rounded-full bg-green-600 w-24 h-24  mt-10 flex flex-col items-center justify-center">
                            <FontAwesomeIcon className=" text-3xl" icon={faUser} />

                        </div>
                        <h3 className='font-semibold text-[1rem] '>{supplierStats?.name}</h3>
                        <p className="text-gray-400">{supplierStats?.location}</p>
                        <p className="text-gray-400">{supplierStats?.companyName}</p>
                    </section>
                    <section className='flex items-center justify-around text-lg font-serif'>
                        <div className='flex flex-col items-center'><h2 className='text-green-900'> 12</h2><p>Rentals</p></div>
                        <div className='flex flex-col items-center'><h2 className='text-green-900'> 4.8</h2><p>Ratings</p></div>
                        <div className='flex flex-col items-center'><h2 className='text-green-900'>3</h2><p>Active</p></div>
                    </section>
                    <section className="weather">
                        <AutoWeather />
                    </section>
                    <hr className='text-gray-300' />
                    <section className=' w-full  dropmenu '>
                        <SupplierDropDown />
                    </section>
                </div>

                <section className="info bg-yellow-50 text-black w-[80%] h-screen overflow-y-auto flex flex-col justify-start  items-center"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {/* add equipments button */}
                    <h1 className='text-black font-bold text-2xl'>Owner Dashboard</h1>
                    <DashboardCentre />

                </section>
            </div>
        </div>
    );
}

export default SupplierDashboard;