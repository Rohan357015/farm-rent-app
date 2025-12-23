import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTractor, faWheatAwn, faClock, faHandshake } from '@fortawesome/free-solid-svg-icons'
import tractor from '../assets/tractor1.png'
import tractor2 from '../assets/tractor2.png'
import tractor3 from '../assets/tractor3.png'
import tractor4 from '../assets/tractor4.png'
import logo from '../assets/LogoColumn.png'
import { useNavigate } from 'react-router-dom'
import Navbar from './navbar.jsx'


const HOME = () => {
  const position={
    position: 'relative',
    right : '-70%',
    top : '-30rem',
  }
  const navigate = useNavigate();
  return (
    <div className='bg-[#12152D]'>
      <Navbar />
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
            <button onClick={()=>navigate('/farmer-register')} className='bg-yellow-400 text-blue-950 font-semibold px-4 py-2 rounded-lg hover:bg-transparent border hover:text-white hover:border-yellow-400 transition'>
              Rent Now
            </button>
            <button onClick={()=>navigate('/supplier-register')} className='bg-transparent text-white border border-yellow-400 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-500 transition'>
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
          <p className='text-black'>
            Our intuitive booking system allows you to reserve the equipment you need with just a few clicks.
            Enjoy real-time availability updates and secure payment options, ensuring a hassle-free rental experience.
          </p>
          <p className='text-black' >
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-10 w-[80%]'>
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
            <h3 className='text-2xl font-semibold mb-2'>Flexible Rentals</h3>
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

      <section className='flex gap-20 item-center gap-8 py-16 px-8 mt-[10%] ml-[10%]'>
        <div className=''>
          <img src={tractor3} alt="Description of tractor3" height={300} width={300} />
        </div>
        <div className='ml-[10%] mt[10%] w-[50%] flex flex-col gap-8 pt-[10%]'>
          <h3 className='text-white text-[26px] font-mono'>Renting Made Easy</h3>
          <p className='text-white'>At AgroRent, we believe that renting farm equipment should be a straightforward and stress-free process. Our user-friendly platform and dedicated customer support team are here to guide you through every step, ensuring a seamless rental experience</p>
          <div className='flex gap-10'>
          <button  onClick={()=>navigate('/farmer-register ')} className='bg-yellow-400 border-radius:1rem text-blue-950 font-semibold px-4 py-2 rounded-lg hover:bg-transparent border hover:text-white hover:border-yellow-400 transition'>
              Rent Now
            </button>
            
            </div>
        </div>
      </section>
      <section className='mt-20'>
        <div>
        <div className="w-full py-16 bg-[#FAF0E6]">
          <div className='w-[40%] pl-35'>
          <h2 className='text-blue-950 text-2xl font-bold'>Testimonals</h2>
          <p className='text-black'>Hear from our satisfied customers about their experience with AgroRent. Our unwavering commitment to quality and customer satisfaction has earned us a reputation as the go-to provider for farm equipment rentals</p>
          </div>
        </div>
        <div className='w-[50%] pl-30 mt-3.5'>
          <p className='text-gray-400'>"AgroRent has been a game-changer for our farm. The wide selection of high-quality equipment and reliable booking system have made our operations more efficient and cost-effective. We highly recommend their services to any farmer looking to streamline their equipment needs</p>
        </div>
        </div>
        <div className='z-30 'style={position} >
          <img src={tractor4} alt="" />
        </div>
       
      </section>
       {/* last section */}
        <section className='w-full h-full bg-[#12152D] flex gap-[-10%] items-center mt-[-20%]'>
       
        <div className='w-[70%] bg-[#F9EFE6] flex flex-col gap-6 p-16 '>
          <h1 className='text-blue-950 text-[46px] font-mono'>Contact Us</h1>
          <p  className='text-black'>
            Have a question or need assistance with your rental? Our dedicated customer support team is here to help. Get in touch with us today and let us guide you through the process.
          </p>
         

          <button className='bg-[#12153D] text-yellow-500 w-fit px-6 py-2 rounded-md hover:bg-yellow-500 transition'>
            inquire Now
          </button>
        </div>
         <div className='w-[40%]'>
          <img src={tractor2} alt="Tractor2" height={800} width={1000} className='pr-[15%]' />
        </div>
       
      </section>
       <div className='flex  flex-col gap-8 justify-center items-center'>
          <h1 className='text-white text-5xl mt-[5%] font-mono'>Join   Our   Community</h1>
          <div className='w-[50%]'>
          <p className=' text-gray-400'>Become a supplier with AgroRent and unlock new opportunities  to showcase your farm equipment to a growing network of farmers. Join our community and start earning today</p>
          </div>
          <button className='bg-yellow-500 text- rounded-2xl px-10 py-2 rounded-md hover:bg-yellow-400 transition'>Sign Up</button>
        </div>

        <footer className='flex justify-around mt-[10%] text-gray-400 pb-19'>
          <div className='mr-[10%]'>
            <img src={logo} alt="Logo" height={200} width={100} className='mt-[5%] ml-[45%]' />
          </div>
          <div className='flex justify-between gap-70'>
            <div>
              <ul>
                <li>quick links</li>
                <li>Home</li>
                <li>Rent</li>
                <li>About</li>
                <li>contact</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>quick links</li>
                <li>Home</li>
                <li>Rent</li>
                <li>About</li>
                <li>contact</li>
              </ul>
            </div>
            <div>
              <ul>
                <li>quick links</li>
                <li>Home</li>
                <li>Rent</li>
                <li>About</li>
                <li>contact</li>
              </ul>
            </div>
          </div>
        </footer>

    </div>
  )
}

export default HOME
