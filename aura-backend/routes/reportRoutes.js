const express = require("express");

const { getSummaryReport } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, getSummaryReport);

module.exports = router;
