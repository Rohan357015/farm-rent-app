import Booking from "../models/booking.model.js";

export const BLOCKING_STATUSES = [
  "pending",
  "accepted",
  "confirmed",
  "in_use",
  "Pending",
  "Approved",
];

export const overlapsRange = (startDate, endDate) => ({
  startDate: { $lte: endDate },
  endDate: { $gte: startDate },
});

export const findConflictingBooking = async ({ equipmentId, startDate, endDate }) => {
  return Booking.findOne({
    equipmentId,
    status: { $in: BLOCKING_STATUSES },
    ...overlapsRange(startDate, endDate),
  }).sort({ endDate: 1 });
};

export const findNextAvailableDate = async ({ equipmentId, fromDate }) => {
  const activeBookings = await Booking.find({
    equipmentId,
    status: { $in: BLOCKING_STATUSES },
    endDate: { $gte: fromDate },
  }).sort({ endDate: 1 });

  if (!activeBookings.length) return null;

  const lastEndDate = activeBookings[activeBookings.length - 1].endDate;
  const nextDate = new Date(lastEndDate);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};
