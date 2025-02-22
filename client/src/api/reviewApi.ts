import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const addCourseReview = async (reviewData: {
  courseId: string;
  rating: number;
  reviewText: string;
}) => {
  try {
    const response = await axiosInstance.post(
      "/review/add-review",
      reviewData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const getReviews = async (courseId: string) => {
  try {
    const response = await axiosInstance.get(`/reviews/${courseId}`);
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const fetchUserReview = async (courseId: string, userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/reviews/user/${userId}/course/${courseId}`
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const updateCourseReview = async (
  courseId: string,
  userId: string,
  reviewText: string,
  rating: number
) => {
  try {
    const response = await axiosInstance.put(
      `/reviews/user/${userId}/course/${courseId}`,
      {
        reviewText,
        rating,
      }
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};

export const deleteCourseReview = async (courseId: string, userId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/reviews/${courseId}/${userId}`
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error);
  }
};
