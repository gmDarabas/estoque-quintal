# Sistema de Estoque - Front End

<div align="center">
  <img src="./public/logo.jpg" alt="logo">
</div>

<br>

## Descrição do Projeto

Sistema web de controle de estoque desenvolvido com React e Supabase. Permite o cadastro e gerenciamento de produtos organizados por categorias, com controle de quantidade atual, estoque mínimo e foto do produto.

## Objetivo

Oferecer uma interface simples e funcional para gestão de estoque, com alertas visuais de produtos abaixo do estoque mínimo e upload de fotos para identificação rápida dos itens.

## Funcionalidades

- Autenticação de usuários
- Cadastro e listagem de produtos
- Categorias com criação inline no formulário de produto
- Controle de quantidade atual e estoque mínimo
- Indicador visual de produtos abaixo do estoque mínimo
- Upload e compressão automática de foto do produto
- Soft delete (registros não são apagados fisicamente do banco)

## Tecnologias

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ant Design](https://ant-design.antgroup.com/)
- [Supabase](https://supabase.com/) (banco de dados e storage)
- [React Query](https://tanstack.com/query/v3)
- [React Router](https://reactrouter.com/)

## Instalar e Rodar

```bash
npm install

npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_TOKEN=sua_chave_anonima_do_supabase
```

## Configuração do Supabase

Tabelas necessárias: `categorias`, `produtos`

Bucket de storage necessário: `fotos_produto` (público)
