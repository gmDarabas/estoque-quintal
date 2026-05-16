import { Route } from "react-router-dom";
import AdminLayout from "../layouts/admin-layout/admin-layout";
import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import NotFoundRedirect from "./not-found-redirect";
import HomePage from "@/features/admin/home/home-page";
import { Logout } from "@/features/auth/logout";
import { MenuItemType } from "antd/es/menu/interface";
import PageProdutos from "@/features/admin/produtos/page-produtos";
import PageCadastroProduto from "@/features/admin/produtos/page-cadastro-produto";

const menuItens: MenuItemType[] = [
  { key: "/home", label: "Home", icon: <HomeOutlined /> },
  { key: "/produtos", label: "Produtos", icon: <AppstoreOutlined /> },
  { key: "/logout", label: "Log Out", icon: <LogoutOutlined /> },
];

export default function AdminRoutes() {
  return (
    <Route element={<AdminLayout menuItens={menuItens} />}>
      <Route path="home" element={<HomePage />} />
      <Route path="produtos" element={<PageProdutos />} />
      <Route path="produto/cadastrar" element={<PageCadastroProduto />} />
      <Route path="produto/:id" element={<PageCadastroProduto />} />
      <Route path="logout" element={<Logout />} />
      <Route path="*" element={<NotFoundRedirect to="/home" />} />
    </Route>
  );
}
