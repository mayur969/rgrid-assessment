import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI || "http://localhost:8080/api/v1",
//   baseURL: "http://192.168.0.173:8080/api/v1",
});

export default api; 