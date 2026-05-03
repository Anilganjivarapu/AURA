import api from "./api";

const paymentService = {
  history: async () => {
    const { data } = await api.get("/payments/history");
    return data;
  },
  checkout: async (courseId, provider = "razorpay") => {
    const { data } = await api.post("/payments/checkout", { courseId, provider });
    return data;
  },
  verify: async (payload) => {
    const { data } = await api.post("/payments/verify", payload);
    return data;
  },
};

export default paymentService;
