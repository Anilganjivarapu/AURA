const mongoose = require("mongoose");

const chatbotLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: String, enum: ["openai", "gemini"], required: true },
    topic: {
      type: String,
      enum: ["coding", "resume", "interview", "courses", "support"],
      default: "coding",
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatbotLog", chatbotLogSchema);
