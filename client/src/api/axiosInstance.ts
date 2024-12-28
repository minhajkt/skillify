import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL:"http://localhost:3000/api",
    headers : {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('authToken')
    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
    },
    (error) => {
        return Promise.reject(error)
    }
);