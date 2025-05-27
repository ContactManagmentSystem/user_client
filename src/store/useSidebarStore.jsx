// store/useSidebarStore.js
import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isSidebarVisible: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarVisible: !state.isSidebarVisible })),
  closeSidebar: () => set({ isSidebarVisible: false }),
}));

export default useSidebarStore;
