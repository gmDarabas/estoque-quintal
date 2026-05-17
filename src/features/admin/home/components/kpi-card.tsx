import { Card, Skeleton, Statistic } from "antd";

type KpiCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
  loading?: boolean;
};

export default function KpiCard({
  title,
  value,
  icon,
  color,
  onClick,
  loading,
}: KpiCardProps) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {loading ? (
        <Skeleton active paragraph={false} />
      ) : (
        <Statistic
          title={
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {icon}
              {title}
            </span>
          }
          value={value}
          valueStyle={color ? { color } : undefined}
        />
      )}
    </Card>
  );
}
