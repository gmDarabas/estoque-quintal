import { useNavigate, useParams } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import FormCategoria from "./components/form-categoria";

export default function PageCadastroCategoria() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <DefaultPageHeader
        onBack={() => navigate(-1)}
        title={id ? "Editar Categoria" : "Cadastro de Categoria"}
      />
      <DefaultPageContainer>
        <FormCategoria />
      </DefaultPageContainer>
    </>
  );
}
