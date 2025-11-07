import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTractor, faWheatAwn, faClock, faHandshake } from '@fortawesome/free-solid-svg-icons'
import tractor from '../assets/tractor1.png'
import tractor2 from '../assets/tractor2.png'

const HOME = () => {
  return (
    <div className='bg-[#12152D]'>
      {/* Navbar */}
      <nav className='w-full h-[70px] bg-[#151933] flex justify-between items-center px-8'>
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faStar} className='text-yellow-400 text-[24px]' />
          <p className='text-white text-[24px] font-semibold'>AgroRent</p>
        </div>

        <ul className='flex items-center gap-8 text-white text-[18px]'>
          <li className='hover:text-yellow-400 cursor-pointer'>Home</li>
          <li className='hover:text-yellow-400 cursor-pointer'>About</li>
          <li className='hover:text-yellow-400 cursor-pointer'>Rentals</li>
          <li className='hover:text-yellow-400 cursor-pointer'>Contact</li>
          <li>
            <button className='bg-yellow-400 text-blue-950 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition'>
              Join
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className='h-screen w-full bg-[#12152D] flex justify-around items-center px-16'>
        <div className='w-[40%]'>
          <h1 className='text-white text-[46px] font-bold'>
            Explore <br /> our Farm <br /> Equipments ....
          </h1>
          <p className='text-white text-[18px] mt-2'>
            Welcome to AgroRent, your premier destination <br /> for reliable and affordable farm equipment rentals
          </p>
          <div className='mt-6 flex gap-4'>
            <button className='bg-yellow-400 text-blue-950 font-semibold px-4 py-2 rounded-lg hover:bg-transparent border hover:text-white hover:border-yellow-400 transition'>
              Rent Now
            </button>
            <button className='bg-transparent text-white border border-yellow-400 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition'>
              Join as Supplier
            </button>
          </div>
        </div>

        <div>
          <img src={tractor} alt="Tractor" height={700} width={600} />
        </div>
      </section>

      {/* Streamlined Booking Section */}
      <section className='w-full h-full bg-[#12152D] flex items-center'>
        <div className='w-[50%]'>
          <img src={tractor2} alt="Tractor2" height={900} width={1200} className='pl-[15%]' />
        </div>
        <div className='w-[50%] bg-[#F9EFE6] flex flex-col gap-6 p-16'>
          <h1 className='text-blue-950 text-[46px]'>Streamlined <br /> Bookings....</h1>
          <p>
            Our intuitive booking system allows you to reserve the equipment you need with just a few clicks.
            Enjoy real-time availability updates and secure payment options, ensuring a hassle-free rental experience.
          </p>
          <p>
            Experience the future of farm equipment rentals with AgroRent. Sign up today and take the first step
            towards effortless farming!
          </p>

          <button className='bg-[#12153D] text-white w-fit px-6 py-2 rounded-md hover:bg-yellow-500 transition'>
            Explore Rentals
          </button>
        </div>
      </section>

      {/* Flexible Rental Options Section */}
      <section className='w-full bg-[#12152D] flex flex-col items-center mt-[10%] px-8 py-16'>
        <h1 className='text-white font-mono text-5xl text-center mb-6'>Flexible Rental Options</h1>
        <p className='text-white text-center mb-10 max-w-3xl'>
          At AgroRent, we understand the unique needs of farmers. That's why we offer a diverse selection of
          high-performance farm equipment for rent, tailored to your specific requirements.
        </p>

        {/* Feature Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-[80%]'>
          {/* Card 1 */}
          <div className='bg-[#1A1E3F] rounded-2xl p-6 text-white text-center hover:scale-105 transition'>
            <FontAwesomeIcon icon={faWheatAwn} className='text-yellow-400 text-[36px] mb-4' />
            <h3 className='text-2xl font-semibold mb-2'>Real-Time Booking</h3>
            <p className='text-gray-300'>
              Never worry about equipment availability again. Our platform provides real-time updates on rental inventory.
            </p>
          </div>

          {/* Card 2 */}
          <div className='bg-[#1A1E3F] rounded-2xl p-6 text-white text-center hover:scale-105 transition'>
            <FontAwesomeIcon icon={faClock} className='text-yellow-400 text-[36px] mb-4' />
            <h3 className='text-2xl font-semibold mb-2'>Flexible Durations</h3>
            <p className='text-gray-300'>
              Rent by the day, week, or month — we adapt to your farming schedule and workload.
            </p>
          </div>

          {/* Card 3 */}
          <div className='bg-[#1A1E3F] rounded-2xl p-6 text-white text-center hover:scale-105 transition'>
            <FontAwesomeIcon icon={faHandshake} className='text-yellow-400 text-[36px] mb-4' />
            <h3 className='text-2xl font-semibold mb-2'>Trusted Suppliers</h3>
            <p className='text-gray-300'>
              Partner with verified suppliers ensuring reliable, top-quality equipment every time.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HOME
