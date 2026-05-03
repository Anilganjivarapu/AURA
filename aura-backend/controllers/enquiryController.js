const Enquiry = require("../models/Enquiry");
const { isDatabaseReady } = require("../utils/dbMode");

const demoEnquiries = [];

const createEnquiry = async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: "Name, phone, and message are required" });
  }

  if (isDatabaseReady()) {
    const enquiry = await Enquiry.create({ name, phone, message });
    return res.status(201).json({ success: true, enquiry });
  }

  const enquiry = { id: `enq_${Date.now()}`, name, phone, message, createdAt: new Date().toISOString() };
  demoEnquiries.unshift(enquiry);
  return res.status(201).json({ success: true, enquiry });
};

const listEnquiries = async (req, res) => {
  if (isDatabaseReady()) {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.json({ success: true, enquiries });
  }

  return res.json({ success: true, enquiries: demoEnquiries });
};

module.exports = { createEnquiry, listEnquiries };
