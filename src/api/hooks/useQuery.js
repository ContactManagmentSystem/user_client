import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createData,
  getData,
  getOrderById,
  getProduct,
} from "../services/service";

export const useGetProduct = (
  page = 1,
  limit = 5,
  qualityType = "all",
  search = "",
  category = ""
) => {
  return useQuery({
    queryKey: ["products", page, limit, qualityType, search, category],
    queryFn: () =>
      getProduct("products", page, limit, qualityType, search, category),
  });
};

export const useGetProductById = (id) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getData(`products/${id}`),
  });
};


export const useGetLanding = (page = 1, limit = 5, qualityType = "all") => {
  return useQuery({
    queryKey: ["landing", page, limit, qualityType],
    queryFn: () => getData("landing", page, limit, qualityType),
  });
};

export const useGetPaymentType = (page = 1, limit = 5, qualityType = "all") => {
  return useQuery({
    queryKey: ["payment", page, limit, qualityType],
    queryFn: () => getData("payment", page, limit, qualityType),
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (orderData) => createData("orders", orderData), 
  });
};

export const useGetOrderById = (id) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: !!id, 
  });
};