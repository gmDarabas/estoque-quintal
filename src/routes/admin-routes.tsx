import { Route } from "react-router-dom";
import AdminLayout from "../layouts/admin-layout/admin-layout";
import {
  AppstoreOutlined,
  BarChartOutlined,
  FallOutlined,
  FilePdfOutlined,
  HomeOutlined,
  LogoutOutlined,
  ReconciliationOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  TableOutlined,
  TagsOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import NotFoundRedirect from "./not-found-redirect";
import HomePage from "@/features/admin/home/home-page";
import { Logout } from "@/features/auth/logout";
import type { ItemType } from "antd/es/menu/interface";
import PageProdutos from "@/features/admin/produtos/page-produtos";
import PageCadastroProduto from "@/features/admin/produtos/page-cadastro-produto";
import PageMovimentacoes from "@/features/admin/movimentacoes/page-movimentacoes";
import PageCadastroMovimentacao from "@/features/admin/movimentacoes/page-cadastro-movimentacao";
import PageInventarios from "@/features/admin/inventarios/page-inventarios";
import PageCadastroInventario from "@/features/admin/inventarios/page-cadastro-inventario";
import PageInventario from "@/features/admin/inventarios/page-inventario";
import PageVendas from "@/features/admin/vendas/page-vendas";
import PageCadastroVenda from "@/features/admin/vendas/page-cadastro-venda";
import PageOrcamento from "@/features/admin/orcamentos/page-orcamento";
import PagePosicaoEstoque from "@/features/admin/relatorios/page-posicao-estoque";
import PageEstoqueMinimo from "@/features/admin/relatorios/page-estoque-minimo";
import PagePerdas from "@/features/admin/relatorios/page-perdas";
import PageFornecedores from "@/features/admin/fornecedores/page-fornecedores";
import PageCadastroFornecedor from "@/features/admin/fornecedores/page-cadastro-fornecedor";
import PageCategorias from "@/features/admin/categorias/page-categorias";
import PageCadastroCategoria from "@/features/admin/categorias/page-cadastro-categoria";

const menuItens: ItemType[] = [
  { key: "/home", label: "Home", icon: <HomeOutlined /> },
  { key: "/produtos", label: "Produtos", icon: <AppstoreOutlined /> },
  { key: "/fornecedores", label: "Fornecedores", icon: <ShopOutlined /> },
  { key: "/categorias", label: "Categorias", icon: <TagsOutlined /> },
  {
    key: "movimentacoes",
    label: "Movimentações",
    icon: <SwapOutlined />,
    children: [
      {
        key: "/movimentacoes",
        label: "Todas movimentações",
        icon: <SwapOutlined />,
      },
      { key: "/vendas", label: "Vendas", icon: <ShoppingCartOutlined /> },
      {
        key: "/inventarios",
        label: "Inventário",
        icon: <ReconciliationOutlined />,
      },
    ],
  },
  { key: "/orcamentos", label: "Orçamentos", icon: <FilePdfOutlined /> },
  {
    key: "relatorios",
    label: "Relatórios",
    icon: <BarChartOutlined />,
    children: [
      {
        key: "/posicao-estoque",
        label: "Posição de Estoque",
        icon: <TableOutlined />,
      },
      {
        key: "/estoque-minimo",
        label: "Estoque Mínimo",
        icon: <WarningOutlined />,
      },
      { key: "/perdas", label: "Perdas", icon: <FallOutlined /> },
    ],
  },
  { key: "/logout", label: "Log Out", icon: <LogoutOutlined /> },
];

export default function AdminRoutes() {
  return (
    <Route element={<AdminLayout menuItens={menuItens} />}>
      <Route path="home" element={<HomePage />} />
      <Route path="produtos" element={<PageProdutos />} />
      <Route path="produto/cadastrar" element={<PageCadastroProduto />} />
      <Route path="produto/:id" element={<PageCadastroProduto />} />
      <Route path="fornecedores" element={<PageFornecedores />} />
      <Route path="fornecedor/cadastrar" element={<PageCadastroFornecedor />} />
      <Route path="fornecedor/:id" element={<PageCadastroFornecedor />} />
      <Route path="categorias" element={<PageCategorias />} />
      <Route path="categoria/cadastrar" element={<PageCadastroCategoria />} />
      <Route path="categoria/:id" element={<PageCadastroCategoria />} />
      <Route path="movimentacoes" element={<PageMovimentacoes />} />
      <Route
        path="movimentacao/cadastrar"
        element={<PageCadastroMovimentacao />}
      />
      <Route path="vendas" element={<PageVendas />} />
      <Route path="venda/cadastrar" element={<PageCadastroVenda />} />
      <Route path="inventarios" element={<PageInventarios />} />
      <Route path="inventario/cadastrar" element={<PageCadastroInventario />} />
      <Route path="inventario/:id" element={<PageInventario />} />
      <Route path="orcamentos" element={<PageOrcamento />} />
      <Route path="posicao-estoque" element={<PagePosicaoEstoque />} />
      <Route path="estoque-minimo" element={<PageEstoqueMinimo />} />
      <Route path="perdas" element={<PagePerdas />} />
      <Route path="logout" element={<Logout />} />
      <Route path="*" element={<NotFoundRedirect to="/home" />} />
    </Route>
  );
}
