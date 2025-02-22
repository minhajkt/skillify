import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const getPendingPayments = async () => {
  try {
    const response = await axiosInstance.get("/payments/pending");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updatePaymentStatus = async (paymentId: string) => {
  try {
    const response = await axiosInstance.put(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getPaymentHistory = async () => {
  try {
    const response = await axiosInstance.get("/payments/history");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const tutorRecievable = async (tutorId: string) => {
  try {
    const response = await axiosInstance.get(`/payments/tutors/${tutorId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
