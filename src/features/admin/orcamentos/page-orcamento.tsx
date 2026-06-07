import DefaultPageHeader from "@/components/page-header/page-header";
import DefaultPageContainer from "@/components/page-container.tsx/page-container";
import FormOrcamento from "./components/form-orcamento";

export default function PageOrcamento() {
  return (
    <>
      <DefaultPageHeader title="Orçamento" />
      <DefaultPageContainer>
        <FormOrcamento />
      </DefaultPageContainer>
    </>
  );
}
