import { Card, Empty, Pagination, Spin, Tag, Typography } from "antd";
import type { TablePaginationConfig } from "antd";
import { Inventario } from "../api/types";
import { STATUS_COLOR, STATUS_LABEL } from "./status";
import { DeleteAction, EditAction } from "@/components/table-actions/table-actions";

const { Text } = Typography;

interface Props {
  data: Inventario[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

function InventarioMobileList({
  data,
  loading,
  pagination,
  onOpen,
  onDelete,
}: Props) {
  return (
    <Spin spinning={loading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.length === 0 && !loading ? (
          <Empty description="Nenhum inventário encontrado" />
        ) : (
          data.map((item) => (
            <Card
              key={item.id}
              size="small"
              actions={[
                <EditAction onClick={() => onOpen(item.id)} />,
                <DeleteAction onClick={() => onDelete(item.id)} />,
              ]}
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
                    {item.descricao || "Inventário"}
                  </Text>
                  <Tag color={STATUS_COLOR[item.status]}>
                    {STATUS_LABEL[item.status]}
                  </Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(item.iniciado_em).toLocaleDateString("pt-BR")}
                </Text>
              </div>
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

export default InventarioMobileList;
