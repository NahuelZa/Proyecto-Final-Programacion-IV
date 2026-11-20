import { api } from "@/shared/api/axiosInstance";
import type { RegistroPayload, Usuario } from "@/features/auth/types/auth.types";

const AUTH = "/auth";

/**
 * Login con OAuth2 Password Flow.
 *
 * El backend responde con `Set-Cookie: access_token=...; HttpOnly; SameSite=Lax`.
 * El navegador almacena la cookie y la envía automáticamente en cada request
 * siguiente gracias al `withCredentials` de la instancia.
 */
export async function requestLogin(
  username: string,
  password: string,
): Promise<void> {
  const body = new URLSearchParams({ username, password });
  await api.post(`${AUTH}/token`, body);
}

export async function requestRegister(
  payload: RegistroPayload,
): Promise<Usuario> {
  const { data } = await api.post<Usuario>(`${AUTH}/register`, payload);
  return data;
}

/**
 * Rehidrata el estado de autenticación leyendo el usuario desde el backend.
 *
 * No recibe el token: el navegador lo envía automáticamente vía cookie
 * httpOnly. Si la cookie es válida → 200 con el usuario. Si no → 401.
 */
export async function requestMe(): Promise<Usuario> {
  const { data } = await api.get<Usuario>(`${AUTH}/me`);
  return data;
}

/** Le pide al backend que invalide la cookie httpOnly. */
export async function requestLogout(): Promise<void> {
  await api.post(`${AUTH}/logout`);
}