import { Card, Flex, Progress, Skeleton, Typography } from "antd";
import { EstoquePorCategoria } from "../api/dashboard";
import { displayMoney } from "@/lib/utils";

const COLORS = [
  "#4f46e5", "#0891b2", "#059669", "#d97706",
  "#dc2626", "#7c3aed", "#db2777", "#65a30d",
];

type Props = {
  data: EstoquePorCategoria[] | undefined;
  loading: boolean;
};

export default function EstoquePorCategoriaCard({ data, loading }: Props) {
  return (
    <Card title="Estoque por Categoria" style={{ marginTop: 16 }}>
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : !data?.length ? (
        <Typography.Text type="secondary">Nenhum dado disponível.</Typography.Text>
      ) : (
        <Flex vertical gap={12}>
          {data.map((item, i) => (
            <div key={item.categoria}>
              <Flex justify="space-between" style={{ marginBottom: 2 }}>
                <Typography.Text strong>{item.categoria}</Typography.Text>
                <Flex gap={16}>
                  <Typography.Text type="secondary">
                    {item.qtdProdutos} produto{item.qtdProdutos !== 1 ? "s" : ""}
                  </Typography.Text>
                  <Typography.Text>{displayMoney(item.valorTotal)}</Typography.Text>
                </Flex>
              </Flex>
              <Progress
                percent={parseFloat(item.percentual.toFixed(1))}
                strokeColor={COLORS[i % COLORS.length]}
                size="small"
                format={(p) => `${p}%`}
              />
            </div>
          ))}
        </Flex>
      )}
    </Card>
  );
}
