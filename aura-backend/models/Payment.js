const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["razorpay", "stripe", "upi", "card", "netbanking", "cash"],
      default: "razorpay",
    },
    receipt: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    transactionId: String,
    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
