import { useRef, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Row,
  Col,
  InputNumber,
  Button,
  Form,
  Skeleton,
  Select,
  Tooltip,
} from "antd";
import { QuestionCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { useCreateProduto } from "../api/create";
import { useGetProduto } from "../api/get-one";
import { useUpdateProduto } from "../api/update";
import { uploadFotoProduto } from "../api/upload-foto";
import { CreateProdutoDto, ProdutoComCategoria } from "../api/types";
import { useCreateMovimentacao } from "../../movimentacoes/api/create";
import SelectCategoria from "../../categorias/components/select-categoria";
import FotoUpload from "./foto-upload";
import CopiarProdutoModal from "./copiar-produto-modal";

const UNIDADES = ["un", "kg", "g", "l", "ml", "cx", "pç", "m", "cm"];

type FormType = Omit<CreateProdutoDto, "foto_url" | "quantidade_atual"> & {
  estoque_inicial?: number;
};

export default function FormProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm<FormType>();

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoUrlCopiada, setFotoUrlCopiada] = useState<string | null>(null);
  const [copiarModalOpen, setCopiarModalOpen] = useState(false);
  const saveMode = useRef<"save" | "saveAndNew">("save");

  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto();
  const createMovimentacao = useCreateMovimentacao();
  const { data: produto, isLoading } = useGetProduto(id);

  const initialValues = produto
    ? {
        codigo: produto.codigo,
        nome: produto.nome,
        descricao: produto.descricao,
        categoria_id: produto.categoria_id,
        estoque_minimo: produto.estoque_minimo,
        unidade: produto.unidade,
        preco_custo_atual: produto.preco_custo_atual,
        margem: produto.margem,
      }
    : { unidade: "un", estoque_minimo: 0 };

  const handleCopy = (p: ProdutoComCategoria) => {
    form.setFieldsValue({
      codigo: p.codigo,
      nome: p.nome,
      descricao: p.descricao,
      categoria_id: p.categoria_id,
      estoque_minimo: p.estoque_minimo,
      unidade: p.unidade,
      preco_custo_atual: p.preco_custo_atual,
      margem: p.margem,
    });
    setFotoUrlCopiada(p.foto_url ?? null);
    setFotoFile(null);
    setCopiarModalOpen(false);
  };

  const resolverFoto = async (produtoId: string) => {
    if (fotoFile) return uploadFotoProduto(produtoId, fotoFile);
    return fotoUrlCopiada ?? undefined;
  };

  const onSubmit = async (values: FormType) => {
    const { estoque_inicial, ...produtoValues } = values;

    if (id) {
      const foto_url = fotoFile
        ? await uploadFotoProduto(id, fotoFile)
        : produto?.foto_url;
      await updateProduto(id, { ...produtoValues, foto_url });
      return;
    }

    const novoProduto = await createProduto({
      ...produtoValues,
      quantidade_atual: 0,
    });

    const foto_url = await resolverFoto(novoProduto.id);
    if (foto_url) await updateProduto(novoProduto.id, { foto_url });

    if (estoque_inicial && estoque_inicial > 0) {
      await createMovimentacao({
        produto_id: novoProduto.id,
        tipo: "entrada",
        quantidade: estoque_inicial,
        preco_custo_unitario: produtoValues.preco_custo_atual ?? null,
        data_movimentacao: new Date().toISOString(),
        observacao: "Estoque inicial",
      });
    }

    if (saveMode.current === "saveAndNew") {
      form.resetFields();
      setFotoFile(null);
      setFotoUrlCopiada(null);
    } else {
      navigate(`/produtos`);
    }
  };

  return (
    <>
      <CopiarProdutoModal
        open={copiarModalOpen}
        onClose={() => setCopiarModalOpen(false)}
        onCopy={handleCopy}
      />

      {isLoading ? (
        <Skeleton />
      ) : (
        <Form
          form={form}
          id="form-produto"
          name="produto"
          layout="vertical"
          initialValues={initialValues}
          onFinish={onSubmit}
          autoComplete="off"
        >
          {!id && (
            <div style={{ marginBottom: 16, textAlign: "right" }}>
              <Button
                icon={<CopyOutlined />}
                onClick={() => setCopiarModalOpen(true)}
              >
                Copiar de outro produto
              </Button>
            </div>
          )}

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
                rules={[
                  { required: true, message: "Por favor insira o nome!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Categoria" name="categoria_id">
                <SelectCategoria />
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
                rules={[
                  { required: true, message: "Por favor insira a unidade!" },
                ]}
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
            <FotoUpload
              currentUrl={fotoUrlCopiada ?? produto?.foto_url}
              onFileSelect={(file) => {
                setFotoFile(file);
                setFotoUrlCopiada(null);
              }}
            />
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
                  {!id && (
                    <Button
                      htmlType="submit"
                      className="lg:w-auto w-full"
                      onClick={() => {
                        saveMode.current = "saveAndNew";
                      }}
                    >
                      Salvar e cadastrar outro
                    </Button>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="lg:w-auto w-full"
                    onClick={() => {
                      saveMode.current = "save";
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
}
