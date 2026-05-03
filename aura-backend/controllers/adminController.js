const Course = require("../models/Course");
const Payment = require("../models/Payment");
const SiteContent = require("../models/SiteContent");
const User = require("../models/User");
const {
  demoCourses,
  demoPayments,
  demoSiteContent,
  demoUsers,
} = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");
const { isOwnerAdminEmail, normalizeEmail } = require("../utils/ownerAdmin");

const getAdminSummary = async (req, res) => {
  let users = demoUsers;
  let courses = demoCourses;
  let payments = demoPayments;

  if (isDatabaseReady()) {
    users = await User.find().select("-password");
    courses = await Course.find();
    payments = await Payment.find();
  }

  const paidRevenue = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return res.json({
    success: true,
    summary: {
      usersByRole: {
        admin: users.filter((user) => user.role === "admin").length,
        student: users.filter((user) => user.role === "student").length,
        staff: users.filter((user) => user.role === "staff").length,
      },
      platformHealth: {
        publishedCourses: courses.filter((course) => course.status === "published").length,
        draftCourses: courses.filter((course) => course.status === "draft").length,
        paidRevenue,
      },
      recentUsers: users.slice(0, 5).map((user) => ({
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    },
  });
};

const listUsers = async (req, res) => {
  if (isDatabaseReady()) {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json({ success: true, users });
  }

  return res.json({
    success: true,
    users: [...demoUsers]
      .reverse()
      .map(({ password, ...user }) => user),
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const allowedFields = ["name", "email", "role", "staffId", "phone", "isActive"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
  );
  const nextEmail = updates.email ? normalizeEmail(updates.email) : undefined;

  if (nextEmail) {
    updates.email = nextEmail;
  }

  if (isDatabaseReady()) {
    const currentUser = await User.findById(id);

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isOwnerAccount = isOwnerAdminEmail(currentUser.email);
    const targetEmail = nextEmail || currentUser.email;

    if (updates.role === "admin" && !isOwnerAdminEmail(targetEmail)) {
      return res.status(403).json({ success: false, message: "Only the owner account can be assigned admin access" });
    }

    if (isOwnerAccount && updates.role && updates.role !== "admin") {
      return res.status(403).json({ success: false, message: "The owner account must remain admin" });
    }

    if (isOwnerAccount && nextEmail && !isOwnerAdminEmail(nextEmail)) {
      return res.status(403).json({ success: false, message: "The owner admin email cannot be changed here" });
    }

    if (!isOwnerAccount && currentUser.role === "admin") {
      updates.role = "staff";
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select("-password");

    return res.json({ success: true, user });
  }

  const user = demoUsers.find((entry) => entry.id === id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isOwnerAccount = isOwnerAdminEmail(user.email);
  const targetEmail = nextEmail || user.email;

  if (updates.role === "admin" && !isOwnerAdminEmail(targetEmail)) {
    return res.status(403).json({ success: false, message: "Only the owner account can be assigned admin access" });
  }

  if (isOwnerAccount && updates.role && updates.role !== "admin") {
    return res.status(403).json({ success: false, message: "The owner account must remain admin" });
  }

  if (isOwnerAccount && nextEmail && !isOwnerAdminEmail(nextEmail)) {
    return res.status(403).json({ success: false, message: "The owner admin email cannot be changed here" });
  }

  if (!isOwnerAccount && user.role === "admin") {
    updates.role = "staff";
  }

  Object.assign(user, updates);
  const { password, ...safeUser } = user;
  return res.json({ success: true, user: safeUser });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (isDatabaseReady()) {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (isOwnerAdminEmail(existingUser.email)) {
      return res.status(403).json({ success: false, message: "The owner admin account cannot be deleted" });
    }

    const user = await User.findByIdAndDelete(id);

    return res.json({ success: true, message: "User deleted" });
  }

  const index = demoUsers.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (isOwnerAdminEmail(demoUsers[index].email)) {
    return res.status(403).json({ success: false, message: "The owner admin account cannot be deleted" });
  }

  demoUsers.splice(index, 1);
  return res.json({ success: true, message: "User deleted" });
};

const getSiteContent = async (req, res) => {
  if (isDatabaseReady()) {
    let content = await SiteContent.findOne({ key: "main" });

    if (!content) {
      content = await SiteContent.create({ key: "main", ...demoSiteContent });
    }

    return res.json({ success: true, content });
  }

  return res.json({ success: true, content: demoSiteContent });
};

const updateSiteContent = async (req, res) => {
  const allowedFields = [
    "homeTitle",
    "homeSubtitle",
    "homeImage",
    "aboutHeadline",
    "aboutText",
    "contactEmail",
    "contactPhone",
    "contactAddress",
  ];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
  );

  if (isDatabaseReady()) {
    const content = await SiteContent.findOneAndUpdate(
      { key: "main" },
      { key: "main", ...updates, updatedBy: req.user._id },
      { upsert: true, new: true }
    );

    return res.json({ success: true, content });
  }

  Object.assign(demoSiteContent, updates);
  return res.json({ success: true, content: demoSiteContent });
};

module.exports = { getAdminSummary, listUsers, updateUser, deleteUser, getSiteContent, updateSiteContent };
