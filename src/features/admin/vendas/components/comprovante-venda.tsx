import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetVenda } from "../api/get-one";
import { VendaItem } from "../api/types";
import { displayMoney } from "@/lib/utils";
import "./comprovante-venda.css";

const { Title, Text } = Typography;

type Props = {
  vendaId: string | null;
  open: boolean;
  onClose: () => void;
};

const subtotal = (item: VendaItem) =>
  (item.quantidade || 0) * (item.preco_venda_unitario || 0);

const columns: ColumnsType<VendaItem> = [
  {
    title: "Produto",
    dataIndex: ["produtos", "nome"],
    render: (_: unknown, item) => item.produtos?.nome ?? "—",
  },
  {
    title: "Qtd.",
    dataIndex: "quantidade",
    width: 90,
    render: (qtd: number, item) => `${qtd} ${item.produtos?.unidade ?? ""}`,
  },
  {
    title: "Preço un.",
    dataIndex: "preco_venda_unitario",
    width: 110,
    align: "right",
    render: (preco: number | null) => displayMoney(preco) || "—",
  },
  {
    title: "Subtotal",
    width: 110,
    align: "right",
    render: (_: unknown, item) => displayMoney(subtotal(item)) || "—",
  },
];

export default function ComprovanteVenda({ vendaId, open, onClose }: Props) {
  const { data: venda, isLoading } = useGetVenda(vendaId ?? undefined);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Comprovante de venda"
      footer={[
        <Button key="fechar" onClick={onClose}>
          Fechar
        </Button>,
        <Button
          key="imprimir"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={() => window.print()}
        >
          Imprimir
        </Button>,
      ]}
      width={620}
    >
      <Spin spinning={isLoading}>
        {venda && (
          <div className="comprovante-print">
            <Title level={4} style={{ marginBottom: 4 }}>
              Comprovante de venda
            </Title>
            <Text type="secondary">
              {new Date(venda.data_operacao).toLocaleString("pt-BR")}
            </Text>

            <Divider style={{ margin: "12px 0" }} />

            <Table
              columns={columns}
              dataSource={venda.itens}
              rowKey="id"
              pagination={false}
              size="small"
            />

            <Divider style={{ margin: "12px 0" }} />

            <div style={{ textAlign: "right" }}>
              <Text style={{ fontSize: 16 }}>
                Total:{" "}
                <Text strong style={{ fontSize: 18 }}>
                  {displayMoney(venda.total) || "R$ 0,00"}
                </Text>
              </Text>
            </div>

            {venda.observacao && (
              <Text
                type="secondary"
                style={{ display: "block", marginTop: 12 }}
              >
                Observação: {venda.observacao}
              </Text>
            )}
          </div>
        )}
      </Spin>
    </Modal>
  );
}
