import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";


export const handleAddToWishlist = async (courseId: string) => {
  try {
    const response = await axiosInstance.post("/wishlist/add", { courseId });
    return response.data
} catch (error) {
    console.error("Error adding to wishlist:", error);
    throw handleAxiosError(error);  
}
};

export const handleRemoveFromWishlist = async (courseId: string) => {
  try {
    const response = await axiosInstance.post("/wishlist/remove", { courseId });
    return response.data
} catch (error) {
    console.error("Error removing from wishlist:", error);
    throw handleAxiosError(error)
  }
};
