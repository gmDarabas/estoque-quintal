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

import { usePageTitle } from "../admin-layout/providers/page-title-context";
import { useTheme } from "@/contexts/theme-context";
import ErrorBoundary from "@/components/error-boundary/error-boundary";

const { Header, Sider } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

function SeedlingIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width={size} height={size} style={{ flexShrink: 0 }}>
      <path fill={color} d="M576 96C576 204.1 499.4 294.3 397.6 315.4C389.7 257.3 363.6 205 325.1 164.5C365.2 104 433.9 64 512 64L544 64C561.7 64 576 78.3 576 96zM64 160C64 142.3 78.3 128 96 128L128 128C251.7 128 352 228.3 352 352L352 544C352 561.7 337.7 576 320 576C302.3 576 288 561.7 288 544L288 384C164.3 384 64 283.7 64 160z" />
    </svg>
  );
}

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
          theme={{
            token: { colorPrimary: darkMode ? "#d97a52" : "#cf6438" },
            components: {
              Layout: {
                siderBg: darkMode ? "#141414" : "#fdfaf7",
                triggerBg: darkMode ? "#1f1f1f" : "#f0e8e0",
                triggerColor: darkMode ? "rgba(255,255,255,0.45)" : "#cf6438",
              },
              Menu: {
                itemBg: "transparent",
                subMenuItemBg: "transparent",
                itemColor: darkMode ? "rgba(255,255,255,0.65)" : undefined,
                itemHoverColor: darkMode ? "rgba(255,255,255,0.85)" : undefined,
              },
            },
          }}
        >
          <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            breakpoint="lg"
          >
            {/* Brand / Logo */}
            <div
              style={{
                height: 56,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 8px",
                borderBottom: `1px solid ${siderBorderColor}`,
                overflow: "hidden",
              }}
            >
              <SeedlingIcon color={darkMode ? "#7fb069" : "#2d5016"} size={28} />

              {!collapsed && (
                <div style={{ position: "absolute", right: 8 }}>
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
                    }}
                  />
                </Tooltip>
                </div>
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
