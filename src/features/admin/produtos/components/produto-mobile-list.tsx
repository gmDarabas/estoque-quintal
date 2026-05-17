import { Card, Empty, Image, Pagination, Spin, Tag, Typography } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import { ProdutoEstoque } from "../api/types";
import { DeleteAction, EditAction } from "@/components/table-actions/table-actions";

const { Text } = Typography;

const formatCurrency = (value: number | null | undefined) =>
  value != null
    ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : null;

interface Props {
  data: ProdutoEstoque[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

function ProdutoMobileList({ data, loading, pagination, onEdit, onDelete }: Props) {
  return (
    <Spin spinning={loading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.length === 0 && !loading ? (
          <Empty description="Nenhum produto encontrado" />
        ) : (
          data.map((item) => (
            <Card
              key={item.id}
              size="small"
              actions={[
                <EditAction onClick={() => onEdit(item.id)} />,
                <DeleteAction onClick={() => onDelete(item.id, item.nome)} />,
              ]}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                {item.foto_url ? (
                  <Image
                    src={item.foto_url}
                    width={56}
                    height={56}
                    style={{ objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                    preview={{ zIndex: 2000 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: "#f5f5f5",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid #e0e0e0",
                      flexShrink: 0,
                    }}
                  >
                    <PictureOutlined style={{ color: "#bbb", fontSize: 22 }} />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ display: "block", marginBottom: 2 }}>
                    {item.nome}
                  </Text>
                  {item.categorias?.nome && (
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, display: "block", marginBottom: 6 }}
                    >
                      {item.categorias.nome}
                    </Text>
                  )}
                  <Tag color={item.abaixo_do_minimo ? "red" : "green"}>
                    {item.quantidade_atual} {item.unidade}
                  </Tag>

                  {(item.preco_custo_medio != null || item.valor_total_estoque != null) && (
                    <div style={{ marginTop: 6, display: "flex", gap: 12, flexWrap: "wrap" }}>
                      {item.preco_custo_medio != null && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Custo médio: {formatCurrency(item.preco_custo_medio)}
                        </Text>
                      )}
                      {item.valor_total_estoque != null && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Valor em estoque: {formatCurrency(item.valor_total_estoque)}
                        </Text>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {(pagination.total ?? 0) > (pagination.pageSize ?? 10) && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
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

export default ProdutoMobileList;
