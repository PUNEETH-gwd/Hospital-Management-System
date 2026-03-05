const router = require("express").Router();
const Bed = require("../models/Bed");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Add Bed (Admin only)
router.post("/add", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { bedNumber, type } = req.body;

        const bed = await Bed.create({ bedNumber, type });
        res.status(201).json(bed);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// View All Beds
router.get("/all", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const beds = await Bed.find().populate("patient", "name email");
        res.json(beds);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Assign Bed to Patient
router.put("/assign/:id", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { patientId } = req.body;

        const bed = await Bed.findById(req.params.id);

        if (!bed) return res.status(404).json({ message: "Bed not found" });
        if (bed.isOccupied) return res.status(400).json({ message: "Bed already occupied" });

        bed.isOccupied = true;
        bed.patient = patientId;

        await bed.save();

        res.json({ message: "Bed assigned", bed });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Discharge Patient (Free Bed)
router.put("/discharge/:id", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const bed = await Bed.findById(req.params.id);

        if (!bed) return res.status(404).json({ message: "Bed not found" });

        bed.isOccupied = false;
        bed.patient = null;

        await bed.save();

        res.json({ message: "Patient discharged", bed });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;