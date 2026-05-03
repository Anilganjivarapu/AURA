const express = require("express");

const { getSummaryReport } = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, authorize("admin"), getSummaryReport);

module.exports = router;
