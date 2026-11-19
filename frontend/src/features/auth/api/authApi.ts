import type {
  LoginPayload,
  MensajeRespuesta,
  RegistroPayload,
  Usuario,
} from "@/features/auth/types/auth.types";
import { axiosInstance } from "@/shared/api/axiosInstance";

export async function login(datos: LoginPayload): Promise<MensajeRespuesta> {
  const formulario = new URLSearchParams({
    username: datos.username,
    password: datos.password,
  });
  const { data } = await axiosInstance.post<MensajeRespuesta>("/auth/token", formulario);
  return data;
}

export async function registrar(datos: RegistroPayload): Promise<Usuario> {
  const { data } = await axiosInstance.post<Usuario>("/auth/register", datos);
  return data;
}

export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

export async function obtenerPerfil(): Promise<Usuario> {
  const { data } = await axiosInstance.get<Usuario>("/auth/me");
  return data;
}