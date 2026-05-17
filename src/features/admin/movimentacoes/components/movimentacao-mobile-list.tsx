import { Card, Empty, Pagination, Spin, Tag, Typography } from "antd";
import type { TablePaginationConfig } from "antd";
import { MovimentacaoComProduto, TipoMovimentacao } from "../api/types";
import { DeleteAction } from "@/components/table-actions/table-actions";

const { Text } = Typography;

const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

const TIPO_COLOR: Record<TipoMovimentacao, string> = {
  entrada: "green",
  saida: "red",
  perda: "orange",
};

const TIPO_LABEL: Record<TipoMovimentacao, string> = {
  entrada: "Entrada",
  saida: "Saída",
  perda: "Perda",
};

interface Props {
  data: MovimentacaoComProduto[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onDelete: (id: string) => void;
}

function MovimentacaoMobileList({
  data,
  loading,
  pagination,
  onDelete,
}: Props) {
  return (
    <Spin spinning={loading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.length === 0 && !loading ? (
          <Empty description="Nenhuma movimentação encontrada" />
        ) : (
          data.map((item) => (
            <Card
              key={item.id}
              size="small"
              actions={[<DeleteAction onClick={() => onDelete(item.id)} />]}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <Text strong style={{ display: "block", marginBottom: 4 }}>
                    {item.produtos?.nome ?? "—"}
                  </Text>
                  <Tag color={TIPO_COLOR[item.tipo]}>
                    {TIPO_LABEL[item.tipo]}
                  </Tag>
                  <Text style={{ marginLeft: 8 }}>
                    {item.quantidade} {item.produtos?.unidade ?? ""}
                  </Text>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(item.created_at).toLocaleString("pt-BR")}
                </Text>
              </div>
              {(item.preco_custo_unitario != null || item.preco_venda_unitario != null) && (
                <div style={{ display: "flex", gap: 16, marginTop: 6, flexWrap: "wrap" }}>
                  {item.preco_custo_unitario != null && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Preço de custo: {formatCurrency(item.preco_custo_unitario)}
                    </Text>
                  )}
                  {item.preco_venda_unitario != null && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Preço de venda: {formatCurrency(item.preco_venda_unitario)}
                    </Text>
                  )}
                  {(item.preco_custo_unitario != null || item.preco_venda_unitario != null) && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Valor total:{" "}
                      {formatCurrency(
                        item.quantidade *
                          (item.preco_custo_unitario ?? item.preco_venda_unitario)!
                      )}
                    </Text>
                  )}
                </div>
              )}
              {item.observacao && (
                <Text
                  type="secondary"
                  style={{ fontSize: 12, display: "block", marginTop: 6 }}
                >
                  Observação: {item.observacao}
                </Text>
              )}
            </Card>
          ))
        )}
      </div>

      {(pagination.total ?? 0) > (pagination.pageSize ?? 10) && (
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 16 }}
        >
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            showSizeChanger={pagination.showSizeChanger}
            onChange={pagination.onChange}
          />
        </div>
      )}
    </Spin>
  );
}

export default MovimentacaoMobileList;
