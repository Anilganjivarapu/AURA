const express = require("express");

const {
  getAdminSummary,
  listUsers,
  updateUser,
  deleteUser,
  getSiteContent,
  updateSiteContent,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, authorize("admin"), getAdminSummary);
router.get("/users", protect, authorize("admin"), listUsers);
router.patch("/users/:id", protect, authorize("admin"), updateUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);
router.get("/site-content", getSiteContent);
router.put("/site-content", protect, authorize("admin"), updateSiteContent);

module.exports = router;
