const express = require("express");

const { listMaterials, createMaterial } = require("../controllers/materialController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listMaterials);
router.post("/", protect, authorize("admin", "staff"), createMaterial);

module.exports = router;
