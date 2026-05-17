import { Route, Navigate } from "react-router-dom";
import Login from "../features/auth/login-page";
import ResetPassword from "../features/auth/reset-password-page";
import AuthLayout from "../layouts/auth-layout/auth-layout";
export function AuthRoutes() {
  return (
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>
  );
}
