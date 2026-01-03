const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
