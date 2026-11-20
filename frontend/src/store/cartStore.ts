import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  imagen_url: string | null;
  /** Stock conocido al agregar: solo sirve para limitar los botones "+". */
  stock: number;
}

interface CartState {
  items: ItemCarrito[];
  agregar: (producto: Omit<ItemCarrito, "cantidad">) => void;
  quitar: (productoId: number) => void;
  cambiarCantidad: (productoId: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
  cantidadTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      agregar: (producto) =>
        set((state) => {
          const existente = state.items.find((i) => i.producto_id === producto.producto_id);
          if (!existente) {
            return { items: [...state.items, { ...producto, cantidad: 1 }] };
          }
          return {
            items: state.items.map((i) =>
              i.producto_id === producto.producto_id
                ? { ...i, stock: producto.stock, cantidad: Math.min(i.cantidad + 1, producto.stock) }
                : i,
            ),
          };
        }),

      quitar: (productoId) =>
        set((state) => ({ items: state.items.filter((i) => i.producto_id !== productoId) })),

      cambiarCantidad: (productoId, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.producto_id === productoId
              ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
              : i,
          ),
        })),

      vaciar: () => set({ items: [] }),

      // Se calculan a partir de `items`: un total guardado podría desincronizarse.
      total: () =>
        Math.round(get().items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0) * 100) / 100,

      cantidadTotal: () => get().items.reduce((suma, i) => suma + i.cantidad, 0),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }), // solo los ítems; nunca datos de sesión
    },
  ),
);