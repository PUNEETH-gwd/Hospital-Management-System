const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    unitsRequired: {
        type: Number,
        required: true
    },
    emergency: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["approved", "insufficient stock"],
        default: "insufficient stock"
    },
    requestedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);