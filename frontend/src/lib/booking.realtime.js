export const registerBookingSocketListeners = (socket, handlers) => {
  socket.off("new-booking");
  socket.off("booking-updated");
  socket.off("bookingCreated");
  socket.off("bookingStatusUpdated");
  socket.off("bookingCancelled");

  socket.on("new-booking", handlers.onNewBooking);
  socket.on("bookingCreated", handlers.onNewBooking);

  socket.on("booking-updated", handlers.onBookingUpdated);
  socket.on("bookingStatusUpdated", handlers.onBookingUpdated);
  socket.on("bookingCancelled", handlers.onBookingUpdated);
};

export const removeBookingSocketListeners = (socket) => {
  socket.off("new-booking");
  socket.off("booking-updated");
  socket.off("bookingCreated");
  socket.off("bookingStatusUpdated");
  socket.off("bookingCancelled");
};

export const joinEquipmentRoom = (socket, equipmentId) => {
  if (!equipmentId) return;
  socket.emit("joinEquipmentRoom", equipmentId);
};

export const leaveEquipmentRoom = (socket, equipmentId) => {
  if (!equipmentId) return;
  socket.emit("leaveEquipmentRoom", equipmentId);
};
