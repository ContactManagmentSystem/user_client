// src/utils/useForm.js

import { useState } from "react";

// Reusable form handler hook
export const useForm = (initialValues, validate) => {
  const [formData, setFormData] = useState(initialValues); // State for form data
  const [errors, setErrors] = useState({}); // State for form validation errors

  // Handle input changes and update form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Reset error message on change
  };

  // Handle form submission and validation
  const handleSubmit = (e, callback) => {
    e.preventDefault();
    const newErrors = validate(formData); // Validate the form data
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors if validation fails
    } else {
      callback(); // Call the provided callback if validation passes
    }
  };

  return {
    formData, // Expose form data
    errors, // Expose validation errors
    handleChange, // Expose handleChange function
    handleSubmit, // Expose handleSubmit function
  };
};
