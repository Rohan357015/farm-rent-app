import React from 'react'

function Equipmentsforms() {
  return (
    <>
    
    <div className="w-full mx-auto  bg-yellow-50 ">

      {/* ===== TOP HEADER ===== */}
      <div className="bg-gradient-to-b from-green-700 to-green-600 text-white p-10  shadow">
        <h1 className="text-4xl font-bold text-center">List Your Equipment</h1>
        <p className="text-center text-lg mt-2">
          Fill in the details to list your farm equipment on AgroRent
        </p>
      </div>


      {/* ===== MAIN FORM CARD ===== */}
      <div className="bg-white   w-[80%] mx-auto  rounded-xl mt-10 shadow p-10 space-y-14">

        {/* ================================
            1. BASIC INFORMATION
        ================================= */}
        <section className='text-black'>
          <h2 className="text-2xl font-semibold text-green-700">1. Basic Information</h2>
          <hr className="border-yellow-500 my-2" />

          <div className="grid grid-cols-2 gap-8 mt-6">

            <div>
              <label className=" text-green-600 font-semibold">Equipment Name *</label>
              <input className="w-full bg-gray-50 p-3 rounded border" placeholder="e.g., John Deere Tractor" />
            </div>

            <div>
              <label className=" text-green-600 font-semibold">Category *</label>
              <select className="w-full bg-gray-100 p-3 rounded border">
                <option>Select category</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Brand *</label>
              <input className="w-full bg-gray-100 p-3 rounded border" placeholder="John Deere" />
            </div>

            <div>
              <label className="font-medium">Model *</label>
              <input className="w-full bg-gray-100 p-3 rounded border" placeholder="5310" />
            </div>

            <div>
              <label className="font-medium">Year of Manufacturing *</label>
              <select className="w-full bg-gray-100 p-3 rounded border">
                <option>Select Year</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Condition *</label>
              <div className="flex gap-4 mt-3">
                <label><input type="radio" name="cond" /> Excellent</label>
                <label><input type="radio" name="cond" /> Good</label>
                <label><input type="radio" name="cond" /> Fair</label>
              </div>
            </div>

          </div>

          <div className="mt-6">
            <label className="font-medium">Description *</label>
            <textarea className="w-full bg-gray-100 p-3 rounded border" rows="4"
              placeholder="Describe your equipment in detail..."></textarea>
          </div>
        </section>



        {/* ================================
            2. EQUIPMENT IMAGES
        ================================= */}
        <section>
          <h2 className="text-2xl font-semibold text-green-700">2. Equipment Images</h2>
          <hr className="border-yellow-500 my-2" />

          <div className="mt-4 border-2 border-dashed border-yellow-500 p-8 text-center rounded-xl">
            <p className="text-gray-600">Upload 3–5 clear images</p>
          </div>
        </section>



        {/* ================================
            3. SPECIFICATIONS & FEATURES
        ================================= */}
        <section className='text-black'>
          <h2 className="text-2xl font-semibold text-green-700">3. Specifications & Features</h2>
          <hr className="border-yellow-500 my-2" />

          <div className="grid grid-cols-2 gap-8 mt-6">
            <input className="bg-gray-100 p-3 rounded border" placeholder="Horsepower (HP)" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="Operating Hours" />
          </div>

          <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
              <p className="font-medium mb-2">Features</p>
              <div className="grid grid-cols-2 gap-3">
                <label><input type="checkbox" /> GPS</label>
                <label><input type="checkbox" /> Automatic</label>
                <label><input type="checkbox" /> 4WD</label>
                <label><input type="checkbox" /> Power Steering</label>
              </div>
            </div>

            <input className="bg-gray-100 p-3 rounded border" placeholder="Additional Notes" />
          </div>
        </section>



        {/* ================================
            4. PRICING
        ================================= */}
        <section className='text-black'>
          <h2 className="text-2xl font-semibold text-green-700">4. Pricing</h2>
          <hr className="border-yellow-500 my-2" />

          <div className="grid grid-cols-2 gap-8 mt-6">
            <input className="bg-gray-100 p-3 rounded border" placeholder="Daily Rate (₹)" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="Weekly Rate (₹)" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="Monthly Rate (₹)" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="Security Deposit (₹)" />
          </div>
        </section>



        {/* ================================
            5. LOCATION & AVAILABILITY
        ================================= */}
        <section className='text-black'>
          <h2 className="text-2xl font-semibold text-green-700">5. Availability & Location</h2>
          <hr className="border-yellow-500 my-2" />

          <label className="flex items-center gap-3 mt-4">
            <input type="checkbox" /> Available for Rent
          </label>

          <div className="grid grid-cols-2 gap-8 mt-6">
            <input className="bg-gray-100 p-3 rounded border" placeholder="City" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="State" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="Pincode" />
            <input className="bg-gray-100 p-3 rounded border" placeholder="Delivery Radius (km)" />
          </div>
        </section>



        {/* ================================
            6. TERMS & SUBMIT
        ================================= */}
        <section className='text-black'>
          <h2 className="text-2xl font-semibold text-green-700">6. Terms & Conditions</h2>
          <hr className="border-yellow-500 my-2" />

          <label className="flex items-center gap-3 mt-4">
            <input type="checkbox" /> I agree to the Terms & Conditions
          </label>
        </section>


        {/* SUBMIT BUTTON */}
        <div className="text-center pt-5">
          <button className="bg-green-600 text-white px-10 py-3 rounded-xl text-lg font-semibold hover:bg-green-700">
            Submit Equipment
          </button>
        </div>

      </div>
    </div>
  

    </>
    )
    }

    export default Equipmentsforms
