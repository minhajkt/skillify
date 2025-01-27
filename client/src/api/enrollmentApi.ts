import { handleAxiosError } from "../utils/errorHandler"
import { axiosInstance } from "./axiosInstance"

export const fetchUserEnrolledCourses = async() => {
    try {
        const response = await axiosInstance.get('/enrollment/my-courses', {
            withCredentials: true
        })
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export  const enrolledStudents = async () => {
    try {
      const response = await axiosInstance.get("/enrollment/total");
      return response.data.total
    } catch (err) {
        throw handleAxiosError(err)
    }
};

export const getTotalRevenue = async() => {
    try {
        const response = await axiosInstance.get('/enrollment/total-revenue')
        console.log('ressssss', response.data);
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const getCourseStrength = async () => {
    try {
        const response = await axiosInstance.get('/enrollment/strength')
        console.log('strength', response.data);
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
} 

  