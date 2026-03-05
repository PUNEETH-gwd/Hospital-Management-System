const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ✅ ADD THIS LINE (IMPORT MIDDLEWARE)
const { verifyToken } = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("DB Error:", err));

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/beds", require("./routes/bedRoutes"));
app.use("/api/blood", require("./routes/bloodRoutes"));

// ✅ ADD PROTECTED ROUTE HERE
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
        message: "You accessed protected route",
        user: req.user
    });
});

// Test Route
app.get("/", (req, res) => {
    res.send("Hospital Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});