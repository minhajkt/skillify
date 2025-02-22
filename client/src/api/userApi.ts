import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";


export const getTutorById = async(courseId: string) => {
    try {
        const response = await axiosInstance.get(`users/user/${courseId}`)
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const getUserCourseDetails = async(courseId: string) => {
    try {
        if (!courseId) {
          throw new Error("Course ID is required to fetch course details.");
        }
        
        const response = await axiosInstance.get(`/users/course-section/${courseId}`, {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}