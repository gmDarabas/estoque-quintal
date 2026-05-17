import { theme } from "antd";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DefaultPageContainer({ children }: Props) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  return (
    <div
      style={{
        background: colorBgContainer,
        borderRadius: "5px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
        border: `1px solid ${colorBorderSecondary}`,
        padding: "16px 24px",
      }}
    >
      {children}
    </div>
  );
}
