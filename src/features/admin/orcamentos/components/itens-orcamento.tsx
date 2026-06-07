import { Button, Card, Empty, Input, InputNumber, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { displayMoney } from "@/lib/utils";
import { OrcamentoItem } from "../types";

const { Text } = Typography;

const subtotal = (it: OrcamentoItem) =>
  (it.quantidade || 0) * (it.valor_unitario || 0);

type Props = {
  items: OrcamentoItem[];
  onChangeItem: (index: number, patch: Partial<OrcamentoItem>) => void;
  onRemove: (index: number) => void;
};

export default function ItensOrcamento({
  items,
  onChangeItem,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <Empty
        description="Busque um produto ou adicione uma linha avulsa"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: "24px 0" }}
      />
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <Card
          key={item.key}
          size="small"
          style={{ marginBottom: 10, borderRadius: 10 }}
        >
          {/* Descrição (editável) + remover */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Input
              value={item.descricao}
              placeholder="Descrição do item"
              onChange={(e) => onChangeItem(index, { descricao: e.target.value })}
              style={{ flex: 1 }}
            />
            <Button
              danger
              type="text"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => onRemove(index)}
              aria-label="Remover item"
            />
          </div>

          {/* Qtd + valor unitário + subtotal */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Qtd
              </Text>
              <InputNumber
                min={0}
                step={1}
                value={item.quantidade}
                onChange={(v) => onChangeItem(index, { quantidade: v ?? 0 })}
                style={{ width: 80 }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Valor un.
              </Text>
              <InputNumber
                min={0}
                step={0.01}
                precision={2}
                prefix="R$"
                value={item.valor_unitario}
                onChange={(v) => onChangeItem(index, { valor_unitario: v ?? 0 })}
                style={{ width: 120 }}
              />
            </div>

            <div style={{ textAlign: "right" }}>
              <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
                Subtotal
              </Text>
              <Text strong>{displayMoney(subtotal(item)) || "R$ 0,00"}</Text>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
