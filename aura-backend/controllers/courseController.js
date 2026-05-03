const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const {
  demoCourses,
  demoEnrollments,
  generateId,
} = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");

const listCourses = async (req, res) => {
  if (isDatabaseReady()) {
    const courses = await Course.find().sort({ createdAt: -1 });
    return res.json({ success: true, courses });
  }

  return res.json({ success: true, courses: demoCourses });
};

const createCourse = async (req, res) => {
  const { title, description, price, image, duration, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: "Title and description are required" });
  }

  if (isDatabaseReady()) {
    const course = await Course.create({
      title,
      description,
      price,
      image,
      duration,
      status,
    });

    return res.status(201).json({ success: true, course });
  }

  const course = {
    id: generateId("course"),
    title,
    description,
    price: Number(price || 0),
    image: image || "",
    duration: duration || "8 weeks",
    status: status || "published",
    enrolledCount: 0,
  };

  demoCourses.unshift(course);

  return res.status(201).json({ success: true, course });
};

const enrollInCourse = async (req, res) => {
  const { courseId } = req.params;

  if (isDatabaseReady()) {
    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });

    if (existing) {
      return res.status(409).json({ success: false, message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId,
      paymentStatus: "pending",
    });

    return res.status(201).json({ success: true, enrollment });
  }

  const existing = demoEnrollments.find(
    (entry) => entry.userId === String(req.user._id || req.user.id) && entry.courseId === courseId
  );

  if (existing) {
    return res.status(409).json({ success: false, message: "Already enrolled in this course" });
  }

  const enrollment = {
    id: generateId("enroll"),
    userId: String(req.user._id || req.user.id),
    courseId,
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  demoEnrollments.push(enrollment);

  return res.status(201).json({ success: true, enrollment });
};

module.exports = { listCourses, createCourse, enrollInCourse };
