import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance"

export const createCourse = async(courseData :{title:string, description: string, category: string,thumbnail: string, price: number, createdBy:string}) => {
    try {
        const response = await axiosInstance.post("/course/create-course", courseData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
        return response.data;
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const fetchCourseDetails = async(courseId: string) => {
    try {
        const response = await axiosInstance.get(`/courses/${courseId}`)
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const fetchCategories = async() => {
    try {
        const response = await axiosInstance.get('/course/categories')
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

