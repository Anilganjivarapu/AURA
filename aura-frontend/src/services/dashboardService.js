import api from "./api";

const dashboardService = {
  overview: async () => {
    const { data } = await api.get("/dashboard/overview");
    return data;
  },
};

export default dashboardService;
