import axios from "axios";
const API=axios.create({
    baseURL:"http://192.168.1.17:5000/api/users",
});
export const UploadAPI = axios.create({
  baseURL: "http://192.168.1.17:5001/api/users",
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

UploadAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
