import Booking from "../models/booking.model.js";

export const addBooking = async (req, res) => {
  try {
    const productId = req.params.id;

    const {
      farmer,
      supplier,
      startDate,
      endDate,
      pickUpLocation,
      returnLocation,
      purpose,
      operators,
      deliveryAndPickup,
      totalPrice
    } = req.body;

    const booking = new Booking({
      product: productId,
      farmer,
      supplier,
      startDate,
      endDate,
      pickUpLocation,
      returnLocation,
      purpose,
      operators,
      deliveryAndPickup,
      totalPrice,
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
