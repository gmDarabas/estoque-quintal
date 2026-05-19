import { Button, Col, Form, Input, Row } from "antd";
import FormWithSkeleton from "@/components/form-with-skeleton/form-with-skeleton";
import { useForm } from "antd/es/form/Form";
import { useNavigate, useParams } from "react-router-dom";
import { CreateCategoriaDto } from "../api/types";
import { useCreateCategoria } from "../api/create";
import { useUpdateCategoria } from "../api/update";
import { useGetCategoria } from "../api/get-one";

export default function FormCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = useForm<CreateCategoriaDto>();

  const createCategoria = useCreateCategoria();
  const updateCategoria = useUpdateCategoria();

  const { data: categoria, isLoading } = useGetCategoria(id);

  const initialValues = categoria ? { nome: categoria.nome } : {};

  const onSubmit = async (values: CreateCategoriaDto) => {
    if (id) {
      await updateCategoria(id, values);
    } else {
      await createCategoria(values);
    }
    navigate("/categorias");
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
      </Row>

      <Row justify="end">
        <Col xs={24}>
          <Form.Item className="mt-10 text-right">
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button className="lg:w-auto w-full" onClick={() => navigate("/categorias")}>
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
