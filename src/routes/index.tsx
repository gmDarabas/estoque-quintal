import { HashRouter, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthContext } from "../features/auth/providers/auth-context";
import { AuthRoutes } from "./auth-routes";
import AdminRoutes from "./admin-routes";
import { supabase } from "../supabaseClient";

function RecoveryHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/reset-password");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
}

export default function Router() {
  const { authContext } = useAuthContext();
  const estaLogado = !!authContext;

  const getRoutes = () => {
    if (estaLogado) return [AdminRoutes()];
    return [AuthRoutes()];
  };

  return (
    <HashRouter>
      <RecoveryHandler />
      <Routes>{...getRoutes()}</Routes>
    </HashRouter>
  );
}
