import React from 'react';
import FarmerNavabar from './navBar2.jsx';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tractor, Star, Activity } from "lucide-react";
import AutoWeather from '../../components/weatherApp.jsx';
import MainDropDown from '../dashboard/MainDropDown.jsx';
import { useAuthStore } from '../../store/authstore.js';
import { useEffect ,useState} from 'react';
import EquipmentBrowser from './featured.jsx';
import { useProductStore } from '../../store/product.store.js';
import { useBookingStore } from '../../store/booking.store.js';


const FarmerDashboard = () => {
      const { getFarmerBookings } = useBookingStore();
    const { user, getFarmerDashboard } = useAuthStore();
    useEffect(() => {
    getFarmerDashboard();
  }, []);
     const [bookings, setBookings] = useState([]);
     const [loading ,setLoading] = useState(false);

     useEffect(() => {
             const loadBookings = async () => {
                 try {
                     const data = await getFarmerBookings();
                     setBookings(data || []);
                 } catch (error) {
                     console.error("Error loading bookings:", error);
                 } finally {
                     setLoading(false);
                 }
             };
             loadBookings();
         }, []);

        const activerentals = bookings?.filter(
  b => b.status === "Approved"
).length || 0;



  const avgRating = user && user.ratings && user.ratings.length > 0
    ? (user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length).toFixed(1)
    : "-";

    return (
        <div className="min-h-screen bg-[#12152D] text-white ">
            <FarmerNavabar />
            <div  className='flex justify-between items-start'>
              <div className='profile  w-[20%] h-screen overflow-y-auto flex flex-col gap-8 bg-white text-black'
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <section className="profile-info flex items-center flex-col">
                    <div className="rounded-full bg-green-600 w-24 h-24  mt-10 flex flex-col items-center justify-center">
                       <img src={user?.image} alt="" className=' rounded-full'/>
                     
                    </div>
                    <h3 className='font-semibold text-[1rem] '>{user?.name}</h3>
                    <p className="text-gray-400">{user?.location}</p>
                </section>
                <section className='flex items-center justify-around text-lg font-serif'>
                    <div className='flex flex-col items-center'><h2 className='text-green-900'>{bookings.length} </h2><p>Rentals</p></div>
                    <div className='flex flex-col items-center'><h2 className='text-green-900'> {avgRating} </h2><p>Ratings</p></div>
                    <div className='flex flex-col items-center'><h2 className='text-green-900'>{activerentals}</h2><p>Active</p></div>
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