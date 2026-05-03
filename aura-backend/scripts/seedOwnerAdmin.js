require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("../models/User");
const { normalizeEmail } = require("../utils/ownerAdmin");

const OWNER_EMAIL = normalizeEmail(process.env.ADMIN_EMAIL || "admin@aura.dev");
const OWNER_PASSWORD = "Aura@123";
const OWNER_NAME = "AURA Admin";

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    family: 4,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });

  const hashedPassword = await bcrypt.hash(OWNER_PASSWORD, 10);

  const owner = await User.findOneAndUpdate(
    { email: OWNER_EMAIL },
    {
      name: OWNER_NAME,
      email: OWNER_EMAIL,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      staffId: "",
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  await User.updateMany({ email: { $ne: OWNER_EMAIL }, role: "admin" }, { $set: { role: "staff" } });

  console.log(`Owner admin ready: ${owner.email}`);
  console.log(`Password: ${OWNER_PASSWORD}`);
};

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
