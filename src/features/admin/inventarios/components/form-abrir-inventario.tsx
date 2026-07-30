import { Alert, Button, Col, Form, Input, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { useAbrirInventario } from "../api/create";
import { AbrirInventarioDto } from "../api/types";
import { useListCategorias } from "../../categorias/api/list";
import { useListFornecedores } from "../../fornecedores/api/list";

type FormValues = {
  descricao?: string;
  categoria_ids?: string[];
  fornecedor_ids?: string[];
};

export default function FormAbrirInventario() {
  const [form] = useForm<FormValues>();
  const navigate = useNavigate();
  const abrirInventario = useAbrirInventario();

  const { data: categoriasPage } = useListCategorias({ page: 1, rpp: 200 });
  const { data: fornecedoresPage } = useListFornecedores({ page: 1, rpp: 200 });

  const categoriaOptions = (categoriasPage?.list ?? []).map((c) => ({
    value: c.id,
    label: c.nome,
  }));
  const fornecedorOptions = (fornecedoresPage?.list ?? []).map((f) => ({
    value: f.id,
    label: f.nome,
  }));

  const onSubmit = async (values: FormValues) => {
    const dto: AbrirInventarioDto = {
      descricao: values.descricao ?? null,
      categoria_ids: values.categoria_ids ?? null,
      fornecedor_ids: values.fornecedor_ids ?? null,
    };
    const id = await abrirInventario(dto);
    navigate(`/inventario/${id}`);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
      <Form.Item label="Descrição" name="descricao">
        <Input placeholder="Ex.: Contagem mensal — Julho/2026" />
      </Form.Item>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Categorias"
            name="categoria_ids"
            extra="Deixe vazio para incluir todas as categorias"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Todas"
              options={categoriaOptions}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Fornecedores"
            name="fornecedor_ids"
            extra="Deixe vazio para incluir todos os fornecedores"
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Todos"
              options={fornecedorOptions}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      </Row>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
        message="Ao abrir, o sistema registra o saldo esperado de cada produto selecionado. Você informa a quantidade contada e, ao fechar, os ajustes de estoque são gerados automaticamente."
      />

      <Row justify="end">
        <Button type="primary" htmlType="submit">
          Abrir inventário
        </Button>
      </Row>
    </Form>
  );
}
