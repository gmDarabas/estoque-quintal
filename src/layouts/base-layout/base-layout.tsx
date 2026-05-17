import {
  Button,
  ConfigProvider,
  Grid,
  Layout,
  Menu,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import MenuDrawer from "@/components/menu-drawer/menu-drawer";
import { useState } from "react";

import {
  ArrowLeftOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import type { ItemType } from "antd/es/menu/interface";
import logo from "/public/wrench.png";
import { usePageTitle } from "../admin-layout/providers/page-title-context";
import { useTheme } from "@/contexts/theme-context";
import ErrorBoundary from "@/components/error-boundary/error-boundary";

const { Header, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

export interface LayoutProps {
  menuItens: Array<ItemType>;
}

function BaseLayout({ menuItens }: LayoutProps) {
  const navigate = useNavigate();
  const { pageTitle, showBack } = usePageTitle();
  const { token } = theme.useToken();
  const { darkMode, toggleDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const screens = useBreakpoint();
  const isMobile = screens.xs;

  const siderBorderColor = darkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <ConfigProvider
          theme={{ token: { colorPrimary: darkMode ? "#6366f1" : "#4f46e5" } }}
        >
          <Sider
            theme={darkMode ? "dark" : "light"}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            breakpoint="lg"
          >
            {/* Brand / Logo */}
            <div
              style={{
                height: 56,
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "space-between",
                padding: collapsed ? "0 8px" : "0 16px 0 20px",
                borderBottom: `1px solid ${siderBorderColor}`,
                gap: 8,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{ width: 26, height: 26, flexShrink: 0 }}
                />
                {!collapsed && (
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: darkMode
                        ? "rgba(255,255,255,0.88)"
                        : token.colorTextBase,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    PFC System
                  </span>
                )}
              </div>

              {!collapsed && (
                <Tooltip
                  title={darkMode ? "Modo claro" : "Modo escuro"}
                  placement="right"
                >
                  <Button
                    type="text"
                    size="small"
                    icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleDarkMode}
                    style={{
                      color: darkMode
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.4)",
                      flexShrink: 0,
                    }}
                  />
                </Tooltip>
              )}
            </div>

            <Menu
              mode="inline"
              onSelect={({ key }) => navigate(key)}
              items={menuItens}
              style={{ borderRight: "none", paddingTop: 4 }}
            />
          </Sider>
        </ConfigProvider>
      )}

      <Layout>
        {isMobile && (
          <Header
            style={{
              backgroundColor: token.colorBgContainer,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: 8,
            }}
          >
            {showBack ? (
              <ArrowLeftOutlined
                onClick={() => navigate(-1)}
                style={{
                  fontSize: 18,
                  cursor: "pointer",
                  color: token.colorText,
                  flexShrink: 0,
                }}
              />
            ) : (
              <MenuDrawer menuItens={menuItens} />
            )}

            <Title
              level={4}
              ellipsis={{ tooltip: pageTitle }}
              style={{ margin: 0, fontWeight: 700, flex: 1 }}
            >
              {pageTitle}
            </Title>

            <Tooltip title={darkMode ? "Modo claro" : "Modo escuro"}>
              <Button
                type="text"
                icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleDarkMode}
                style={{ flexShrink: 0 }}
              />
            </Tooltip>
          </Header>
        )}

        <Layout style={{ backgroundColor: token.colorBgLayout }}>
          <Content style={{ margin: "16px" }}>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default BaseLayout;
