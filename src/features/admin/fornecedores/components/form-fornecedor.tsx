import { Button, Col, Form, Input, Row } from "antd";
import FormWithSkeleton from "@/components/form-with-skeleton/form-with-skeleton";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { CreateFornecedorDto } from "../api/types";
import { useCreateFornecedor } from "../api/create";
import { useUpdateFornecedor } from "../api/update";
import { useGetFornecedor } from "../api/get-one";
import InputTelefone from "@/components/input-telefone/input-telefone";
import InputCpfCnpj from "@/components/input-cpf-cnpj/input-cpf-cnpj";

export default function FormFornecedor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm<CreateFornecedorDto>();

  const createFornecedor = useCreateFornecedor();
  const updateFornecedor = useUpdateFornecedor();

  const { data: fornecedor, isLoading } = useGetFornecedor(id);

  const initialValues = fornecedor
    ? {
        nome: fornecedor.nome,
        cnpj: fornecedor.cnpj,
        telefone: fornecedor.telefone,
        email: fornecedor.email,
        contato: fornecedor.contato,
      }
    : {};

  const onSubmit = async (values: CreateFornecedorDto) => {
    if (id) {
      await updateFornecedor(id, values);
    } else {
      await createFornecedor(values);
    }
    navigate("/fornecedores");
  };

  return (
    <FormWithSkeleton
      loading={isLoading}
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Por favor insira o nome!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="CPF / CNPJ" name="cnpj">
            <InputCpfCnpj />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} md={8}>
          <Form.Item label="Telefone" name="telefone">
            <InputTelefone value="" onChange={() => {}} placeholder="(00) 00000-0000" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="E-mail" name="email">
            <Input type="email" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Nome do contato" name="contato">
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Row justify="end">
        <Col xs={24}>
          <Form.Item className="mt-10 text-right">
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button className="lg:w-auto w-full" onClick={() => navigate("/fornecedores")}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" className="lg:w-auto w-full">
                Salvar
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </FormWithSkeleton>
  );
}
