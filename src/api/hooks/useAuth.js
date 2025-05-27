// src/api/hooks/useLogin.js

import { useMutation } from "@tanstack/react-query";
import { loginUser, signupUser } from "../services/auth_service";

export const useLogin = (options = {}) => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      if (options.onError) {
        options.onError(error);
      }
    },
    ...options,
  });
};

export const useSignup = (options = {}) => {
  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (options.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      if (options.onError) {
        options.onError(error);
      }
    },
    ...options,
  });
};
