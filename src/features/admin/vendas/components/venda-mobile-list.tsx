import { Card, Empty, Pagination, Spin, Tag, Typography } from "antd";
import type { TablePaginationConfig } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { VendaListItem } from "../api/types";
import {
  CustomAction,
  DeleteAction,
} from "@/components/table-actions/table-actions";
import { contarItens } from "./venda-table-or-list";
import { displayMoney } from "@/lib/utils";

const { Text } = Typography;

interface Props {
  data: VendaListItem[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onDelete: (id: string) => void;
  onVerComprovante: (id: string) => void;
}

export default function VendaMobileList({
  data,
  loading,
  pagination,
  onDelete,
  onVerComprovante,
}: Props) {
  return (
    <Spin spinning={loading}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.length === 0 && !loading ? (
          <Empty description="Nenhuma venda encontrada" />
        ) : (
          data.map((venda) => (
            <Card
              key={venda.id}
              size="small"
              onClick={() => onVerComprovante(venda.id)}
              actions={[
                <CustomAction
                  icon={<FileTextOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerComprovante(venda.id);
                  }}
                />,
                <DeleteAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(venda.id);
                  }}
                />,
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
                    {displayMoney(venda.total) || "R$ 0,00"}
                  </Text>
                  <Tag color="orange">{contarItens(venda)} itens</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(venda.data_operacao).toLocaleString("pt-BR")}
                </Text>
              </div>
              {venda.observacao && (
                <Text
                  type="secondary"
                  style={{ fontSize: 12, display: "block", marginTop: 6 }}
                >
                  Observação: {venda.observacao}
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
