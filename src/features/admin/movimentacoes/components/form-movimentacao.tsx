import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs, { Dayjs } from "dayjs";
import { useRef, useState } from "react";
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
  if (
    custoAtual == null ||
    custoAtual === 0 ||
    custoNovo == null ||
    custoNovo === custoAtual
  ) {
    return null;
  }

  const diff = ((custoNovo - custoAtual) / custoAtual) * 100;
  const subindo = diff > 0;

  return (
    <Text style={{ color: subindo ? "#ff4d4f" : "#52c41a", fontSize: 12 }}>
      {subindo ? <ArrowUpOutlined /> : <ArrowDownOutlined />}{" "}
      {Math.abs(diff).toFixed(1)}% em relação ao custo médio atual
    </Text>
  );
}

const TIPO_OPTIONS = [
  { value: "entrada", label: "Entrada" },
  { value: "saida", label: "Saída" },
  { value: "perda", label: "Perda" },
];

type FormValues = Omit<CreateMovimentacaoDto, "data_movimentacao"> & {
  data_movimentacao?: Dayjs | null;
};

export default function FormMovimentacao() {
  const [form] = useForm<FormValues>();
  const navigate = useNavigate();
  const createMovimentacao = useCreateMovimentacao();
  const saveMode = useRef<"save" | "saveAndNew">("save");

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

  const onSubmit = async (values: FormValues) => {
    const dto: CreateMovimentacaoDto = {
      ...values,
      data_movimentacao: values.data_movimentacao?.toISOString() ?? null,
    };
    await createMovimentacao(dto);
    if (saveMode.current === "saveAndNew") {
      form.resetFields();
      form.setFieldValue("data_movimentacao", dayjs());
      setTipo(undefined);
      setSelectedProduto(null);
    } else {
      navigate("/movimentacoes");
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      autoComplete="off"
      initialValues={{ data_movimentacao: dayjs() }}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={16}>
          <Form.Item
            label="Produto"
            name="produto_id"
            rules={[{ required: true, message: "Selecione o produto" }]}
          >
            <SelectProduto onSelect={handleProdutoSelect} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Data da movimentação"
            name="data_movimentacao"
            rules={[{ required: true, message: "Informe a data" }]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
              placement="bottomLeft"
            />
          </Form.Item>
        </Col>
      </Row>

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
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                flexWrap: "wrap",
              }}
            >
              <Button
                htmlType="submit"
                className="lg:w-auto w-full"
                onClick={() => {
                  saveMode.current = "saveAndNew";
                }}
              >
                Registrar e adicionar novo
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="lg:w-auto w-full"
                onClick={() => {
                  saveMode.current = "save";
                }}
              >
                Registrar
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
