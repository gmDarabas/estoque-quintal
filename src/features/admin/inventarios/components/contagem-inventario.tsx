import { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Grid,
  Input,
  InputNumber,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import {
  CheckOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { Inventario, InventarioItemComProduto } from "../api/types";
import { STATUS_COLOR, STATUS_LABEL } from "./status";
import { useUpdateInventarioItem } from "../api/update-item";
import { useFecharInventario } from "../api/close";
import { useCancelarInventario } from "../api/cancel";
import { useConfirm } from "@/lib/use-confirm";
import "./contagem-inventario.css";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface Props {
  inventario: Inventario;
  itens: InventarioItemComProduto[];
}

type Counts = Record<string, number | null>;

const buildInitialCounts = (itens: InventarioItemComProduto[]): Counts =>
  itens.reduce<Counts>((acc, item) => {
    acc[item.id] = item.qtd_contada ?? null;
    return acc;
  }, {});

function renderDiferenca(esperada: number, contada: number | null) {
  if (contada == null) return <Text type="secondary">—</Text>;
  const diff = contada - esperada;
  if (diff === 0) return <Tag color="green">OK</Tag>;
  return <Tag color={diff > 0 ? "blue" : "red"}>{diff > 0 ? `+${diff}` : diff}</Tag>;
}

function ProdutoThumb({
  url,
  size = 32,
}: {
  url?: string | null;
  size?: number;
}) {
  return (
    <Avatar
      size={size}
      src={url ?? undefined}
      icon={!url && <ShoppingOutlined />}
      shape="square"
    />
  );
}

export default function ContagemInventario({ inventario, itens }: Props) {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const screens = useBreakpoint();

  const updateItem = useUpdateInventarioItem();
  const fecharInventario = useFecharInventario();
  const cancelarInventario = useCancelarInventario();

  const editavel = inventario.status === "aberto";

  const [counts, setCounts] = useState<Counts>(() => buildInitialCounts(itens));
  const [busca, setBusca] = useState("");

  const resumo = useMemo(() => {
    let contados = 0;
    let divergentes = 0;
    for (const item of itens) {
      const c = counts[item.id];
      if (c != null) {
        contados += 1;
        if (c !== item.qtd_esperada) divergentes += 1;
      }
    }
    return { total: itens.length, contados, divergentes };
  }, [itens, counts]);

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const ordenados = [...itens].sort((a, b) =>
      (a.produtos?.nome ?? "").localeCompare(b.produtos?.nome ?? ""),
    );
    if (!termo) return ordenados;
    return ordenados.filter((i) =>
      (i.produtos?.nome ?? "").toLowerCase().includes(termo),
    );
  }, [itens, busca]);

  const handleCountChange = (id: string, value: number | null) => {
    setCounts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (id: string) => {
    if (!editavel) return;
    updateItem({ id, qtd_contada: counts[id] ?? null });
  };

  const handleStep = (id: string, delta: number) => {
    if (!editavel) return;
    const next = Math.max(0, (counts[id] ?? 0) + delta);
    setCounts((prev) => ({ ...prev, [id]: next }));
    updateItem({ id, qtd_contada: next });
  };

  const handleFechar = () => {
    confirm({
      title: "Fechar inventário",
      description: `${resumo.divergentes} divergência(s) em ${resumo.contados} item(ns) contado(s) gerarão ajustes de estoque. Itens não contados serão ignorados. Esta ação não pode ser desfeita.`,
      okText: "Fechar inventário",
      onOk: async () => {
        await fecharInventario(inventario.id);
        navigate("/inventarios");
      },
    });
  };

  const handleCancelar = () => {
    confirm({
      danger: true,
      title: "Cancelar inventário",
      description:
        "O inventário será descartado sem gerar nenhum ajuste de estoque.",
      okText: "Cancelar inventário",
      cancelText: "Voltar",
      onOk: async () => {
        await cancelarInventario(inventario.id);
        navigate("/inventarios");
      },
    });
  };

  const columns: ColumnsType<InventarioItemComProduto> = [
    {
      title: "Produto",
      dataIndex: ["produtos", "nome"],
      render: (_: unknown, row) => (
        <Flex align="center" gap={8}>
          <ProdutoThumb url={row.produtos?.foto_url} />
          <span>{row.produtos?.nome ?? "—"}</span>
          {row.produtos?.codigo && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {row.produtos.codigo}
            </Text>
          )}
        </Flex>
      ),
    },
    {
      title: "Esperado",
      dataIndex: "qtd_esperada",
      width: 130,
      render: (qtd: number, row) => `${qtd} ${row.produtos?.unidade ?? ""}`,
    },
    {
      title: "Contado",
      width: 160,
      render: (_: unknown, row) => (
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          step={1}
          disabled={!editavel}
          value={counts[row.id]}
          onChange={(v) => handleCountChange(row.id, v)}
          onBlur={() => handleSave(row.id)}
        />
      ),
    },
    {
      title: "Diferença",
      width: 110,
      render: (_: unknown, row) =>
        renderDiferenca(row.qtd_esperada, counts[row.id] ?? null),
    },
  ];

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Space size="large">
          <Statistic title="Itens" value={resumo.total} />
          <Statistic title="Contados" value={resumo.contados} />
          <Statistic
            title="Divergências"
            value={resumo.divergentes}
            valueStyle={{
              color: resumo.divergentes > 0 ? "#faad14" : undefined,
            }}
          />
        </Space>
        <Tag color={STATUS_COLOR[inventario.status]}>
          {STATUS_LABEL[inventario.status]}
        </Tag>
      </Flex>

      {!editavel && (
        <Alert
          type={inventario.status === "fechado" ? "success" : "warning"}
          showIcon
          message={
            inventario.status === "fechado"
              ? "Inventário fechado — os ajustes de estoque já foram gerados."
              : "Inventário cancelado — nenhum ajuste foi gerado."
          }
        />
      )}

      <Input.Search
        placeholder="Buscar produto"
        allowClear
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        style={{ maxWidth: 320 }}
      />

      {screens.xs ? (
        <Flex vertical gap={8}>
          {itensFiltrados.length === 0 ? (
            <Empty description="Nenhum item" />
          ) : (
            itensFiltrados.map((row) => (
              <Card key={row.id} size="small">
                <Flex align="center" gap={12}>
                  <ProdutoThumb url={row.produtos?.foto_url} size={56} />
                  <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                    <Flex align="center" gap={8}>
                      <Text strong ellipsis style={{ minWidth: 0 }}>
                        {row.produtos?.nome ?? "—"}
                      </Text>
                      {row.produtos?.codigo && (
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, flexShrink: 0 }}
                        >
                          {row.produtos.codigo}
                        </Text>
                      )}
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Esperado: {row.qtd_esperada} {row.produtos?.unidade ?? ""}
                    </Text>
                  </Flex>
                  {renderDiferenca(row.qtd_esperada, counts[row.id] ?? null)}
                </Flex>
                <Flex align="center" gap={8} style={{ marginTop: 10 }}>
                  <Button
                    size="large"
                    icon={<MinusOutlined />}
                    disabled={!editavel}
                    onClick={() => handleStep(row.id, -1)}
                    style={{ width: 56, height: 48, flexShrink: 0 }}
                  />
                  <InputNumber
                    size="large"
                    controls={false}
                    className="contagem-stepper-input"
                    style={{ flex: 1, height: 48 }}
                    min={0}
                    step={1}
                    inputMode="numeric"
                    placeholder="Contado"
                    disabled={!editavel}
                    value={counts[row.id]}
                    onChange={(v) => handleCountChange(row.id, v)}
                    onBlur={() => handleSave(row.id)}
                  />
                  <Button
                    size="large"
                    icon={<PlusOutlined />}
                    disabled={!editavel}
                    onClick={() => handleStep(row.id, 1)}
                    style={{ width: 56, height: 48, flexShrink: 0 }}
                  />
                </Flex>
              </Card>
            ))
          )}
        </Flex>
      ) : (
        <Table
          columns={columns}
          dataSource={itensFiltrados}
          rowKey="id"
          pagination={false}
          size="small"
        />
      )}

      {editavel && (
        <Flex justify="flex-end" gap={8} wrap="wrap">
          <Button danger icon={<StopOutlined />} onClick={handleCancelar}>
            Cancelar inventário
          </Button>
          <Button type="primary" icon={<CheckOutlined />} onClick={handleFechar}>
            Fechar inventário
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
