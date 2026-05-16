import "./App.css";
import { ConfigProvider, Grid } from "antd";
import { theme } from "antd";
// import customTheme from "./antd.theme.json";
import { useEffect, useMemo, useState } from "react";
import { AuthContextProvider } from "./features/auth/providers/auth-context";
import Router from "./routes";
import locale from "antd/locale/pt_BR";
import { QueryClient, QueryClientProvider } from "react-query";
import { PageTitleProvider } from "./layouts/admin-layout/providers/page-title-context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 5 * 1000, // cache de 5 minutos para queries
    },
  },
});

const { useBreakpoint } = Grid;
function App() {
  const screens = useBreakpoint();
  const isMobile = !screens.md; // md breakpoint = 768px


  const [darkMode, setDarkMode] = useState(
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQueryList.onchange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    return () => {
      mediaQueryList.onchange = () => {
        /* */
      };
    };
  }, []);


const customTheme = useMemo(() => ({
  token: {
    // Cores principais
    colorPrimary: "#1677ff",
    colorPrimaryHover: "#4096ff",

    // Fundos
    colorBgBase: "#e3eef9",   
    colorBgContainer: "#ffffff", 
    colorBgElevated: isMobile ? "#f8fbfd" : "#e3eef9",

    // Texto e bordas
    colorTextBase: "#1a1a1a",
    colorTextSecondary: "#5c6b7a",
    colorBorder: "#c7d8ec",

    // Layout
    borderRadius: 8,
  },
}), [isMobile]);


  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          ...customTheme,
        }}
        locale={locale}
      >
        <AuthContextProvider>
          <PageTitleProvider>
            <Router />
          </PageTitleProvider>
        </AuthContextProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
