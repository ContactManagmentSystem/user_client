// useProductManageStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProductManageStore = create(
  persist(
    (set, get) => ({
      products: [],
      filter: "all",
      setProducts: (products) => set({ products }),
      setFilter: (filter) => set({ filter }),

      filteredProducts: () => {
        const { products, filter } = get();
        if (filter === "all") return products;
        return products.filter((product) => product.category.name === filter);
      },
    }),
    {
      name: "product-manage-store",
    }
  )
);

export default useProductManageStore;
