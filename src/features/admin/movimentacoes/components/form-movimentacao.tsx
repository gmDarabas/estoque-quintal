import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { useCreateMovimentacao } from "../api/create";
import { CreateMovimentacaoDto } from "../api/types";
import SelectProduto from "../../produtos/components/select-produto";

const TIPO_OPTIONS = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "perda", label: "Perda" },
];

export default function FormMovimentacao() {
  const [form] = useForm<CreateMovimentacaoDto>();
  const navigate = useNavigate();
  const createMovimentacao = useCreateMovimentacao();

  const onSubmit = async (values: CreateMovimentacaoDto) => {
    await createMovimentacao(values);
    navigate("/movimentacoes");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item
        label="Produto"
        name="produto_id"
        rules={[{ required: true, message: "Selecione o produto" }]}
      >
        <SelectProduto />
      </Form.Item>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tipo"
            name="tipo"
            rules={[{ required: true, message: "Selecione o tipo" }]}
          >
            <Select options={TIPO_OPTIONS} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Quantidade"
            name="quantidade"
            rules={[{ required: true, message: "Informe a quantidade" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0.01} step={0.01} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Observação" name="observacao">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Row justify="end">
        <Col xs={24}>
          <Form.Item className="w-full mt-10 text-right">
            <Button type="primary" htmlType="submit" className="lg:w-auto w-full">
              Registrar
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
