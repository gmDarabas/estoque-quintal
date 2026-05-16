import DefaultPageContainer from "../../../components/page-container.tsx/page-container";
import FormProduto from "./components/form-produto";
import DefaultPageHeader from "@/components/page-header/page-header";
import { useNavigate } from "react-router-dom";

export default function PageCadastroProduto() {
  const navigate = useNavigate();

  return (
    <>
      <DefaultPageHeader
        onBack={() => navigate(-1)}
        title="Cadastro de Produto"
      />
      <DefaultPageContainer>
        <FormProduto />
      </DefaultPageContainer>
    </>
  );
}
