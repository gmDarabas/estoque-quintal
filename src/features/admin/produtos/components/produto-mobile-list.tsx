import { Card, Empty, Image, Pagination, Spin, Tag, Typography } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import { ProdutoComCategoria } from "../api/types";
import { DeleteAction, EditAction } from "@/components/table-actions/table-actions";

const { Text } = Typography;

interface Props {
  data: ProdutoComCategoria[];
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
          data.map((item) => {
            const abaixoMinimo = item.quantidade_atual < item.estoque_minimo;
            return (
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
                    <Tag color={abaixoMinimo ? "red" : "green"}>
                      {item.quantidade_atual} {item.unidade}
                    </Tag>
                  </div>
                </div>
              </Card>
            );
          })
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
