import api from "./api";

const authService = {
  login: async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },
  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  me: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
  updateProfile: async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    return data;
  },
};

export default authService;
