const Course = require("../models/Course");
const Payment = require("../models/Payment");
const {
  demoCourses,
  demoPayments,
  generateId,
} = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");

const createCheckout = async (req, res) => {
  const { courseId, provider } = req.body;

  if (!courseId) {
    return res.status(400).json({ success: false, message: "courseId is required" });
  }

  let course;

  if (isDatabaseReady()) {
    course = await Course.findById(courseId);
  } else {
    course = demoCourses.find((entry) => entry.id === courseId);
  }

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }

  const selectedProvider = ["razorpay", "stripe"].includes(provider) ? provider : "razorpay";

  const payload = {
    amount: Number(course.price || 0),
    currency: "INR",
    provider: selectedProvider,
    orderId: `${selectedProvider}_order_${Date.now()}`,
    receipt: `receipt_${Date.now()}`,
    key:
      selectedProvider === "razorpay"
        ? process.env.RAZORPAY_KEY_ID || "rzp_test_demo"
        : process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_demo",
    demoMode:
      selectedProvider === "razorpay"
        ? !process.env.RAZORPAY_KEY_ID
        : !process.env.STRIPE_PUBLISHABLE_KEY,
  };

  if (isDatabaseReady()) {
    const payment = await Payment.create({
      userId: req.user._id,
      courseId: course._id,
      amount: payload.amount,
      method: payload.provider,
      receipt: payload.receipt,
      status: "created",
    });

    return res.status(201).json({ success: true, checkout: payload, paymentId: payment._id });
  }

  const payment = {
    id: generateId("pay"),
    userId: String(req.user._id || req.user.id),
    courseId: course.id,
    amount: payload.amount,
    method: payload.provider,
    receipt: payload.receipt,
    status: "created",
    orderId: payload.orderId,
  };

  demoPayments.unshift(payment);

  return res.status(201).json({ success: true, checkout: payload, paymentId: payment.id });
};

const verifyPayment = async (req, res) => {
  const { paymentId, transactionId, status } = req.body;

  if (!paymentId) {
    return res.status(400).json({ success: false, message: "paymentId is required" });
  }

  const finalStatus = status || "paid";

  if (isDatabaseReady()) {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.status = finalStatus;
    payment.transactionId = transactionId || `txn_${Date.now()}`;
    payment.paidAt = finalStatus === "paid" ? new Date() : null;
    await payment.save();

    return res.json({ success: true, payment });
  }

  const payment = demoPayments.find((entry) => entry.id === paymentId);

  if (!payment) {
    return res.status(404).json({ success: false, message: "Payment not found" });
  }

  payment.status = finalStatus;
  payment.transactionId = transactionId || `txn_${Date.now()}`;
  payment.paidAt = finalStatus === "paid" ? new Date().toISOString() : null;

  return res.json({ success: true, payment });
};

const getPaymentHistory = async (req, res) => {
  if (isDatabaseReady()) {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, payments });
  }

  const payments = demoPayments.filter(
    (entry) => entry.userId === String(req.user._id || req.user.id)
  );

  return res.json({ success: true, payments });
};

module.exports = { createCheckout, verifyPayment, getPaymentHistory };
