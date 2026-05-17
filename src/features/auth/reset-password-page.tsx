import { Button, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

interface ResetForm {
  senha: string;
  confirmar: string;
}

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ senha }: ResetForm) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error) {
      message.error("Erro ao redefinir senha. O link pode ter expirado.");
    } else {
      message.success("Senha redefinida com sucesso!");
      navigate("/login");
    }
  };

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Typography.Title level={5} style={{ marginBottom: 24, textAlign: "center" }}>
        Redefinir senha
      </Typography.Title>

      <Form.Item
        name="senha"
        label="Nova senha"
        rules={[
          { required: true, message: "Insira a nova senha" },
          { min: 6, message: "Mínimo 6 caracteres" },
        ]}
      >
        <Input.Password placeholder="Digite a nova senha" />
      </Form.Item>

      <Form.Item
        name="confirmar"
        label="Confirmar senha"
        dependencies={["senha"]}
        rules={[
          { required: true, message: "Confirme a nova senha" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("senha") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("As senhas não coincidem"));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirme a nova senha" />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit" size="large" loading={loading}>
          Redefinir senha
        </Button>
      </Form.Item>
    </Form>
  );
}
