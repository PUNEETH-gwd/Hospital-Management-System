const router = require("express").Router();
const Appointment = require("../models/Appointment");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Book Appointment (Patient Only)
router.post("/book", verifyToken, checkRole("patient"), async (req, res) => {
    try {
        const { doctorId, date } = req.body;

        const appointment = await Appointment.create({
            patient: req.user.id,
            doctor: doctorId,
            date
        });

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View All Appointments (Admin Only)
router.get("/all", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "name email")
            .populate("doctor", "name email");

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


// Doctor: View My Appointments
router.get("/my", verifyToken, async (req, res) => {
    try {
        let appointments;

        if (req.user.role === "doctor") {
            appointments = await Appointment.find({ doctor: req.user.id })
                .populate("patient", "name email")
                .populate("doctor", "name email");
        }

        if (req.user.role === "patient") {
            appointments = await Appointment.find({ patient: req.user.id })
                .populate("doctor", "name email")
                .populate("patient", "name email");
        }

        res.json(appointments);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



// Doctor: Update Appointment Status
router.put("/update/:id", verifyToken, checkRole("doctor"), async (req, res) => {
    try {
        const { status } = req.body;

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        // Ensure doctor can only update his own appointments
        if (appointment.doctor.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        appointment.status = status;
        await appointment.save();

        res.json({ message: "Appointment updated", appointment });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Dashboard Stats
router.get("/admin/stats", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const totalUsers = await require("../models/User").countDocuments();
        const totalDoctors = await require("../models/User").countDocuments({ role: "doctor" });
        const totalPatients = await require("../models/User").countDocuments({ role: "patient" });

        const totalAppointments = await Appointment.countDocuments();
        const approvedAppointments = await Appointment.countDocuments({ status: "approved" });
        const pendingAppointments = await Appointment.countDocuments({ status: "pending" });

        res.json({
            totalUsers,
            totalDoctors,
            totalPatients,
            totalAppointments,
            approvedAppointments,
            pendingAppointments
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});