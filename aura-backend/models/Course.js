const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    image: { type: String, default: "" },
    duration: { type: String, default: "8 weeks" },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
