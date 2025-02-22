import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";

export const fetchStudents = async () => {
  try {
    const response = await axiosInstance.get("/admin/students");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateStudentStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await axiosInstance.patch(`/admin/students/${id}/status`, {
      isActive,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchTutors = async () => {
  try {
    const response = await axiosInstance.get("/admin/tutors");

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchTutorById = async (tutorId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/tutor/${tutorId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchStudentById = async (studentId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/user/${studentId}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateTutorsStatus = async (id: string, isActive: boolean) => {
  try {
    const response = await axiosInstance.patch(`/admin/tutors/${id}/status`, {
      isActive,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateTutorsApproval = async (id: string, isApproved: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/tutor-request/${id}/approval`,
      {
        isApproved,
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchTutorRequests = async () => {
  try {
    const response = await axiosInstance.get("/admin/tutor-requests");

    return response.data.tutorRequest;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchCourseRequests = async () => {
  try {
    const response = await axiosInstance.get("/admin/course-requests");

    return response.data.courseRequest;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateCourseApproval = async (id: string, isApproved: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/course-request/${id}/approval`,
      { isApproved }
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateCourseEditApproval = async (
  id: string,
  isApproved: string,
  editStatus: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/course-request/${id}/edit-approval`,
      { isApproved, editStatus }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateCourseBlock = async (id: string, isApproved: string) => {
  try {
    const response = await axiosInstance.patch(
      `/admin/course-request/${id}/approval`,
      { isApproved }
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchAllCourses = async () => {
  try {
    const response = await axiosInstance.get("/admin/courses");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};
