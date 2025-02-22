import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const getMessages = async (senderId: string, recipientId: string) => {
  try {
    const response = await axiosInstance.get(
      `/messages/${senderId}/${recipientId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const postMessageImage = async (
  formData: FormData,
  fileType: "image" | "video"
) => {
  try {
    const endpoint = fileType === "image" ? "/uploadImage" : "/uploadVideo";
    const response = await axiosInstance.post(endpoint, formData);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
