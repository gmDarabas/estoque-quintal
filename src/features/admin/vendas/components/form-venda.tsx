import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  notification,
  theme,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateVenda } from "../api/create";
import { ProdutoSelectOption } from "../../produtos/api/list-select";
import SelectProduto from "../../produtos/components/select-produto";
import { displayMoney } from "@/lib/utils";
import ItensCarrinho, { CartItem } from "./itens-carrinho";

const { Text } = Typography;

/** Preço de venda sugerido a partir do custo atual e da margem do produto. */
function precoSugerido(produto: ProdutoSelectOption): number {
  if (produto.preco_custo_atual == null || produto.margem == null) return 0;
  const preco = produto.preco_custo_atual * (1 + produto.margem / 100);
  return Math.round(preco * 100) / 100;
}

export default function FormVenda() {
  const navigate = useNavigate();
  const createVenda = useCreateVenda();
  const { token } = theme.useToken();

  const [step, setStep] = useState<0 | 1>(0);
  const [data, setData] = useState<Dayjs>(dayjs());
  const [observacao, setObservacao] = useState<string>("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [salvando, setSalvando] = useState(false);

  const total = items.reduce(
    (s, it) => s + it.quantidade * it.preco_venda_unitario,
    0,
  );

  const itensSemEstoque = items.filter(
    (it) => it.quantidade > it.estoque_disponivel,
  );
  const temItemSemEstoque = itensSemEstoque.length > 0;

  const handleAddProduto = (produto: ProdutoSelectOption | null) => {
    if (!produto) return;
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.produto_id === produto.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantidade: copy[idx].quantidade + 1 };
        return copy;
      }
      return [
        ...prev,
        {
          produto_id: produto.id,
          nome: produto.nome,
          unidade: produto.unidade,
          codigo: produto.codigo,
          quantidade: 1,
          preco_venda_unitario: precoSugerido(produto),
          estoque_disponivel: produto.quantidade_atual,
        },
      ];
    });
  };

  const handleChangeItem = (index: number, patch: Partial<CartItem>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );

  const handleRemove = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const handleContinuar = () => {
    if (items.length === 0) {
      notification.warning({ message: "Adicione ao menos um item à venda" });
      return;
    }
    if (temItemSemEstoque) {
      notification.error({
        message: "Quantidade acima do estoque",
        description: `Ajuste a quantidade de: ${itensSemEstoque
          .map((it) => it.nome)
          .join(", ")}`,
      });
      return;
    }
    setStep(1);
  };

  const handleRegistrar = async () => {
    if (temItemSemEstoque) {
      notification.error({
        message: "Quantidade acima do estoque",
        description: `Ajuste a quantidade de: ${itensSemEstoque
          .map((it) => it.nome)
          .join(", ")}`,
      });
      return;
    }
    setSalvando(true);
    try {
      await createVenda({
        data: data.toISOString(),
        observacao: observacao || null,
        itens: items.map((i) => ({
          produto_id: i.produto_id,
          quantidade: i.quantidade,
          preco_venda_unitario: i.preco_venda_unitario,
        })),
      });
      navigate("/vendas");
    } finally {
      setSalvando(false);
    }
  };

  const stickyBar = (children: React.ReactNode) => (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        marginTop: 16,
        paddingTop: 12,
        paddingBottom: 12,
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        zIndex: 10,
      }}
    >
      <div>
        <Text type="secondary" style={{ fontSize: 12, display: "block" }}>
          Total
        </Text>
        <Text strong style={{ fontSize: 22, color: token.colorPrimary }}>
          {displayMoney(total) || "R$ 0,00"}
        </Text>
      </div>
      {children}
    </div>
  );

  return (
    <>
      {step === 0 ? (
        <>
          <div style={{ marginBottom: 24 }}>
            <SelectProduto
              value={null}
              onSelect={handleAddProduto}
              placeholder="🔍 Buscar produto para adicionar"
            />
          </div>

          <div className="my-8">
            <ItensCarrinho
              items={items}
              onChangeItem={handleChangeItem}
              onRemove={handleRemove}
            />
          </div>

          {stickyBar(
            <Button
              type="primary"
              size="large"
              disabled={items.length === 0 || temItemSemEstoque}
              onClick={handleContinuar}
              style={{ height: 52, fontSize: 16, paddingInline: 28 }}
            >
              Continuar
            </Button>,
          )}
        </>
      ) : (
        <>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setStep(0)}
            style={{ marginBottom: 8, paddingLeft: 0 }}
          >
            Voltar aos produtos
          </Button>

          {/* Recap dos itens (somente leitura) */}
          <div style={{ marginBottom: 8 }}>
            {items.map((it) => (
              <div
                key={it.produto_id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "6px 0",
                }}
              >
                <Text>
                  {it.quantidade} × {it.nome}
                </Text>
                <Text strong>
                  {displayMoney(it.quantidade * it.preco_venda_unitario) ||
                    "R$ 0,00"}
                </Text>
              </div>
            ))}
          </div>

          <Divider style={{ margin: "8px 0 16px" }} />

          <Text type="secondary">Data da venda</Text>
          <DatePicker
            format="DD/MM/YYYY"
            size="large"
            style={{ width: "100%", marginTop: 4, marginBottom: 16 }}
            value={data}
            onChange={(d) => d && setData(d)}
            allowClear={false}
          />

          <Text type="secondary">Observação (opcional)</Text>
          <Input.TextArea
            rows={2}
            style={{ marginTop: 4 }}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
          />

          {stickyBar(
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              loading={salvando}
              disabled={temItemSemEstoque}
              onClick={handleRegistrar}
              style={{ height: 52, fontSize: 16, paddingInline: 28 }}
            >
              Finalizar venda
            </Button>,
          )}
        </>
      )}
    </>
  );
}
