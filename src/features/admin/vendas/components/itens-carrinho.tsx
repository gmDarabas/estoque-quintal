import { Button, Card, Empty, InputNumber, Typography } from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { displayMoney } from "@/lib/utils";

const { Text } = Typography;

export type CartItem = {
  produto_id: string;
  codigo?: string;
  nome: string;
  unidade: string;
  quantidade: number;
  preco_venda_unitario: number;
  estoque_disponivel: number;
};

type Props = {
  items: CartItem[];
  onChangeItem: (index: number, patch: Partial<CartItem>) => void;
  onRemove: (index: number) => void;
};

const subtotal = (item: CartItem) =>
  (item.quantidade || 0) * (item.preco_venda_unitario || 0);

function ItemCard({
  item,
  onChange,
  onRemove,
}: {
  item: CartItem;
  onChange: (patch: Partial<CartItem>) => void;
  onRemove: () => void;
}) {
  const excedeEstoque = item.quantidade > item.estoque_disponivel;

  const alterarQtd = (delta: number) => {
    const nova = Math.round((item.quantidade + delta) * 100) / 100;
    if (nova >= 1) onChange({ quantidade: nova });
  };

  const displayDescricao = () => {
    const codigo = item.codigo ? ` - ${item.codigo}` : "";
    return item.nome + codigo;
  };

  return (
    <Card size="small" style={{ marginBottom: 10, borderRadius: 10 }}>
      {/* Nome + remover */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <Text strong style={{ fontSize: 16, lineHeight: 1.3 }}>
          {displayDescricao()}
        </Text>
        <Button
          danger
          type="text"
          shape="circle"
          size="large"
          icon={<DeleteOutlined />}
          onClick={onRemove}
          aria-label="Remover item"
        />
      </div>

      {/* Aviso só quando a quantidade ultrapassa o estoque */}
      {excedeEstoque && (
        <Text
          type="danger"
          style={{ fontSize: 12, display: "block", marginTop: 2 }}
        >
          Estoque insuficiente — disponível: {item.estoque_disponivel}{" "}
          {item.unidade}
        </Text>
      )}

      {/* Preço unitário (sempre editável) */}
      <div
        style={{
          marginTop: 2,
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Text type="secondary" style={{ fontSize: 13 }}>
          Preço un.
        </Text>
        <InputNumber
          style={{ width: 130 }}
          size="large"
          min={0}
          step={0.01}
          precision={2}
          prefix="R$"
          value={item.preco_venda_unitario}
          onChange={(v) => onChange({ preco_venda_unitario: v ?? 0 })}
        />
      </div>

      {/* Stepper de quantidade + subtotal */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button
            shape="circle"
            size="large"
            icon={<MinusOutlined />}
            onClick={() => alterarQtd(-1)}
            disabled={item.quantidade <= 1}
            aria-label="Diminuir quantidade"
          />
          <InputNumber
            value={item.quantidade}
            min={0.01}
            step={1}
            controls={false}
            size="large"
            status={excedeEstoque ? "error" : undefined}
            style={{ width: 64, textAlign: "center" }}
            onChange={(v) => onChange({ quantidade: v ?? 1 })}
          />
          <Button
            shape="circle"
            size="large"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => alterarQtd(1)}
            aria-label="Aumentar quantidade"
          />
        </div>

        <div style={{ textAlign: "right" }}>
          <Text type="secondary" style={{ fontSize: 11, display: "block" }}>
            Subtotal
          </Text>
          <Text strong style={{ fontSize: 16 }}>
            {displayMoney(subtotal(item)) || "R$ 0,00"}
          </Text>
        </div>
      </div>
    </Card>
  );
}

export default function ItensCarrinho({
  items,
  onChangeItem,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <Empty
        description="Busque um produto acima para começar a venda"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ margin: "32px" }}
      />
    );
  }

  return (
    <div>
      {items.map((item, index) => (
        <ItemCard
          key={item.produto_id}
          item={item}
          onChange={(patch) => onChangeItem(index, patch)}
          onRemove={() => onRemove(index)}
        />
      ))}
    </div>
  );
}
