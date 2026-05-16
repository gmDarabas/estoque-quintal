import { HashRouter, Routes } from "react-router-dom";
import { useAuthContext } from "../features/auth/providers/auth-context";
import { AuthRoutes } from "./auth-routes";
import AdminRoutes from "./admin-routes";

export default function Router() {
  const { authContext } = useAuthContext();
  const estaLogado = !!authContext;

  const getRoutes = () => {
    if (estaLogado) return [AdminRoutes()];

    return [AuthRoutes()];
  };

  return (
    <HashRouter>
      <Routes>{...getRoutes()}</Routes>
    </HashRouter>
  );
}
