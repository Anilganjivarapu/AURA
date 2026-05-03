import api from "./api";

const courseService = {
  list: async () => {
    const { data } = await api.get("/courses");
    return data;
  },
  create: async (payload) => {
    const { data } = await api.post("/courses", payload);
    return data;
  },
  enroll: async (courseId) => {
    const { data } = await api.post(`/courses/${courseId}/enroll`);
    return data;
  },
};

export default courseService;
