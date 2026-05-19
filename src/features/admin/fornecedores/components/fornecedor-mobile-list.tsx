import { Card, Empty, Pagination, Spin, Typography } from "antd";
import type { TablePaginationConfig } from "antd";
import { Fornecedor } from "../api/types";
import { DeleteAction, EditAction } from "@/components/table-actions/table-actions";
import { displayCpfCnpj } from "@/lib/utils";

const { Text } = Typography;

interface Props {
  data: Fornecedor[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

function FornecedorCard({
  item,
  onEdit,
  onDelete,
}: {
  item: Fornecedor;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}) {
  return (
    <Card
      size="small"
      style={{ marginBottom: 8 }}
      actions={[
        <EditAction onClick={(e) => { e.stopPropagation(); onEdit(item.id); }} />,
        <DeleteAction onClick={(e) => { e.stopPropagation(); onDelete(item.id, item.nome); }} />,
      ]}
    >
      <Text strong style={{ display: "block", marginBottom: 4 }}>{item.nome}</Text>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {item.cnpj && (
          <Text type="secondary" style={{ fontSize: 12 }}>{displayCpfCnpj(item.cnpj)}</Text>
        )}
        {item.telefone && (
          <Text type="secondary" style={{ fontSize: 12 }}>{item.telefone}</Text>
        )}
      </div>
    </Card>
  );
}

export default function FornecedorMobileList({ data, loading, pagination, onEdit, onDelete }: Props) {
  return (
    <Spin spinning={loading}>
      <div>
        {!loading && data.length === 0 ? (
          <Empty description="Nenhum fornecedor encontrado" />
        ) : (
          data.map((item) => (
            <FornecedorCard key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>

      {(pagination.total ?? 0) > (pagination.pageSize ?? 15) && (
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
