const bcrypt = require("bcryptjs");

const User = require("../models/User");
const { demoUsers, generateId } = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");
const { signToken } = require("../utils/jwt");
const { isOwnerAdminEmail, normalizeEmail } = require("../utils/ownerAdmin");

const sanitizeUser = (user) => ({
  id: user._id || user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  staffId: user.staffId || "",
  avatar: user.avatar || "",
  bio: user.bio || "",
});

const register = async (req, res) => {
  const { name, email, password, role, phone, staffId } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  const normalizedRole =
    role === "admin" && process.env.AURA_ALLOW_ADMIN_SIGNUP === "true" && isOwnerAdminEmail(normalizedEmail)
      ? "admin"
      : ["student", "staff"].includes(role)
      ? role
      : "student";

  if (normalizedRole === "staff" && !staffId) {
    return res.status(400).json({ success: false, message: "Staff ID is required for staff accounts" });
  }

  if (isDatabaseReady()) {
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      phone,
      staffId: normalizedRole === "staff" ? staffId : "",
    });

    const token = signToken(user);
    return res.status(201).json({ success: true, token, user: sanitizeUser(user) });
  }

  const existingDemoUser = demoUsers.find((user) => user.email === normalizedEmail);

  if (existingDemoUser) {
    return res.status(409).json({ success: false, message: "User already exists in demo mode" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: generateId("usr"),
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: normalizedRole,
    phone,
    staffId: normalizedRole === "staff" ? staffId : "",
    createdAt: new Date().toISOString(),
  };

  demoUsers.push(user);

  const token = signToken(user);
  return res.status(201).json({ success: true, token, user: sanitizeUser(user) });
};

const login = async (req, res) => {
  const { email, password, role } = req.body;
  const normalizedEmail = normalizeEmail(email);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  if (isDatabaseReady()) {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (user.role === "admin" && !isOwnerAdminEmail(user.email)) {
      return res.status(403).json({ success: false, message: "Admin access is reserved for the owner account" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ success: false, message: "Selected role does not match this account" });
    }

    user.lastLogin = new Date();
    await user.save();

    return res.json({
      success: true,
      token: signToken(user),
      user: sanitizeUser(user),
    });
  }

  const user = demoUsers.find((entry) => entry.email === normalizedEmail);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  if (user.role === "admin" && !isOwnerAdminEmail(user.email)) {
    return res.status(403).json({ success: false, message: "Admin access is reserved for the owner account" });
  }

  if (role && user.role !== role) {
    return res.status(403).json({ success: false, message: "Selected role does not match this account" });
  }

  user.lastLogin = new Date().toISOString();

  return res.json({
    success: true,
    token: signToken(user),
    user: sanitizeUser(user),
  });
};

const getCurrentUser = async (req, res) => {
  return res.json({ success: true, user: sanitizeUser(req.user) });
};

const updateProfile = async (req, res) => {
  const allowedFields = ["name", "phone", "avatar", "bio"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key, value]) => allowedFields.includes(key) && value !== undefined)
  );

  if (isDatabaseReady()) {
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, user: sanitizeUser(user) });
  }

  const demoUser = demoUsers.find((entry) => entry.id === String(req.user._id || req.user.id));

  if (!demoUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  Object.assign(demoUser, updates);
  return res.json({ success: true, user: sanitizeUser(demoUser) });
};

module.exports = { register, login, getCurrentUser, updateProfile };
