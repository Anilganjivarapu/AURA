import api from "./api";

const materialService = {
  list: async () => {
    const { data } = await api.get("/materials");
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/materials", payload);
    return data;
  },
};

export default materialService;
