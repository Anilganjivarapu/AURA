const ChatbotLog = require("../models/ChatbotLog");
const { generateAssistantReply } = require("../services/aiProviderService");
const { demoChatbotLogs, generateId } = require("../data/demoStore");
const { isDatabaseReady } = require("../utils/dbMode");

const sendMessage = async (req, res) => {
  const { prompt, provider = "openai", topic = "coding" } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, message: "Prompt is required" });
  }

  if (!["openai", "gemini"].includes(provider)) {
    return res.status(400).json({ success: false, message: "Provider must be openai or gemini" });
  }

  try {
    const reply = await generateAssistantReply({ provider, prompt, topic });

    if (isDatabaseReady()) {
      const log = await ChatbotLog.create({
        userId: req.user._id,
        provider,
        topic,
        prompt,
        response: reply,
      });

      return res.json({ success: true, provider, topic, reply, log });
    }

    const log = {
      id: generateId("chat"),
      userId: String(req.user._id || req.user.id),
      provider,
      topic,
      prompt,
      response: reply,
      createdAt: new Date().toISOString(),
    };

    demoChatbotLogs.unshift(log);
    return res.json({ success: true, provider, topic, reply, log });
  } catch (error) {
    return res.status(503).json({ success: false, message: error.message });
  }
};

const getHistory = async (req, res) => {
  if (isDatabaseReady()) {
    const history = await ChatbotLog.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
    return res.json({ success: true, history });
  }

  const history = demoChatbotLogs
    .filter((entry) => entry.userId === String(req.user._id || req.user.id))
    .slice(0, 30);

  return res.json({ success: true, history });
};

module.exports = { sendMessage, getHistory };
