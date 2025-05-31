import { ProductDataType } from "@/types/productDataTypes";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProductState {
  selectedProduct: ProductDataType | null;
  updateProduct: (product: ProductDataType) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      selectedProduct: null,
      updateProduct: (product) => set({ selectedProduct: product }),
    }),
    {
      name: "product-storage", // Nama key untuk localStorage
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
