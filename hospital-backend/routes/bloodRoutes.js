const router = require("express").Router();
const BloodStock = require("../models/BloodStock");
const BloodRequest = require("../models/BloodRequest");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");

// Admin: Add or Update Blood Stock
router.post("/stock", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const { bloodGroup, units } = req.body;

        let stock = await BloodStock.findOne({ bloodGroup });

        if (stock) {
            stock.unitsAvailable += units;
        } else {
            stock = new BloodStock({ bloodGroup, unitsAvailable: units });
        }

        await stock.save();
        res.json(stock);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Doctor: Request Blood
router.post("/request", verifyToken, checkRole("doctor"), async (req, res) => {
    try {
        const { patientId, bloodGroup, unitsRequired, emergency } = req.body;

        const stock = await BloodStock.findOne({ bloodGroup });

        let status = "insufficient stock";

        if (stock && stock.unitsAvailable >= unitsRequired) {
            stock.unitsAvailable -= unitsRequired;
            await stock.save();
            status = "approved";
        }

        const request = await BloodRequest.create({
            patient: patientId,
            doctor: req.user.id,
            bloodGroup,
            unitsRequired,
            emergency,
            status
        });

        res.json(request);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Doctor: View My Blood Requests
router.get("/my", verifyToken, checkRole("doctor"), async (req, res) => {
  try {
    const requests = await BloodRequest.find({ doctor: req.user.id })
      .populate("patient", "name email")
      

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin Blood Dashboard
router.get("/dashboard", verifyToken, checkRole("admin"), async (req, res) => {
    try {
        const totalBloodGroups = await BloodStock.countDocuments();

        const stocks = await BloodStock.find();

        const totalUnitsAvailable = stocks.reduce((sum, item) => sum + item.unitsAvailable, 0);

        const lowStockGroups = stocks.filter(item => item.unitsAvailable < 2);

        const totalRequests = await BloodRequest.countDocuments();
        const emergencyRequests = await BloodRequest.countDocuments({ emergency: true });
        const approvedRequests = await BloodRequest.countDocuments({ status: "approved" });
        const insufficientRequests = await BloodRequest.countDocuments({ status: "insufficient stock" });

        res.json({
            totalBloodGroups,
            totalUnitsAvailable,
            lowStockGroups,
            totalRequests,
            emergencyRequests,
            approvedRequests,
            insufficientRequests
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all doctors
router.get("/doctors", async (req, res) => {
  try {

    const doctors = await User.find({ role: "doctor" })
      .select("name email");

    res.json(doctors);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;