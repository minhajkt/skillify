import { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";
import Cookies from 'js-cookie';
import { store } from "../store/store";
import { loginSuccess } from "../store/authSlice";

export const loginUser = async(email:string, password:string) => {
    try {
        const response = await axiosInstance.post('/users/login', {email, password})
        const {token} = response.data
        if(token) {
            console.log('user logged in');
            store.dispatch(loginSuccess({
                token,
                user: response.data.user
            }))
            console.log('user from auth api', response.data?.user);
            
            Cookies.set('authToken', token, {expires: 1/24})
        }else {
            console.log('user not logged in ');
        }
        return response.data
    } catch (error) {
        console.error("Error object:", error);
        if(error instanceof AxiosError) {
            if(error.response) {
                console.log("Error response data:", error.response.data);
                const errorMessage = error.response.data.error || error.response.data.message || 'Somethning wrong'
                throw new Error(errorMessage)
            }else {
                throw new Error('An error occured. Please try again')
            }
        }
        throw new Error((error as Error).message);
    }
}

export const signupUser = async(name: string, email: string, password: string, confirmPassword: string) => {
    try {
        const response = await axiosInstance.post('/users/signup', {name, email, password, confirmPassword})
        return response.data
    } catch (error) {
        console.log('error is ', error);
        
         if (error instanceof AxiosError) {
            const errors = error.response?.data.errors
            const errorMessage = error.response?.data.error
      const firstError = errors?.[0]?.msg || errorMessage || "Something went wrong!";
      throw new Error(firstError); 
    }
        throw new Error((error as Error).message)
    }
}

// not using since we do it in the redux now
// export const logoutUser = () => {
//     Cookies.remove('authToken')
// }