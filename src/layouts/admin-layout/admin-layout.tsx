import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/providers/auth-context";
import BaseLayout, { LayoutProps } from "../base-layout/base-layout";

function AdminLayout(props: LayoutProps) {
  const navigate = useNavigate();
  const { authContext } = useAuthContext();

  if (!authContext) {
    notification.error({ message: "É preciso estar logado para acessar esta área" });
    navigate("/login");
  }

  return <BaseLayout {...props} />;
}

export default AdminLayout;
