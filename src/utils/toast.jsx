// src/utils/toast.js

import { toast } from "react-hot-toast";

// Reusable toast utility functions
const showToast = {
  success: (message, options = {}) => {
    toast.success(message, options);
  },
  error: (message, options = {}) => {
    toast.error(message, options);
  },
  info: (message, options = {}) => {
    toast(message, options);
  },
  warning: (message, options = {}) => {
    toast(message, {
      ...options,
      icon: "⚠️",
      style: { background: "#FFA500", color: "#000" },
    });
  },
  promise: (promise, messages, options = {}) => {
    toast.promise(promise, messages, options);
  },
  custom: (message, icon, options = {}) => {
    toast(
      (t) => (
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span>{message}</span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      ),
      options
    );
  },
};

export default showToast;
