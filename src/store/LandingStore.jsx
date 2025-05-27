// src/store/landingStore.js

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLandingStore = create(
  persist(
    (set) => ({
      landingData: null,
      setLandingData: (data) => set({ landingData: data }),
      clearLandingData: () => set({ landingData: null }),
    }),
    {
      name: "landing-store",
      getStorage: () => localStorage,
    }
  )
);

export default useLandingStore;
