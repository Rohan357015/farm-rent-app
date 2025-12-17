import Booking from "../models/booking.model.js";
import {Product} from "../models/product.model.js";



/// place booking
export const addBooking = async (req, res) => {
  try {
    const productId = req.params.id;

    // 🔐 Farmer ID token se aani chahiye
    const farmerId = req.user.id;

    // ✅ Step 1: Product nikalo
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Step 2: Supplier product se nikalo
    const supplierId = product.supplier;

    // ✅ Step 3: Booking create karo
    const booking = new Booking({
      product: productId,
      farmer: farmerId,
      supplier: supplierId,   // 🔥 correct linking
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      pickUpLocation: req.body.pickUpLocation,
      returnLocation: req.body.returnLocation,
      purpose: req.body.purpose,
      operators: req.body.operators,
      deliveryAndPickup: req.body.deliveryAndPickup,
      totalPrice: req.body.totalPrice,
    });

    await booking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};


//get all bookings
export const getFarmerBookings = async (req, res) => {
  try {
    const farmerId = req.user.id;
    if(!farmerId){
      return res.status(400).json({message: "Invalid Farmer ID"});
    }
    const bookings = await Booking.find({ farmer: farmerId })
      .populate("product")
      .populate("supplier", "name email phone location");
    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get Farmer Bookings Error:", error);
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

//cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params; // ✅ FIX

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

