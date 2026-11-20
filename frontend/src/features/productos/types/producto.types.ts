import type { Categoria } from "@/features/categorias";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  stock: number;
  disponible: boolean;
  activo: boolean;
  categoria_id: number;
  categoria: Categoria;
}

export interface ProductosPaginados {
  total: number;
  items: Producto[];
}

export interface FiltrosProductos {
  /** Página actual, empezando en 1. */
  pagina: number;
  limite: number;
  search?: string;
  categoriaId?: number | null;
}