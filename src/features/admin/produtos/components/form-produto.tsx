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
  Skeleton,
  Select,
} from "antd";
import { useCreateProduto } from "../api/create";
import { useGetProduto } from "../api/get-one";
import { useUpdateProduto } from "../api/update";
import { uploadFotoProduto } from "../api/upload-foto";
import { CreateProdutoDto } from "../api/types";
import SelectCategoria from "../../categorias/components/select-categoria";
import FotoUpload from "./foto-upload";

const UNIDADES = ["un", "kg", "g", "l", "ml", "cx", "pç", "m", "cm"];

type FormType = Omit<CreateProdutoDto, "foto_url">;

export default function FormProduto() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm<FormType>();

  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto();
  const { data: produto, isLoading } = useGetProduto(id);

  const initialValues = produto
    ? {
        nome: produto.nome,
        descricao: produto.descricao,
        categoria_id: produto.categoria_id,
        quantidade_atual: produto.quantidade_atual,
        estoque_minimo: produto.estoque_minimo,
        unidade: produto.unidade,
        preco_custo_atual: produto.preco_custo_atual,
      }
    : { unidade: "un", quantidade_atual: 0, estoque_minimo: 0 };

  const onSubmit = async (values: FormType) => {
    if (id) {
      let foto_url = produto?.foto_url;
      if (fotoFile) {
        foto_url = await uploadFotoProduto(id, fotoFile);
      }
      await updateProduto(id, { ...values, foto_url });
    } else {
      const novoProduto = await createProduto({ ...values });
      if (fotoFile) {
        const foto_url = await uploadFotoProduto(novoProduto.id, fotoFile);
        await updateProduto(novoProduto.id, { foto_url });
      }
      navigate(`/produto/${novoProduto.id}`);
    }
  };

  return (
    <>
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
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Por favor insira o nome!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Descrição" name="descricao">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={16}>
              <Form.Item label="Categoria" name="categoria_id">
                <SelectCategoria />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
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
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Quantidade Atual"
                name="quantidade_atual"
                rules={[
                  { required: true, message: "Por favor insira a quantidade!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
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
          </Row>

          <Form.Item label="Preço de custo atual" name="preco_custo_atual">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={0.01}
              precision={2}
              prefix="R$"
            />
          </Form.Item>

          <Form.Item label="Foto">
            <FotoUpload
              currentUrl={produto?.foto_url}
              onFileSelect={setFotoFile}
            />
          </Form.Item>

          <Row justify="end">
            <Col xs={24}>
              <Form.Item className="w-full mt-10 text-right">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="lg:w-auto w-full"
                >
                  Salvar
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
}
