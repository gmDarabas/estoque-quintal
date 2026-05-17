import { useState, createContext, useContext, useEffect } from "react";

interface PageTitleContextType {
  pageTitle?: string;
  showBack?: boolean;
  setPageTitle: (pageTitle: string | undefined) => void;
  setShowBack: (showBack?: boolean) => void;
}

const PageTitleContext = createContext<PageTitleContextType | undefined>(
  undefined,
);

export function PageTitleProvider(props: any) {
  const [pageTitle, setPageTitle] = useState<string | undefined>();
  const [showBack, setShowBack] = useState<boolean>(false);

  return (
    <PageTitleContext.Provider
      value={{ pageTitle, setPageTitle, showBack, setShowBack }}
      {...props}
    />
  );
}

export function usePageTitle(title?: string, showBack: boolean = false) {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error(`useAuthContext must be used within a AuthContextProvider`);
  }

  useEffect(() => {
    context.setPageTitle(title);
    context.setShowBack(showBack);
  }, [title, showBack]);

  return context;
}
