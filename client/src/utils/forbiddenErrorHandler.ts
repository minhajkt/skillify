import { AxiosError } from "axios";
import { persistor, store } from "../store/store";
import { logout } from "../store/authSlice";


export const handleForbiddenError = (error: AxiosError): void => {
  if (error.response && (error.response.status === 403 || error.response.status === 401)) {
    console.log('dispatching');
    
    store.dispatch(logout())
    persistor.purge();
    console.log('dispatchded');
    // window.location.href = "/login";
  }
};
