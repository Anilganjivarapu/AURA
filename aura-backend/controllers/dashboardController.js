const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Material = require("../models/Material");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Notification = require("../models/Notification");

const {
  demoCourses,
  demoEnrollments,
  demoMaterials,
  demoNotifications,
  demoPayments,
  demoUsers,
} = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");

const getDashboardOverview = async (req, res) => {
  const currentUserId = String(req.user._id || req.user.id);
  const role = req.user.role;

  let courses = demoCourses;
  let enrollments = demoEnrollments;
  let materials = demoMaterials;
  let notifications = demoNotifications.filter((item) => item.userId === currentUserId);
  let payments = demoPayments;
  let users = demoUsers;

  if (isDatabaseReady()) {
    const dbUsers = await User.find().select("-password");
    const dbCourses = await Course.find();
    const dbEnrollments = await Enrollment.find();
    const dbMaterials = await Material.find();
    const dbPayments = await Payment.find();
    const dbNotifications = await Notification.find({ user: req.user._id });

    users = dbUsers;
    courses = dbCourses;
    enrollments = dbEnrollments;
    materials = dbMaterials;
    payments = dbPayments;
    notifications = dbNotifications;
  }

  const revenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const studentEnrollments = enrollments.filter(
    (entry) => String(entry.userId || entry.user) === currentUserId
  );

  const responseByRole = {
    admin: {
      hero: {
        title: "Admin command center",
        subtitle: "Control users, courses, payments, and platform performance from one place.",
      },
      metrics: [
        { label: "Active users", value: users.length },
        { label: "Published courses", value: courses.filter((course) => course.status === "published").length },
        { label: "Revenue", value: `Rs ${revenue.toLocaleString("en-IN")}` },
        { label: "Materials", value: materials.length },
      ],
      quickActions: ["Create course", "Review payments", "Broadcast alert", "Export reports"],
    },
    student: {
      hero: {
        title: "Student growth dashboard",
        subtitle: "Track progress, continue courses, and reach the next milestone faster.",
      },
      metrics: [
        { label: "Enrolled courses", value: studentEnrollments.length },
        {
          label: "Average progress",
          value: `${Math.round(
            (studentEnrollments.filter((item) => item.paymentStatus === "paid").length /
              (studentEnrollments.length || 1)) *
              100
          )}%`,
        },
        { label: "Paid enrollments", value: studentEnrollments.filter((item) => item.paymentStatus === "paid").length },
        { label: "Unread alerts", value: notifications.filter((item) => !item.isRead).length },
      ],
      quickActions: ["Resume learning", "Ask AI mentor", "Download report", "Complete payment"],
    },
    staff: {
      hero: {
        title: "Staff delivery hub",
        subtitle: "Monitor engagement, publish resources, and support learners at scale.",
      },
      metrics: [
        { label: "Learners supported", value: enrollments.length },
        { label: "Live materials", value: materials.length },
        { label: "Courses assigned", value: courses.filter((course) => course.status !== "archived").length },
        { label: "Open announcements", value: notifications.length },
      ],
      quickActions: ["Upload material", "Review progress", "Launch webinar", "Share feedback"],
    },
  };

  return res.json({
    success: true,
    overview: responseByRole[role] || responseByRole.student,
    courses,
    enrollments: role === "student" ? studentEnrollments : enrollments,
    materials,
    notifications,
    payments: role === "student" ? payments.filter((entry) => String(entry.userId || entry.user) === currentUserId) : payments,
  });
};

module.exports = { getDashboardOverview };
