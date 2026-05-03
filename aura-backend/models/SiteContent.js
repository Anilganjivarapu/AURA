const mongoose = require("mongoose");

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    homeTitle: String,
    homeSubtitle: String,
    homeImage: String,
    aboutHeadline: String,
    aboutText: String,
    contactEmail: String,
    contactPhone: String,
    contactAddress: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
