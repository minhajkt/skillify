import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const fetchTutorCourses = async () => {
  try {
    const response = await axiosInstance.get("/tutor/courses", {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};


export const fetchTutorCourseDetails = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/tutor/courses/${courseId}`);
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getTutorCount = async() => {
  try {
    const response = await axiosInstance.get('/user/tutor-count')
    return response.data
    
  } catch (error) {
    handleAxiosError(error)
  }
}

