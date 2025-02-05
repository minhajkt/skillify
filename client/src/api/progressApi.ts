import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance"

export const getProgress = async(userId: string, courseId: string) => {
    try {
        const response = await axiosInstance.get(`/progress/get-progress/${userId}/${courseId}`)
        console.log('res issssssssssssss', response.data);
        
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const markLectureCompleted = async (userId: string, courseId: string, lectureId: string) => {
    try {
        const response = await axiosInstance.put(`/progress/update-progress/${userId}/${courseId}/${lectureId}`)
        console.log('resss issssssss', response.data);
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const generateCertificate = async (userId: string, courseId: string, userName: string, courseName: string) => {
    try {
        const response = await axiosInstance.post("/progress/generate-certificate", {
        userId,
        courseId,
        userName,
        courseName
    });
    return response.data.certificateUrl;
    } catch (error) {
        handleAxiosError(error)
    }
};
