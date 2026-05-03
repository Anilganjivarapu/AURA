import api from "./api";

const enquiryService = {
  create: async (payload) => {
    const { data } = await api.post("/enquiries", payload);
    return data;
  },
};

export default enquiryService;
