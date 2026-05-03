import api from "./api";

const reportService = {
  summary: async () => {
    const { data } = await api.get("/reports/summary");
    return data;
  },
};

export default reportService;
