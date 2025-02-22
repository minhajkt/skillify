import { AxiosError } from "axios";

export const handleAxiosError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.errors?.[0].msg ||
        error.response.data.message ||
        "Something went wrong";
      throw new Error(errorMessage);
    }
  }
  throw new Error((error as Error).message);
};

