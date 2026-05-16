import { theme } from "antd";
import { ReactNode } from "react";
import { PageContainer } from "@ant-design/pro-components";

type Props = {
  children: ReactNode;
};

export default function DefaultPageContainer({ children }: Props) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <PageContainer
      style={{
        background: colorBgContainer,
        borderRadius: "5px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        border: "1px solid rgba(199, 216, 236, 0.6)",
        padding: "0px !important",
      }}
      childrenContentStyle={{ padding: "16px 24px" }}
    >
      {children}
    </PageContainer>
  );
}
