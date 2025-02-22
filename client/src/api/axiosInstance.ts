
import axios from "axios";
import Cookies from "js-cookie";
import { store } from "../store/store";
import { loginSuccess, logout } from "../store/authSlice";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
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

axiosInstance.interceptors.response.use(
  (response) => {
    
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout())
      Cookies.remove("authToken");
      return
    }
      else if (
        error.response &&
        (error.response.status === 403)
      ) {
        // console.log("awaitign to refresh access token");

        if (error.config._retry) {
          // console.error("Token refresh failed again. Logging out...");
          store.dispatch(logout());
          Cookies.remove("authToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        error.config._retry = true;

        try {
          const refreshResponse = await axiosInstance.post(
            "/users/refresh-token"
          );

          if (!refreshResponse?.data?.token) {
            throw new Error("No new access token received"); 
          }

          // console.log("recieved accesstoken ", refreshResponse.data);
          const user = store.getState().auth.user;
          if(user) {            
            store.dispatch(
              loginSuccess({
                token: refreshResponse.data.token,
                user: user,
                isAuthenticated: true,
              })
            );
          }
          error.config.headers[
            "Authorization"
          ] = `Bearer ${refreshResponse.data.token}`;
          return axiosInstance(error.config);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          // console.error("Refresh token invalid or expired", err);
          store.dispatch(logout());
          Cookies.remove("authToken");
          // window.location.href = "/login";
          return Promise.reject(error);
        }
      }
    return Promise.reject(error);
  }
);
