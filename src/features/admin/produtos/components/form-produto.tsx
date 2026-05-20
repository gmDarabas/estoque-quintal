import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Row,
  Col,
  InputNumber,
  Button,
  Form,
  Select,
  Tooltip,
} from "antd";
import FormWithSkeleton from "@/components/form-with-skeleton/form-with-skeleton";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useCreateProduto } from "../api/create";
import { useGetProduto } from "../api/get-one";
import { useUpdateProduto } from "../api/update";
import { uploadFotoProduto } from "../api/upload-foto";
import { CreateProdutoDto, Produto } from "../api/types";
import { useCreateMovimentacao } from "../../movimentacoes/api/create";
import SelectCategoria from "../../categorias/components/select-categoria";
import SelectFornecedor from "../../fornecedores/components/select-fornecedor";
import FotoUpload from "./foto-upload";

const UNIDADES = ["un", "kg", "g", "l", "ml", "cx", "pç", "m", "cm"];

type FormType = Omit<CreateProdutoDto, "foto_url" | "quantidade_atual"> & {
  estoque_inicial?: number;
};

export default function FormProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm<FormType>();

  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto({ silent: !id });
  const createMovimentacao = useCreateMovimentacao();
  const { data: produto, isLoading } = useGetProduto(id);

  const initialValues = produto
    ? {
        codigo: produto.codigo,
        nome: produto.nome,
        descricao: produto.descricao,
        categoria_id: produto.categoria_id,
        fornecedor_id: produto.fornecedor_id,
        estoque_minimo: produto.estoque_minimo,
        unidade: produto.unidade,
        preco_custo_atual: produto.preco_custo_atual,
        margem: produto.margem,
      }
    : { unidade: "un", estoque_minimo: 0 };

  const resolverFoto = async (produtoId: string) => {
    if (fotoFile) return uploadFotoProduto(produtoId, fotoFile);
    return produto?.foto_url;
  };

  const onSave = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    await doSubmit(values);
    navigate("/produtos");
  };

  const onSaveAndNew = async () => {
    const values = await form.validateFields().catch(() => null);
    if (!values) return;
    await doSubmit(values);
    form.resetFields();
    setFotoFile(null);
  };

  const doSubmit = async (values: FormType) => {
    if (id) {
      const { estoque_inicial: _, ...produtoValues } = values;
      await handleUpdateProduto(produtoValues);
    } else {
      await handleCreateProduto(values);
    }
  };

  const handleCreateProduto = async (values: FormType) => {
    const { estoque_inicial: estoqueInicial, ...produtoValues } = values;
    const novoProduto = await createProduto({
      ...produtoValues,
      quantidade_atual: 0,
    });

    const foto_url = await resolverFoto(novoProduto.id);
    if (foto_url) await updateProduto(novoProduto.id, { foto_url });

    if (estoqueInicial && estoqueInicial > 0) {
      await createMovimentacao({
        produto_id: novoProduto.id,
        tipo: "entrada",
        quantidade: estoqueInicial,
        preco_custo_unitario: values.preco_custo_atual ?? null,
        data_movimentacao: new Date().toISOString(),
        observacao: "Estoque inicial",
      });
    }
  };

  const handleUpdateProduto = async (values: Partial<Produto>) => {
    if (!id) throw new Error("undefined id");

    const foto_url = await resolverFoto(id);
    await updateProduto(id, { ...values, foto_url });
  };

  return (
    <FormWithSkeleton
      loading={isLoading}
      form={form}
      id="form-produto"
      name="produto"
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSave}
      autoComplete="off"
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={4}>
          <Form.Item label="Código" name="codigo">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Por favor insira o nome!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Categoria" name="categoria_id">
            <SelectCategoria initialOption={produto?.categoria} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item label="Fornecedor" name="fornecedor_id">
            <SelectFornecedor initialOption={produto?.fornecedor} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Descrição" name="descricao">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={6}>
          <Form.Item
            label="Estoque Mínimo"
            name="estoque_minimo"
            rules={[
              {
                required: true,
                message: "Por favor insira o estoque mínimo!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            label="Unidade"
            name="unidade"
            rules={[{ required: true, message: "Por favor insira a unidade!" }]}
          >
            <Select
              showSearch
              options={UNIDADES.map((u) => ({ value: u, label: u }))}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Preço de custo atual" name="preco_custo_atual">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.01}
              precision={2}
              prefix="R$"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item
            name="margem"
            label={
              <span>
                Margem&nbsp;
                <Tooltip title="Percentual de lucro sobre o custo médio. Usado para calcular o preço de venda sugerido.">
                  <QuestionCircleOutlined style={{ color: "#aaa" }} />
                </Tooltip>
              </span>
            }
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.5}
              precision={2}
              suffix="%"
            />
          </Form.Item>
        </Col>
      </Row>

      {!id && (
        <Row gutter={[16, 0]}>
          <Col xs={24} md={6}>
            <Form.Item label="Estoque inicial" name="estoque_inicial">
              <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
            </Form.Item>
          </Col>
        </Row>
      )}

      <Form.Item label="Foto">
        <FotoUpload currentUrl={produto?.foto_url} onFileSelect={setFotoFile} />
      </Form.Item>

      <Form.Item className="mt-10 text-right">
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {!id && (
            <Button className="lg:w-auto w-full" onClick={onSaveAndNew}>
              Salvar e cadastrar outro
            </Button>
          )}
          <Button type="primary" className="lg:w-auto w-full" onClick={onSave}>
            Salvar
          </Button>
        </div>
      </Form.Item>
    </FormWithSkeleton>
  );
}
