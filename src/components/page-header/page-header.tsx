import { ReactNode } from "react";
import { Button, Flex, Grid, Space } from "antd";
import Title from "antd/es/typography/Title";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { usePageTitle } from "@/layouts/admin-layout/providers/page-title-context";

const { useBreakpoint } = Grid;

type Props = {
  title?: string | ReactNode;
  extra?: ReactNode | ReactNode[];
  onBack?: () => void;
  children?: ReactNode;
};

export default function DefaultPageHeader({
  title,
  extra,
  onBack,
  children,
}: Props) {
  usePageTitle(typeof title === "string" ? title : undefined, !!onBack);

  const screens = useBreakpoint();
  const isMobile = screens.xs;

  return (
    <Flex
      justify={isMobile ? "flex-end" : "space-between"}
      align="center"
      style={{ marginBottom: 16, padding: "0 4px" }}
    >
      {!isMobile && (
        <Flex align="center" gap={8}>
          {onBack && (
            <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack} />
          )}
          <Title level={2} style={{ marginBottom: 0 }}>
            {title}
          </Title>
        </Flex>
      )}
      <Space>{extra}</Space>
      {children}
    </Flex>
  );
}
