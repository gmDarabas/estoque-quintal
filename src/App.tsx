import "./App.css";
import { ConfigProvider } from "antd";
import ErrorBoundary from "./components/error-boundary/error-boundary";

import { theme } from "antd";
import { AuthContextProvider } from "./features/auth/providers/auth-context";
import Router from "./routes";
import locale from "antd/locale/pt_BR";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, useTheme } from "./contexts/theme-context";
import { PageTitleProvider } from "./layouts/admin-layout/providers/page-title-context";
import { ConfirmProvider } from "./lib/use-confirm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 5 * 1000,
    },
  },
});

const lightTheme = {
  token: {
    colorPrimary: "#4f46e5",
    colorBgBase: "#f0f2f5",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgLayout: "#f0f2f5",
    colorTextBase: "#1f2937",
    colorBorder: "#dde3ec",
    colorBorderSecondary: "#eaeff5",
    colorFillAlter: "#f3f6fa", // header de tabelas, collapse, etc.
    colorFillContent: "#edf1f7",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Table: {
      headerBg: "#edf2f7",
      headerColor: "#374151",
      headerSplitColor: "#dde3ec",
      borderColor: "#dde3ec",
      rowHoverBg: "#f5f3ff",
    },
    Card: {
      headerBg: "#f7f9fc",
    },
    Layout: {
      siderBg: "#ffffff",
      triggerBg: "#f0f4f8",
      triggerColor: "#5a6a7e",
    },
    Menu: {
      itemBg: "transparent",
      subMenuItemBg: "transparent",
    },
  },
};

const darkTheme = {
  token: {
    colorPrimary: "#6366f1",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Table: {
      rowHoverBg: "rgba(59,130,246,0.06)",
    },
  },
};

function ThemedApp() {
  const { darkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        ...(darkMode ? darkTheme : lightTheme),
      }}
      locale={locale}
    >
      <AuthContextProvider>
        <PageTitleProvider>
          <ConfirmProvider>
            <Router />
          </ConfirmProvider>
        </PageTitleProvider>
      </AuthContextProvider>
    </ConfigProvider>
  );
}

const rootFallback = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      gap: 16,
      fontFamily: "sans-serif",
      color: "#1f2937",
    }}
  >
    <h2 style={{ margin: 0 }}>Algo deu errado</h2>
    <p style={{ margin: 0, color: "#6b7280" }}>
      Recarregue a página para tentar novamente.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: "8px 20px",
        borderRadius: 8,
        border: "none",
        background: "#4f46e5",
        color: "#fff",
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      Recarregar
    </button>
  </div>
);

function App() {
  return (
    <ErrorBoundary fallback={rootFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
