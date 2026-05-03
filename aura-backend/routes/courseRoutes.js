const express = require("express");

const { listCourses, createCourse, enrollInCourse } = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", listCourses);
router.post("/", protect, authorize("admin", "staff"), createCourse);
router.post("/:courseId/enroll", protect, authorize("student"), enrollInCourse);

module.exports = router;
