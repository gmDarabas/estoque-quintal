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
    colorPrimary: "#cf6438",
    colorBgBase: "#faf7f4",
    colorBgContainer: "#fdfaf7",
    colorBgElevated: "#fdfaf7",
    colorBgLayout: "#f5ede7",
    colorTextBase: "#1f2937",
    colorBorder: "#ddd5cc",
    colorBorderSecondary: "#eae0da",
    colorFillAlter: "#f3ede8",
    colorFillContent: "#ebe0d9",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Table: {
      headerBg: "#e8f0e0",
      headerColor: "#2d5016",
      headerSplitColor: "#d0e0c4",
      borderColor: "#ddd5cc",
      rowHoverBg: "#fdf0e8",
    },
    Card: {
      headerBg: "#f5ede8",
    },
    Layout: {
      siderBg: "#fdfaf7",
      triggerBg: "#f0e8e0",
      triggerColor: "#cf6438",
    },
    Menu: {
      itemBg: "transparent",
      subMenuItemBg: "transparent",
    },
  },
};

const darkTheme = {
  token: {
    colorPrimary: "#d97a52",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
  components: {
    Table: {
      rowHoverBg: "rgba(207,100,56,0.08)",
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
        background: "#cf6438",
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
