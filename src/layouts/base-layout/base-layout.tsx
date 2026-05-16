import { Grid, Layout, Menu, theme, Typography } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import MenuDrawer from "@/components/menu-drawer/menu-drawer";
import { useState } from "react";
import { usePageTitle } from "../admin-layout/providers/page-title-context";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MenuItemType } from "antd/es/menu/interface";

const { Header, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;
export interface LayoutProps {
  menuItens: Array<MenuItemType>;
}

function BaseLayout({ menuItens }: LayoutProps) {
  const navigate = useNavigate();
  const { pageTitle, showBack } = usePageTitle();
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const screens = useBreakpoint();
  const isMobile = screens.xs;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider
          theme={"light"}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
        >
          <Menu mode="inline" onSelect={({ key }) => navigate(key)} items={menuItens} />
        </Sider>
      )}

      <Layout>
        {isMobile && (
          <Header
            style={{
              backgroundColor: "#ffffff", // contraste com fundo azul
              borderBottom: "1px solid rgba(199, 216, 236, 0.6)", // mesma borda dos containers
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)", // leve sombra
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
            }}
          >
            {
              showBack
                ? <ArrowLeftOutlined size={32} onClick={() => navigate(-1)} className="mx-4 text-lg cursor-pointer" />
                : <MenuDrawer menuItens={menuItens} />}

            <Title
              level={4}
              ellipsis={{
                tooltip: pageTitle,
              }}
              style={{
                margin: 0,
                fontWeight: "bold",
                flex: 1,
              }}
            >{pageTitle}</Title>
          </Header>
        )}


        <Layout style={{ backgroundColor: isMobile ? token.colorBgElevated : "" }}>
          <Content style={{ margin: "16px" }}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default BaseLayout;
