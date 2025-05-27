// src/services/auth_service.js
import axiosInstance from "../../utils/axios_instance";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
export const signupUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/signup", userData);
    // console.log(response)
    return response.data;
  } catch (error) {
    console.log(error)
    console.error("Error signing up:", error);
    throw error;
  }
};
