const express = require("express");

const { createEnquiry, listEnquiries } = require("../controllers/enquiryController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", protect, authorize("admin"), listEnquiries);

module.exports = router;
