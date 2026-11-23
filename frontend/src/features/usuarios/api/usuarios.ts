import { api } from "@/shared/api/axiosInstance";
import type { Usuario } from "@/features/auth";

const BASE = "/admin/usuarios";

export async function listarUsuarios(): Promise<Usuario[]> {
  const { data } = await api.get<Usuario[]>(BASE);
  return data;
}

export async function activarUsuario(id: number): Promise<Usuario> {
  const { data } = await api.post<Usuario>(`${BASE}/${id}/activar`);
  return data;
}

export async function desactivarUsuario(id: number): Promise<Usuario> {
  const { data } = await api.post<Usuario>(`${BASE}/${id}/desactivar`);
  return data;
}