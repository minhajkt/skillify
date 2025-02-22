import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const addLecture = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post("/lectures", formData);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const getLecturesByCourseId = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}/lectures`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const updateLecture = async (lectureId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(
      `/lecture/${lectureId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
