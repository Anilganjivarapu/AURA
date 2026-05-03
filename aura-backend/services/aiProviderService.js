const buildSystemPrompt = (topic) => {
  const topicGuidance = {
    coding:
      "Answer coding questions clearly with correct examples, debugging help, and best practices.",
    resume:
      "Give resume tips, project bullet rewrites, and concise improvement suggestions.",
    interview:
      "Provide interview questions, mock interview prompts, and preparation guidance.",
    courses:
      "Recommend courses, learning paths, and explain course outcomes and sequencing.",
    support:
      "Handle support FAQs, fee/help support, and platform guidance in a clear helpful tone.",
  };

  return `You are the AURA AI Assistant. ${topicGuidance[topic] || topicGuidance.coding} Keep answers structured, practical, and professional.`;
};

const GEMINI_FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];

const extractJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.error?.status ||
      data?.error?.details ||
      "AI provider request failed";
    throw new Error(message);
  }

  return data;
};

const callOpenAI = async ({ prompt, topic }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(
    `${process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: buildSystemPrompt(topic) },
          { role: "user", content: prompt },
        ],
      }),
    }
  );

  const data = await extractJson(response);
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("OpenAI returned an empty response");
  }

  return reply;
};

const callGemini = async ({ prompt, topic }) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const requestedModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const modelsToTry = [requestedModel, ...GEMINI_FALLBACK_MODELS.filter((model) => model !== requestedModel)];
  let lastError = null;

  for (const model of modelsToTry) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${buildSystemPrompt(topic)}\n\nUser request: ${prompt}` }] }],
        }),
      }
    );

    try {
      const data = await extractJson(response);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (!reply) {
        throw new Error(`Gemini model ${model} returned an empty response`);
      }

      return reply;
    } catch (error) {
      lastError = error;

      const message = error.message || "";
      const shouldTryNextModel =
        message.includes("not found for API version") || message.includes("not supported for generateContent");

      if (!shouldTryNextModel) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Gemini request failed");
};

const generateAssistantReply = async ({ provider, prompt, topic }) => {
  if (provider === "gemini") {
    return callGemini({ prompt, topic });
  }

  return callOpenAI({ prompt, topic });
};

module.exports = { generateAssistantReply };
