const express = require("express");

const { sendMessage, getHistory } = require("../controllers/chatbotController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/history", protect, getHistory);
router.post("/message", protect, sendMessage);

module.exports = router;
