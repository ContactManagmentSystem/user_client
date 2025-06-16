// useProductManageStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useProductManageStore = create(
  persist(
    (set, get) => ({
      products: [],
      filter: "all",
      searchInput: "",

      setProducts: (products) => set({ products }),
      setFilter: (filter) => set({ filter }),
      setSearchInput: (searchInput) => set({ searchInput }),

      filteredProducts: () => {
        const { products, filter, searchInput } = get();

        return products.filter((product) => {
          const matchesCategory =
            filter === "all" || product?.category?.name === filter;

          const matchesSearch =
            searchInput.trim() === "" ||
            product?.name
              ?.toLowerCase()
              .includes(searchInput.trim().toLowerCase());

          return matchesCategory && matchesSearch;
        });
      },
    }),
    {
      name: "product-manage-store",
    }
  )
);

export default useProductManageStore;
