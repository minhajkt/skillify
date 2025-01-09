import axios from "axios";
import Cookies from "js-cookie";
import { handleForbiddenError } from "../utils/forbiddenErrorHandler";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     handleForbiddenError(error);
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      handleForbiddenError(error); 
    }
    return Promise.reject(error);
  }
);
