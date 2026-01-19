import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWheatAwn,
  faClock,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import tractor from "../assets/tractor1.png";
import tractor2 from "../assets/tractor2.png";
import tractor3 from "../assets/tractor3.png";
import tractor4 from "../assets/tractor4.png";
import logo from "../assets/LogoColumn.png";
import Navbar from "./navbar.jsx";
import HamburgerMenu from "./hamburgermenu.jsx";
import { Hamburger, Menu, Star } from "lucide-react";

const HOME = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollToSection = (id) => {
  const section = document.getElementById(id);
  section?.scrollIntoView({ behavior: "smooth" });
};


  return (
    <div className="bg-[#12152D] overflow-x-hidden">
      {/* ================= MOBILE HEADER ================= */}
      <div className="flex items-center justify-between px-6 py-4 lg:hidden">
        <h3 className="flex gap-2 font-bold text-white">
          <Star className="text-yellow-500" />
          AgroRent
        </h3>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className="text-white" />
        </button>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <Navbar className="hidden lg:flex" 
      onNavigate={scrollToSection}
      />

      {/* ================= MOBILE MENU ================= */}
      {isMenuOpen && (
        <HamburgerMenu onClose={() => setIsMenuOpen(false)} onNavigate={scrollToSection} />
      )}


      {/* ================= HERO ================= */}
      <section id="hero" className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Explore <br /> our Farm <br /> Equipments
          </h1>
          <p className="text-white mt-4">
            Welcome to AgroRent, your premier destination for reliable and
            affordable farm equipment rentals.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/farmer-register")}
              className="bg-yellow-400 text-blue-950 font-semibold px-6 py-2 rounded-lg"
            >
              Rent Now
            </button>
            <button
              onClick={() => navigate("/supplier-register")}
              className="border border-yellow-400 text-white px-6 py-2 rounded-lg"
            >
              Join as Supplier
            </button>
          </div>
        </div>

        <img
          src={tractor}
          alt="tractor"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg"
        />
      </section>

      {/* ================= STREAMLINED BOOKING ================= */}
      <section id="about" className="flex flex-col md:flex-row items-center">
        <img
          src={tractor2}
          alt="tractor"
          className="w-full md:w-1/2 lg:w-[35%]"
        />

        <div className="w-full md:w-1/2 bg-[#F9EFE6] p-8 md:p-16 flex flex-col lg:w-full gap-6">
          <h2 className="text-blue-950 text-4xl font-bold">
            Streamlined <br /> Bookings
          </h2>
          <p className="text-black">
            Our intuitive booking system allows you to reserve equipment with
            real-time availability and secure payments.
          </p>
          <button className="bg-[#12152D] text-white px-6 py-2 w-fit rounded-md">
            Explore Rentals
          </button>
        </div>
      </section>

      {/* ================= FLEXIBLE RENTALS ================= */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-white text-4xl font-bold mb-4">
          Flexible Rental Options
        </h2>
        <p className="text-gray-300 mb-10">
          We offer high-performance equipment tailored to your needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1A1E3F] p-6 rounded-xl text-white">
            <FontAwesomeIcon icon={faWheatAwn} className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold">Real-Time Booking</h3>
            <p className="text-gray-300 mt-2">
              Live inventory updates ensure availability.
            </p>
          </div>

          <div className="bg-[#1A1E3F] p-6 rounded-xl text-white">
            <FontAwesomeIcon icon={faClock} className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold">Flexible Rentals</h3>
            <p className="text-gray-300 mt-2">
              Rent by day, week, or month.
            </p>
          </div>

          <div className="bg-[#1A1E3F] p-6 rounded-xl text-white md:col-span-2">
            <FontAwesomeIcon icon={faHandshake} className="text-yellow-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold">Trusted Suppliers</h3>
            <p className="text-gray-300 mt-2">
              Verified suppliers for quality assurance.
            </p>
          </div>
        </div>
      </section>

      {/* ================= RENTING MADE EASY ================= */}
      <section id="rental" className="flex lg:ml-35 flex-col md:flex-row items-center gap-8 px-6 py-16">

        <div className="text-center md:text-left lg:ml-10">
          <h3 className="text-white text-2xl font-bold mb-4">
            Renting Made Easy
          </h3>
          <p className="text-gray-300">
            At AgroRent, we believe that renting farm equipment should be a straightforward and stress-free process. <br />Our user-friendly platform and dedicated customer support team are here to guide you through every step, ensuring a seamless rental experience
          </p>
          <button onClick={() => navigate('/farmer-register ')} className='bg-yellow-400 border-radius:1rem text-blue-950 font-semibold px-4 py-2 mt-5 rounded-lg hover:bg-transparent border hover:text-white hover:border-yellow-400 transition'> Rent Now </button>
        </div>
        <img src={tractor3} alt="tractor" className="w-60 md:w-72" />
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section className="flex flex-col md:flex-row items-center mt-10">

        <img
          src={tractor4}
          alt="tractor"
          className="w-60 md:w-72 lg:w-[15%] lg:ml-10"
        />
        <div className="lg:bg-[#F9EFE6] p-8 md:p-16 w-full flex flex-col items-center gap-5 lg:rounded md:w-1/2 lg:w-full lg:mr-10">
          <h2 className="lg:text-blue-950 text-white text-center text-4xl font-bold mb-4">
            TESTIMONIAL
          </h2>
          <p className='text-gray-300 lg:text-black text-center'>Hear from our satisfied customers about their experience with AgroRent. Our unwavering commitment to quality and customer satisfaction has earned us a reputation as the go-to provider for farm equipment rentals</p>
          <button className="lg:bg-[#12152D] lg:text-yellow-400 bg-yellow-400 text-black  px-6 py-2 rounded-md">
            Inquire Now
          </button>
        </div>


      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="flex flex-col md:flex-row items-center mt-10">
        <div className="bg-[#F9EFE6] p-8 md:p-16 w-full lg:rounded md:w-1/2 lg:w-full lg:ml-10">
          <h2 className="text-blue-950 text-4xl font-bold mb-4">
            Contact Us
          </h2>
          <p className="mb-6 text-blue-900">
            Have a question or need assistance with your rental? Our dedicated customer support team is here to help. Get in touch with us today and let us guide you through the process.
          </p>
          <button className="bg-[#12152D] text-yellow-400 px-6 py-2 rounded-md">
            Inquire Now
          </button>
        </div>

        <img
          src={tractor2}
          alt="tractor"
          className="w-full  lg:w-[25%] lg:mr-10"
        />
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="flex md:flex-row gap-10 px-6 w-full justify-evenly py-16 text-gray-400 text-center md:text-left">
        <img src={logo} alt="logo" className="w-24 mx-auto hidden md:mx-0 md:block lg:block" />

        <div className="flex flex-col sm:flex-row gap-10 justify-center">
          <ul>
            <li className="font-bold">Quick Links</li>
            <li>Home</li>
            <li>Rent</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
          <ul>
            <li className="font-bold">Company</li>
            <li>Careers</li>
            <li>Support</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className="flex flex-col sm:flex-row gap-10 justify-center">
          <ul>
            <li className="font-bold">Quick Links</li>
            <li>Home</li>
            <li>Rent</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
          <ul>

            <li className="font-bold">Company</li>
            <li>Careers</li>
            <li>Support</li>
            <li>FAQs</li>

          </ul>
        </div>
      </footer>
    </div>
  );
};

export default HOME;
