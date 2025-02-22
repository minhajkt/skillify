import { AxiosError } from "axios";
import { axiosInstance } from "./axiosInstance";
import Cookies from 'js-cookie';
import { store } from "../store/store";
import { loginSuccess } from "../store/authSlice";
import { handleAxiosError } from "../utils/errorHandler";

export const loginUser = async(email:string, password:string) => {
  try {
    const response = await axiosInstance.post('/users/login', {email, password})
    const {token} = response.data
    if(token) {
      store.dispatch(loginSuccess({
        token,
        user: response.data.user,
        isAuthenticated: true
      }))
            
            Cookies.set('authToken', token, {expires: 1/24})
        }else {
            // console.log('user not logged in ');
        }
        return response.data
      } catch (error) {
        if(error instanceof AxiosError) {
            if(error.response) {
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
      if (error instanceof AxiosError) {
            const errors = error.response?.data.errors
            const errorMessage = error.response?.data.error
      const firstError = errors?.[0]?.msg || errorMessage || "Something went wrong!";
      throw new Error(firstError); 
    }
        throw new Error((error as Error).message)
      }
}

// for the tutor signup and login



export const loginTutor = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/tutors/login", {
      email,
      password,
    });
    const { token } = response.data;
    
    if (token) {
      if(response.data?.user?.role === 'tutor') {
        store.dispatch(
          loginSuccess({
            token,
            user: response.data.user,
            isAuthenticated: true
          })
        );
  
        Cookies.set("authToken", token, { expires: 1/24 });
      }else {
        // console.log('you are not tutor'); 
      
      }
    } else {
      // console.log("user not logged in ");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          "Somethning wrong";
        throw new Error(errorMessage);
      } else {
        throw new Error("An error occured. Please try again");
      }
    }
    throw new Error((error as Error).message);
  }
};



export const signupTutor = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  bio: string | null,
  certificates: FileList | null
) => {
  try {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    formData.append("bio", bio || "");

    if (certificates) {
      Array.from(certificates).forEach((file) => {
        formData.append("certificates", file);
      });
    }

    const response = await axiosInstance.post("/tutors/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errors = error.response?.data.errors;
      const errorMessage = error.response?.data.error;
      const firstError =
        errors?.[0]?.msg || errorMessage || "Something went wrong!";
      throw new Error(firstError);
    }
    throw new Error((error as Error).message);
  }
};


export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/admin/login", {
      email,
      password,
    });
    const { token } = response.data;

    if (token) {
      if (response.data?.user?.role === "admin") {
        store.dispatch(
          loginSuccess({
            token,
            user: response.data.user,
            isAuthenticated: true
          })
        );

        Cookies.set("authToken", token, { expires: 1/24 });
      } else {
        // console.log("you are not tutor");
      }
    } else {
      // console.log("user not logged in ");
    }
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          "Somethning wrong";
        throw new Error(errorMessage);
      } else {
        throw new Error("An error occured. Please try again");
      }
    }
    throw new Error((error as Error).message);
  }
};

export const googleSignIn = async (idToken: string) => {
  const response = await fetch("http://localhost:3000/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Google sign in failed");
  }

  const data = await response.json();
  const {token, user} = data;
  Cookies.set('authToken', token, {expires: 1/24 })
  store.dispatch(loginSuccess({token,user, isAuthenticated:true}))

  
  return data;
};

export const logoutUser = async() => {
  try {
    const response = await axiosInstance.post('/users/logout')
    return response.data
  } catch (error) {
    handleAxiosError(error)
  }
}

