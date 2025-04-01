import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Base URL ajustada para incluir "/api"
});

export default api;
