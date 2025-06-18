// src/api/services/service.js

import axiosInstance from "../../utils/axios_instance";

export const getMyOrders = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get("/orders", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};
export const getDataNoPagination = async (path) => {
  try {
    const response = await axiosInstance.get(`/${path}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getData = async (path, page = 1, limit = 5, qualityType = "") => {
  try {
    const response = await axiosInstance.get(
      `${path}/public/${import.meta.env.VITE_OWNER}`,
      {
        params: { qualityType, page, limit },
      }
    );
    // console.log("Params",path,page,limit,qualityType)
    // console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const postVerifyData = async (path, uniqueCode = "") => {
  try {
    const response = await axiosInstance.post(`/${path}`, {
      uniqueCode,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying code:", error);
    throw error;
  }
};

export const createData = async (path, payload) => {
  try {
    const { data, config } =
      typeof payload === "object" && payload.data
        ? payload
        : { data: payload, config: {} };
    const response = await axiosInstance.post(`/${path}`, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error creating data for ${path}:`, error);
    throw error;
  }
};

export const getOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

export const getProduct = async (
  path,
  page = 1,
  limit = 5,
  qualityType = "all",
  search = "",
  category = ""
) => {
  const params = { page, limit };

  if (qualityType && qualityType !== "all") params.qualityType = qualityType;
  if (search) params.search = search;
  if (category) params.category = category;

  const response = await axiosInstance.get(`/${path}/public/${import.meta.env.VITE_OWNER}`, { params });
  return response.data;
};
