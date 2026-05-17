import { Card, Empty, Image, Pagination, Spin, Tag, Typography } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import type { TablePaginationConfig } from "antd";
import { ProdutoEstoque } from "../../api/types";
import {
  DeleteAction,
  EditAction,
} from "@/components/table-actions/table-actions";
import "./produto-mobile-list.css";
import { displayMoney } from "@/lib/utils";

const { Text } = Typography;

interface Props {
  data: ProdutoEstoque[];
  loading: boolean;
  pagination: TablePaginationConfig;
  onView: (produto: ProdutoEstoque) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}

export default function ProdutoMobileList({
  data,
  loading,
  pagination,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const isEmpty = data.length === 0;

  return (
    <Spin spinning={loading}>
      <div className="produto-lista">
        {!loading && isEmpty ? (
          <Empty description="Nenhum produto encontrado" />
        ) : (
          data.map((item) => (
            <ProdutoCard
              key={item.id}
              item={item}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>

      {(pagination.total ?? 0) > (pagination.pageSize ?? 10) && (
        <div className="produto-paginacao">
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

function FotoPreview({ fotoUrl }: { fotoUrl?: string | null }) {
  if (fotoUrl) {
    return (
      <Image
        src={fotoUrl}
        width={56}
        height={56}
        className="produto-imagem"
        preview={{ zIndex: 2000 }}
      />
    );
  }

  return (
    <div className="produto-imagem-placeholder">
      <PictureOutlined className="produto-imagem-icon" />
    </div>
  );
}

function ProdutoInfo({ item }: { item: ProdutoEstoque }) {
  return (
    <div
      className="produto-info"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <Text strong className="produto-nome">
          {item.nome}
        </Text>

        {item.categorias?.nome && (
          <Text type="secondary" className="produto-categoria">
            {item.categorias.nome}
          </Text>
        )}

        <Tag color={item.abaixo_do_minimo ? "red" : "green"}>
          {item.quantidade_atual} {item.unidade}
        </Tag>

        {item.preco_custo_medio != null && (
          <div style={{ marginTop: 6 }}>
            <Text type="secondary" className="produto-metrica">
              Custo médio: {displayMoney(item.preco_custo_medio)}
            </Text>
          </div>
        )}
      </div>

      {item.valor_total_estoque != null && (
        <Text
          strong
          style={{
            color: "#1677ff",
            fontSize: 15,
            display: "block",
            flexShrink: 0,
            marginLeft: 8,
          }}
        >
          {displayMoney(item.valor_total_estoque)}
        </Text>
      )}
    </div>
  );
}

function ProdutoCard({
  item,
  onView,
  onEdit,
  onDelete,
}: {
  item: ProdutoEstoque;
  onView: (item: ProdutoEstoque) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string, nome: string) => void;
}) {
  return (
    <Card
      size="small"
      hoverable
      className="produto-card"
      actions={[
        <EditAction
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item.id);
          }}
        />,
        <DeleteAction
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id, item.nome);
          }}
        />,
      ]}
    >
      <div className="produto-card-content">
        <FotoPreview fotoUrl={item.foto_url} />
        <div style={{ flex: 1, minWidth: 0 }} onClick={() => onView(item)}>
          <ProdutoInfo item={item} />
        </div>
      </div>
    </Card>
  );
}
