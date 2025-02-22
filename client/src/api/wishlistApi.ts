import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const getWishlist = async () => {
  try {
    const response = await axiosInstance.get('/wishlist')
    return response.data
  } catch (error) {
    throw handleAxiosError(error)
  }
}

export const handleAddToWishlist = async (courseId: string) => {
  try {
    const response = await axiosInstance.post("/wishlist/add", { courseId });
    return response.data
} catch (error) {
    throw handleAxiosError(error);  
}
};

export const handleRemoveFromWishlist = async (courseId: string) => {
  try {
    const response = await axiosInstance.post("/wishlist/remove", { courseId });
    return response.data
} catch (error) {
    throw handleAxiosError(error)
  }
};
