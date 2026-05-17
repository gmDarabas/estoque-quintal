import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateMovimentacao } from "../api/create";
import { CreateMovimentacaoDto, TipoMovimentacao } from "../api/types";
import { ProdutoSelectOption } from "../../produtos/api/list-select";
import SelectProduto from "../../produtos/components/select-produto";

const { Text } = Typography;

function IndicadorVariacaoCusto({
  custoAtual,
  custoNovo,
}: {
  custoAtual: number | null | undefined;
  custoNovo: number | null | undefined;
}) {
  if (custoAtual == null || custoAtual === 0 || custoNovo == null || custoNovo === custoAtual) {
    return null;
  }

  const diff = ((custoNovo - custoAtual) / custoAtual) * 100;
  const subindo = diff > 0;

  return (
    <Text style={{ color: subindo ? "#ff4d4f" : "#52c41a", fontSize: 12 }}>
      {subindo ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      {" "}
      {Math.abs(diff).toFixed(1)}% em relação ao custo médio atual
    </Text>
  );
}

const TIPO_OPTIONS = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "perda", label: "Perda" },
];

export default function FormMovimentacao() {
  const [form] = useForm<CreateMovimentacaoDto>();
  const navigate = useNavigate();
  const createMovimentacao = useCreateMovimentacao();

  const [tipo, setTipo] = useState<TipoMovimentacao | undefined>();
  const [selectedProduto, setSelectedProduto] =
    useState<ProdutoSelectOption | null>(null);

  const precoCustoNovo = Form.useWatch("preco_custo_unitario", form);

  const handleProdutoSelect = (product: ProdutoSelectOption | null) => {
    setSelectedProduto(product);
    if (tipo === "entrada" && product?.preco_custo_atual != null) {
      form.setFieldValue("preco_custo_unitario", product.preco_custo_atual);
    }
  };

  const handleTipoChange = (value: TipoMovimentacao) => {
    setTipo(value);
    if (value === "entrada" && selectedProduto?.preco_custo_atual != null) {
      form.setFieldValue(
        "preco_custo_unitario",
        selectedProduto.preco_custo_atual,
      );
    } else {
      form.setFieldValue("preco_custo_unitario", undefined);
    }
    form.setFieldValue("preco_venda_unitario", undefined);
  };

  const onSubmit = async (values: CreateMovimentacaoDto) => {
    await createMovimentacao(values);
    navigate("/movimentacoes");
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit} autoComplete="off">
      <Form.Item
        label="Produto"
        name="produto_id"
        rules={[{ required: true, message: "Selecione o produto" }]}
      >
        <SelectProduto onSelect={handleProdutoSelect} />
      </Form.Item>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={tipo === "entrada" || tipo === "saida" ? 8 : 12}>
          <Form.Item
            label="Tipo"
            name="tipo"
            rules={[{ required: true, message: "Selecione o tipo" }]}
          >
            <Select options={TIPO_OPTIONS} onChange={handleTipoChange} />
          </Form.Item>
        </Col>
        <Col xs={24} md={tipo === "entrada" || tipo === "saida" ? 8 : 12}>
          <Form.Item
            label="Quantidade"
            name="quantidade"
            rules={[{ required: true, message: "Informe a quantidade" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0.01} step={0.01} />
          </Form.Item>
        </Col>
        {tipo === "entrada" && (
          <Col xs={24} md={8}>
            <Form.Item
              label="Preço de custo unitário"
              name="preco_custo_unitario"
              extra={
                <IndicadorVariacaoCusto
                  custoAtual={selectedProduto?.preco_custo_atual}
                  custoNovo={precoCustoNovo}
                />
              }
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                precision={2}
                prefix="R$"
              />
            </Form.Item>
          </Col>
        )}
        {tipo === "saida" && (
          <Col xs={24} md={8}>
            <Form.Item
              label="Preço de venda unitário"
              name="preco_venda_unitario"
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={0.01}
                precision={2}
                prefix="R$"
              />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Form.Item label="Observação" name="observacao">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Row justify="end">
        <Col xs={24}>
          <Form.Item className="w-full mt-10 text-right">
            <Button
              type="primary"
              htmlType="submit"
              className="lg:w-auto w-full"
            >
              Registrar
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
