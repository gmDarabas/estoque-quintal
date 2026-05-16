import { Route, Navigate } from "react-router-dom";
import Login from "../features/auth/login-page";
import AuthLayout from "../layouts/auth-layout/auth-layout";
import Cadastro from "@/features/auth/cadastro-page";

export function AuthRoutes() {
  return (
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastre-se" element={<Cadastro />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>
  );
}
