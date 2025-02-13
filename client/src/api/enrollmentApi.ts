import { handleAxiosError } from "../utils/errorHandler"
import { axiosInstance } from "./axiosInstance"

export const fetchUserEnrolledCourses = async() => {
    try {
        const response = await axiosInstance.get('/enrollment/my-courses', {
            // withCredentials: true
        })
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

  export const getMyStudents = async () => {
    try {
      const response = await axiosInstance.get("/enrollment/my-students", {
        withCredentials: true
      });
      // console.log('stttttttttttttttttttttt', response.data);
      
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  };

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

export const getRevenueReport = async (timeRange, startDate, endDate) => {
  try {
    const params: any = { timeRange };
    if (timeRange === "custom") {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axiosInstance.get("/enrollment/revenue-report", {
      params
    });
    return response.data.map((item) => ({
      date: item._id,
      totalRevenue: item.totalRevenue,
    }));
  } catch (error) {
    throw handleAxiosError(error);
  }
};
  