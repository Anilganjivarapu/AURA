const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { demoUsers } = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");
const { isOwnerAdminEmail } = require("../utils/ownerAdmin");

const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  try {
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "aura-dev-secret");

    if (isDatabaseReady()) {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = user;
      return next();
    }

    const demoUser = demoUsers.find((user) => user.id === decoded.id);

    if (!demoUser) {
      return res.status(401).json({ success: false, message: "Demo user not found" });
    }

    req.user = { ...demoUser, _id: demoUser.id };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (req.user?.role === "admin" && !isOwnerAdminEmail(req.user.email)) {
      return res.status(403).json({ success: false, message: "Admin access is reserved for the owner account" });
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }

    return next();
  };

module.exports = { protect, authorize };
