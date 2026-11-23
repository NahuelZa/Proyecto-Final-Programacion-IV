import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as productosApi from "@/features/productos/api/producto";
import type {
  ProductoCreatePayload,
  ProductoUpdatePayload,
  StockPayload,
} from "@/features/productos/types/producto.types";

interface Filtros {
  pagina: number;
  limite: number;
  search: string;
  categoriaId: number | null;
}

export function useProductos({ pagina, limite, search, categoriaId }: Filtros) {
  const queryClient = useQueryClient();

  const query = useQuery({
    // useQuery con combinacion de filtros
    queryKey: ["productos", { pagina, limite, search, categoriaId }],
    queryFn: () =>
      productosApi.listarProductos({
        skip: (pagina - 1) * limite,
        limit: limite,
        search: search || undefined,
        categoria_id: categoriaId ?? undefined,
      }),
  });

  // Todas las listas de productos (catálogo y panel) empiezan con "productos":
  // invalidar ese prefijo las deja a todas como "viejas".
  const refrescar = () => queryClient.invalidateQueries({ queryKey: ["productos"] });

  const crear = useMutation({
    mutationFn: (payload: ProductoCreatePayload) => productosApi.crearProducto(payload),
    onSuccess: refrescar,
  });

  const actualizar = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductoUpdatePayload }) =>
      productosApi.actualizarProducto(id, payload),
    onSuccess: refrescar,
  });

  const inventario = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: StockPayload }) =>
      productosApi.cambiarStock(id, payload),
    onSuccess: refrescar,
  });

  const eliminar = useMutation({
    mutationFn: (id: number) => productosApi.eliminarProducto(id),
    onSuccess: refrescar,
  });

  return {
    productos: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isPending,
    error: query.error?.message ?? null,
    refetch: query.refetch,
    crear: crear.mutate,
    actualizar: actualizar.mutate,
    cambiarStock: inventario.mutate,
    eliminar: eliminar.mutate,
    guardando: crear.isPending || actualizar.isPending || inventario.isPending,   
    errorGuardar: crear.error?.message ?? actualizar.error?.message ?? inventario.error?.message  ?? null,    
    errorEliminar: eliminar.error?.message ?? null,
    limpiarErrores: () => {
      crear.reset();
      actualizar.reset();
      inventario.reset();
      eliminar.reset();
    },
  };
}