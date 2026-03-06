import Booking from "../models/booking.model.js";

const BOOKING_POPULATE = [
  { path: "product" },
  { path: "farmer", select: "name email image location role" },
  { path: "supplier", select: "name email image location role" },
];

const populateBooking = async (booking) => {
  const bookingId = booking?._id || booking;
  return Booking.findById(bookingId).populate(BOOKING_POPULATE);
};

const toPayload = (booking) => ({
  ...booking.toObject(),
  bookingId: booking.bookingId || booking._id.toString(),
  equipmentId: booking.equipmentId || booking.product,
  renterId: booking.renterId || booking.farmer,
  ownerId: booking.ownerId || booking.supplier,
});

const emitToBookingUsers = (io, booking, event, payload) => {
  io.to((booking.renterId || booking.farmer).toString()).emit(event, payload);
  io.to((booking.ownerId || booking.supplier).toString()).emit(event, payload);

  if (booking.equipmentId || booking.product) {
    io.to(`equipment:${(booking.equipmentId || booking.product).toString()}`).emit(event, payload);
  }
};

export const emitBookingCreated = async (io, booking) => {
  const populated = await populateBooking(booking);
  if (!populated) return;

  const payload = toPayload(populated);
  emitToBookingUsers(io, populated, "bookingCreated", payload);
  emitToBookingUsers(io, populated, "new-booking", payload);
};

export const emitBookingStatusUpdated = async (io, booking) => {
  const populated = await populateBooking(booking);
  if (!populated) return;

  const payload = toPayload(populated);
  emitToBookingUsers(io, populated, "bookingStatusUpdated", payload);
  emitToBookingUsers(io, populated, "booking-updated", payload);

  if (payload.status === "cancelled" || payload.status === "Cancelled") {
    emitToBookingUsers(io, populated, "bookingCancelled", payload);
  }
};
