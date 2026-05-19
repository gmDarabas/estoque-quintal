import { useNavigate } from "react-router-dom";
import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import { useParams } from "react-router-dom";
import FormFornecedor from "./components/form-fornecedor";

export default function PageCadastroFornecedor() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <>
      <DefaultPageHeader
        onBack={() => navigate(-1)}
        title={id ? "Editar Fornecedor" : "Cadastro de Fornecedor"}
      />
      <DefaultPageContainer>
        <FormFornecedor />
      </DefaultPageContainer>
    </>
  );
}
