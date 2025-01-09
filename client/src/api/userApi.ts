import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance";


export const getTutorById = async(courseId: string) => {
    try {
        const response = await axiosInstance.get(`users/user/${courseId}`)
        console.log('res', response.data);
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}