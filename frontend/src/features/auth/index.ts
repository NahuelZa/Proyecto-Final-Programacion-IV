export { useAuth } from "./hooks/useAuth";
export { LoginPage } from "./pages/LoginPage";
export { RegisterPage } from "./pages/RegisterPage";
export { UnauthorizedPage } from "./pages/UnauthorizedPage";
export type { RegistroPayload, Rol, Usuario } from "./types/auth.types";
// Los archivos de api/ no se exportan: son un detalle interno de la feature.