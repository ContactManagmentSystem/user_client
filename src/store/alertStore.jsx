import { create } from "zustand";

const useAlertStore = create((set) => ({
  message: "",
  visible: false,
  showAlert: (message) => {
    set({ message, visible: true });
    setTimeout(() => set({ visible: false }), 2000); 
  },
}));

export default useAlertStore;
