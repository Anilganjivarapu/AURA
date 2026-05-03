import api from "./api";

const adminService = {
  summary: async () => {
    const { data } = await api.get("/admin/summary");
    return data;
  },
  users: async () => {
    const { data } = await api.get("/admin/users");
    return data;
  },
  updateUser: async (id, payload) => {
    const { data } = await api.patch(`/admin/users/${id}`, payload);
    return data;
  },
  deleteUser: async (id) => {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },
  getSiteContent: async () => {
    const { data } = await api.get("/admin/site-content");
    return data;
  },
  updateSiteContent: async (payload) => {
    const { data } = await api.put("/admin/site-content", payload);
    return data;
  },
};

export default adminService;
