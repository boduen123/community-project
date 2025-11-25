import axios from "axios";

// Kora instance ya axios ifite base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Hindura niba port yawe itandukanye
});

// Iyi code ireba niba ufite token mbere ya buri request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Hano dukeka ko wabitse token witwa "token"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;