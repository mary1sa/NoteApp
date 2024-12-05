import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://notes.devlop.tech/api", 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("data");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("data"); 
      sessionStorage.removeItem("user");
      if (error.config.navigate) {
        error.config.navigate("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
