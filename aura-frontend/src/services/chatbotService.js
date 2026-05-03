import api from "./api";

const chatbotService = {
  send: async (payload) => {
    const { data } = await api.post("/chatbot/message", payload);
    return data;
  },
  history: async () => {
    const { data } = await api.get("/chatbot/history");
    return data;
  },
};

export default chatbotService;
