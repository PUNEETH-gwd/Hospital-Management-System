const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema({
    bedNumber: {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ["ICU", "General"],
        required: true
    },
    isOccupied: {
        type: Boolean,
        default: false
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
});

module.exports = mongoose.model("Bed", bedSchema);