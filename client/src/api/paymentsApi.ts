import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance"

export const getPendingPayments = async() => {
    try {
        const response = await axiosInstance.get('/payments/pending')
        console.log('data is ', response.data);
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const updatePaymentStatus = async(paymentId: string) => {
    try {
        const response = await axiosInstance.put(`/payments/${paymentId}`)
        // console.log(response.data);
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const getPaymentHistory = async() => {
    try {
        const response = await axiosInstance.get('/payments/history')
        // console.log('ress', response.data);
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}

export const tutorRecievable = async (tutorId: string) => {
    try {
        const response = await  axiosInstance.get(`/payments/tutors/${tutorId}`)
        console.log('response', response.data);
        return response.data
    } catch (error) {
        handleAxiosError(error)
    }
}