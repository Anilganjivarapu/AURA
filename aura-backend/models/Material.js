const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["video", "document", "link"],
      default: "video",
    },
    url: { type: String, required: true },
    description: String,
    isPreview: { type: Boolean, default: false },
    tags: [String],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
