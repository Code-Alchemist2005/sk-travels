const Booking = require("../models/Booking");

// CREATE
exports.createBooking = async (req, res) => {
  const { customerName, seats, travelDate, source, destination } = req.body;

  // Basic validation
  if (!customerName || seats <= 0 || !travelDate || !source || !destination) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // Validate travelDate
  const dateObj = new Date(travelDate);
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({ message: "Invalid travel date" });
  }

  const totalPrice = seats * 500;

  const booking = new Booking({
    customerName,
    seats,
    travelDate: dateObj,
    source,
    destination,
    totalPrice
  });

  await booking.save();
  res.json(booking);
};

// READ
exports.getBookings = async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
};

// UPDATE
exports.updateBooking = async (req, res) => {
  const updates = { ...req.body };

  // If travelDate provided, validate and convert
  if (updates.travelDate) {
    const d = new Date(updates.travelDate);
    if (isNaN(d.getTime())) {
      return res.status(400).json({ message: "Invalid travel date" });
    }
    updates.travelDate = d;
  }

  // If seats changed, recalculate price
  if (updates.seats) {
    if (updates.seats <= 0) {
      return res.status(400).json({ message: "Seats must be greater than 0" });
    }
    updates.totalPrice = updates.seats * 500;
  }

  // Validate source/destination if provided
  if (updates.source !== undefined && String(updates.source).trim() === '') {
    return res.status(400).json({ message: "Invalid source" });
  }
  if (updates.destination !== undefined && String(updates.destination).trim() === '') {
    return res.status(400).json({ message: "Invalid destination" });
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );
  res.json(booking);
};

// DELETE
exports.deleteBooking = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  res.json({ message: "Booking Deleted" });
};
