const mongoose = require("mongoose");

const bloodStockSchema = new mongoose.Schema({
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
        required: true,
        unique: true
    },
    unitsAvailable: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("BloodStock", bloodStockSchema);