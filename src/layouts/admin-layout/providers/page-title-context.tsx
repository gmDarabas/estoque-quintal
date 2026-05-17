import { useState, createContext, useContext, useLayoutEffect } from "react";

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

export function usePageTitleContext() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error(`usePageTitleContext must be used within a PageTitleProvider`);
  }
  return context;
}

export function usePageTitle(title?: string, showBack: boolean = false) {
  const context = usePageTitleContext();
  const { setPageTitle, setShowBack } = context;

  useLayoutEffect(() => {
    setPageTitle(title);
    setShowBack(showBack);
    return () => {
      setPageTitle(undefined);
      setShowBack(false);
    };
  }, [title, showBack, setPageTitle, setShowBack]);

  return context;
}
