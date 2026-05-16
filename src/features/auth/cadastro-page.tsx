import { Button, Form, Input, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register } from "./api/register";

interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
}

export type LoginResponse = {
  accessToken: string;
  usuario: any;
};

const errorMessages: Record<string, string> = {
  weak_password: 'A senha deve possuir 6 caracteres.',
  user_already_exists: 'Usuário com esse email já existe.'
};

export default function Cadastro() {
  const navigate = useNavigate();

  const onSubmit = async (payload: RegisterForm) => {
    try {
      await register(payload);
      navigate('/login');
    } catch (e: any) {
      console.log({ e })

      const message = (e.code && errorMessages[e.code]) || 'Erro ao realizar cadastro.';

      notification.error({ message });
    }
  };

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="nome"
        label="Nome"
        rules={[{ required: true }]}
      >
        <Input placeholder="Digite seu nome" />

      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: "email", message: "Insira um email válido" }]}
      >
        <Input placeholder="Digite seu email" />
      </Form.Item>

      <Form.Item name="senha" label="Senha" rules={[{ required: true, message: "Insira sua senha" }]}>
        <Input.Password placeholder="Digite sua senha" />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" size="large">
          Cadastre-se
        </Button>
      </Form.Item>
      <Link to={"/login"}>
        Voltar
        <br />
      </Link>
    </Form>
  );
}
