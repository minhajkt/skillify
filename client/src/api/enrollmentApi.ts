import { handleAxiosError } from "../utils/errorHandler"
import { axiosInstance } from "./axiosInstance"

export const fetchUserEnrolledCourses = async() => {
    try {
        const response = await axiosInstance.get('/enrollment/my-courses', {
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
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const getCourseStrength = async () => {
    try {
        const response = await axiosInstance.get('/enrollment/strength')
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

export const getRevenueReport = async (
  timeRange: "daily" | "monthly" | "quarterly" | "yearly" | "custom",
  startDate: string,
  endDate: string
) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { timeRange };
    if (timeRange === "custom") {
      params.startDate = startDate;
      params.endDate = endDate;
    }

    const response = await axiosInstance.get("/enrollment/revenue-report", {
      params,
    });
    return response.data.map((item: { _id: string; totalRevenue: number }) => ({
      date: item._id,
      totalRevenue: item.totalRevenue,
    }));
  } catch (error) {
    throw handleAxiosError(error);
  }
};
  