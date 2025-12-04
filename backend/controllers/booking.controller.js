import Booking from "../models/booking.model.js";
import { Product } from "../models/product.model.js";


export const BookingForm = async (req, res) => {
  try {
    const {
      productId,
      rentalId,
      startDate,
      endDate,
      pickUpLocation,
      returnLocation,
      purpose,
      totalPrice,
      operators
    } = req.body;

    // validate required fields
    if (!startDate || !endDate || !location || !purpose) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // fetch product or rental
    let product = null;
    let rental = null;

    if (productId) product = await Product.findById(productId);
    if (rentalId) rental = await Rental.findById(rentalId);

    if (!product && !rental) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const farmerId = req.user._id; // logged-in farmer

    // extract supplier automatically
    const supplierId = product
      ? product.supplier
      : rental.farmer; // rental posted by farmer

    // Create booking document
    const newBooking = new Booking({
      rental: rentalId || null,
      product: productId || null,
      farmer: farmerId,
      supplier: supplierId,
      startDate,
      endDate,
      location,
      purpose,
      totalPrice,
      operators: operators || false,
      status: "Pending",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking request sent successfully",
      booking: newBooking,
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
};
