const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const User = require("../models/User");
const {
  demoCourses,
  demoEnrollments,
  demoPayments,
  demoUsers,
} = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");

const getSummaryReport = async (req, res) => {
  let users = demoUsers;
  let courses = demoCourses;
  let enrollments = demoEnrollments;
  let payments = demoPayments;

  if (isDatabaseReady()) {
    users = await User.find().select("-password");
    courses = await Course.find();
    enrollments = await Enrollment.find();
    payments = await Payment.find();
  }

  const paidPayments = payments.filter((entry) => entry.status === "paid");
  const revenue = paidPayments.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  return res.json({
    success: true,
    report: {
      generatedAt: new Date().toISOString(),
      generatedFor: req.user.name,
      role: req.user.role,
      summary: {
        users: users.length,
        courses: courses.length,
        enrollments: enrollments.length,
        revenue,
      },
      highlights: [
        "Premium role-based access is active.",
        "MongoDB Atlas-ready schemas are included for all requested collections.",
        "Payments and AI chatbot support live providers or demo mode fallbacks.",
      ],
      rows: courses.map((course) => ({
        course: course.title,
        status: course.status,
        price: course.price,
        enrolledCount: course.enrolledCount || 0,
        duration: course.duration || "",
      })),
    },
  });
};

module.exports = { getSummaryReport };
