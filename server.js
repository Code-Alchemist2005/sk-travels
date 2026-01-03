const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // ✅ THIS IS THE FIX
app.use(express.static("public"));

// DB
connectDB();

// Routes
app.use("/api", require("./routes/bookingRoutes"));

// Test route (optional but useful)
app.get("/", (req, res) => {
  res.send("SK Travels Server Running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
