import { AxiosError } from "axios";
// import Cookies from "js-cookie";
import { store } from "../store/store";
import { logout } from "../store/authSlice";

export const handleForbiddenError = (error: AxiosError): void => {
  if (error.response && error.response.status === 403 || error.response?.status === 401) {
    // localStorage.removeItem("authToken");
    // Cookies.remove("authToken"); 

    store.dispatch(logout())

    window.location.href = "/login";
    
  }
};
