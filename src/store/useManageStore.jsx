// src/store/useManageStore.jsx
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useManageStore = create(
  persist(
    (set) => ({
      items: [],
      orderHistory: [], 
      placeOrder: {
        products: [],
        phonePrimary: "",
        phoneSecondary: "",
        address: "",
        paymentType: "COD",
        paymentDetails: {},
      },

      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i._id === item._id);
          if (exists) {
            return {
              items: state.items.map((i) =>
                i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),

      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((item) => item._id !== itemId),
        })),

      increaseQuantity: (itemId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item._id === itemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),

      decreaseQuantity: (itemId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item._id === itemId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      generatePlaceOrder: (
        phonePrimary,
        address,
        paymentType,
        paymentDetails = {},
        phoneSecondary = ""
      ) =>
        set((state) => {
          const products = state.items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          }));

          return {
            placeOrder: {
              products,
              phonePrimary,
              phoneSecondary,
              address,
              paymentType,
              paymentDetails,
            },
          };
        }),

      clearCart: () => set({ items: [] }),

      resetPlaceOrder: () =>
        set({
          placeOrder: {
            products: [],
            phonePrimary: "",
            phoneSecondary: "",
            address: "",
            paymentType: "COD",
            paymentDetails: {},
          },
        }),

      addOrderHistory: (orderId) =>
        set((state) => ({
          orderHistory: [orderId, ...state.orderHistory], // adds new ID at the top
        })),
    }),
    { name: "data-storage" }
  )
);
