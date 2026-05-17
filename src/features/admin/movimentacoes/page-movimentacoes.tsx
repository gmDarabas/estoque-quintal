import { Button, Col, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useListMovimentacoes } from "./api/list";
import { useDeleteMovimentacao } from "./api/delete";
import { useConfirmDelete } from "@/lib/use-confirm-delete";
import MovimentacaoTableOrList from "./components/movimentacao-table-or-list";
import SelectProduto from "../produtos/components/select-produto";
import { TipoMovimentacao } from "./api/types";

const TIPO_OPTIONS = [
  { value: "", label: "Todos os tipos" },
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "perda", label: "Perda" },
];

export default function PageMovimentacoes() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<TipoMovimentacao | undefined>();
  const [produtoId, setProdutoId] = useState<string | undefined>();

  const {
    isLoading,
    data: pageData,
    pagination,
    handleFilterChange,
  } = useListMovimentacoes({ page: 1, rpp: 10 });

  const deleteMovimentacao = useDeleteMovimentacao();
  const confirmDelete = useConfirmDelete();

  const handleDelete = (id: string) => {
    confirmDelete({
      entidade: "movimentação",
      identificador: "este registro",
      onOk: () => deleteMovimentacao(id),
    });
  };

  const applyFilters = (
    newTipo: TipoMovimentacao | undefined,
    newProdutoId: string | undefined
  ) => {
    handleFilterChange({
      fetchParams: {
        tipo: newTipo,
        produto_id: newProdutoId,
      },
    });
  };

  const onChangeTipo = (value: string) => {
    const newTipo = (value || undefined) as TipoMovimentacao | undefined;
    setTipo(newTipo);
    applyFilters(newTipo, produtoId);
  };

  const onChangeProduto = (value: string | null) => {
    const newProdutoId = value ?? undefined;
    setProdutoId(newProdutoId);
    applyFilters(tipo, newProdutoId);
  };

  return (
    <>
      <DefaultPageHeader
        title="Movimentações"
        extra={[
          <Button
            key="registrar"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/movimentacao/cadastrar")}
          >
            Registrar
          </Button>,
        ]}
      />
      <DefaultPageContainer>
        <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={10} md={8}>
            <SelectProduto
              value={produtoId ?? null}
              onChange={onChangeProduto}
              placeholder="Filtrar por produto"
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              style={{ width: "100%" }}
              defaultValue=""
              options={TIPO_OPTIONS}
              onChange={onChangeTipo}
            />
          </Col>
        </Row>

        <MovimentacaoTableOrList
          data={pageData?.list}
          loading={isLoading}
          pagination={pagination}
          onDelete={handleDelete}
        />
      </DefaultPageContainer>
    </>
  );
}
