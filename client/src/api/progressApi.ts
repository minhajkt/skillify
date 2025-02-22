import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const getProgress = async (userId: string, courseId: string) => {
  try {
    const response = await axiosInstance.get(
      `/progress/get-progress/${userId}/${courseId}`
    );

    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const markLectureCompleted = async (
  userId: string,
  courseId: string,
  lectureId: string
) => {
  try {
    const response = await axiosInstance.put(
      `/progress/update-progress/${userId}/${courseId}/${lectureId}`
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const generateCertificate = async (
  userId: string,
  courseId: string,
  userName: string,
  courseName: string
) => {
  try {
    const response = await axiosInstance.post(
      "/progress/generate-certificate",
      {
        userId,
        courseId,
        userName,
        courseName,
      }
    );
    return response.data.certificateId;
  } catch (error) {
    handleAxiosError(error);
  }
};
