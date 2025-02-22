import { AxiosError } from "axios";
import { persistor, store } from "../store/store";
import { logout } from "../store/authSlice";


export const handleForbiddenError = (error: AxiosError): void => {
  if (error.response && (error.response.status === 403 || error.response.status === 401)) {
    
    store.dispatch(logout())
    persistor.purge();
    // window.location.href = "/login";
  }
};
