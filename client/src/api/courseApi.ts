import { handleAxiosError } from "../utils/errorHandler";
import { axiosInstance } from "./axiosInstance"

export const createCourse = async(formData :FormData) => {
    try {
        const response = await axiosInstance.post("/course/create-course", formData, {
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

export const updateCourseDetails = async (
  courseId: string,
  formData: FormData
) => {
  try {
    const response = await axiosInstance.put(`/course/${courseId}`, formData);
    return response.data; 
  } catch (error) {
    throw handleAxiosError(error); 
  }
};

export const fetchCategories = async() => {
    try {
        const response = await axiosInstance.get('/course/categories')
        return response.data
    } catch (error) {
        throw handleAxiosError(error)
    }
}

interface ReportData {
  courseId: string;
  lectureId: string;
  reportDescription: string;
  userId: string;
}
export const postReport = async (reportData: ReportData) => {
  try {
    const response = await axiosInstance.post("/reports/submit", reportData);
    console.log("resssss", response.data);

    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getComplaints = async () => {
  try {
    const response = await axiosInstance.get("/reports");
    console.log('reports fetched data ', response.data);
    
    return response.data; 
  } catch (error) {
    console.error("Error fetching reports:", error);
    handleAxiosError(error);
  }
};



