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

export interface ProductoUpdatePayload {
  nombre: string;
  descripcion: string | null;
  precio_base: number;
  imagen_url: string | null;
  categoria_id: number;
}

export interface ProductoCreatePayload extends ProductoUpdatePayload {
  stock: number;
  disponible: boolean;
}

export interface StockPayload {
  stock: number;
  disponible: boolean;
}