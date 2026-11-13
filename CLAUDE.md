# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
docker compose up --build   # start dev server (instala deps e roda npm run dev)
docker compose down         # parar os containers
```

Para comandos pontuais (lint, build, prettier):

```bash
docker compose run --rm app npm run build   # tsc + vite build
docker compose run --rm app npm run lint    # eslint com --fix, zero warnings
docker compose run --rm app npm run pretty  # prettier em todos os arquivos
```

No test suite is configured.

## Environment

Copy `.example.env` to `.env`. Required variables:

```
VITE_SUPABASE_URL=     # Supabase project URL
VITE_SUPABASE_TOKEN=   # Supabase anon key
VITE_PORT=             # dev server port (omit in production builds)
```

`VITE_PORT` also controls `vite.config.ts` base path: when present the base is `''`; when absent it becomes `/pfc-manutencoes/`.

## Architecture

Toda a comunicação com o backend é via **Supabase** (`src/supabaseClient.ts`). Queries usam `supabase.from(...)` diretamente nos arquivos de API de cada feature. Soft-delete: registros têm `deleted_at` e toda query filtra `.is("deleted_at", null)`.

### Feature-slice structure

```
src/features/<domain>/
  api/           # types.ts + one file per operation (list, create, update, delete, …)
  components/    # domain-specific UI components
  page-*.tsx     # routed page components
```

Domínios: `auth` e `admin/{produtos,categorias,fornecedores,movimentacoes,vendas,inventarios,orcamentos,relatorios,home}`.

Cada arquivo em `api/` exporta a função pura e o hook react-query correspondente (`createProduto` + `useCreateProduto`). Mutations invalidam as queries afetadas no `onSuccess` e disparam `notification.success`. Quando a invalidação atinge várias chaves, ela é extraída para um `api/invalidate.ts` (ver `vendas/api/invalidate.ts`).

### Modelo de dados

- **`produtos`** — catálogo. `preco_custo_atual` guarda o **último** custo de entrada (não a média); `margem` (%) alimenta o preço de venda sugerido. `estoque_minimo` só é usado para sinalização visual.
- **`movimentacoes`** — o livro-caixa do estoque, tipos `entrada | saida | perda`. Toda alteração de saldo passa por aqui; `produtos` não tem coluna de saldo.
- **`operacoes`** — cabeçalho de venda (`tipo: "saida"`, total, observação); as movimentações de saída são os itens filhos.
- **`inventarios` / `inventario_itens`** — contagem cíclica. Fechar o inventário gera as movimentações de ajuste.
- **`categorias`**, **`fornecedores`** — cadastros auxiliares.

Nenhuma tabela registra autoria (`created_by`) e não há entidade de cliente — os dados do cliente são digitados na hora de gerar o PDF e não são persistidos.

### Views e RPCs

A listagem de produtos e os relatórios leem da view **`v_estoque_atual`** (não da tabela `produtos`): ela agrega o saldo a partir das movimentações e expõe `quantidade_atual`, `abaixo_do_minimo`, `preco_custo_medio` e `valor_total_estoque`.

Escritas que alteram saldo são feitas por RPC, nunca por insert direto:

| RPC | Uso |
| --- | --- |
| `registrar_movimentacao` | entrada/saída/perda unitária |
| `registrar_venda` | venda com N itens (cabeçalho + movimentações), transacional |
| `excluir_venda` | soft-delete da venda e dos itens |
| `abrir_inventario` / `fechar_inventario` | snapshot das quantidades esperadas / geração dos ajustes |

`registrar_movimentacao` **rejeita** `preco_custo_unitario` em `saida`/`perda` e `preco_venda_unitario` em `entrada`. O SQL da função está em `src/features/admin/movimentacoes/api/_database.md` — mantenha esse arquivo em sincronia ao mexer na RPC.

### Data fetching pattern

API list functions return `Page<T>` (`src/types/interfaces.ts`). The `usePaginator` hook (`src/lib/use-paginator.ts`) wraps `react-query`'s `useQuery` and exposes an Ant Design-compatible `pagination` prop. Use it for every paginated table.

### Listas responsivas

Cada domínio com listagem tem um componente `*-table-or-list.tsx` que decide via `Grid.useBreakpoint()` entre a `Table` do Ant Design (desktop) e um `*-mobile-list.tsx` com cards (mobile). O app é usado principalmente no celular — toda listagem nova precisa das duas variantes.

Ações de linha usam `TableActions` com os presets `EditAction` / `DeleteAction` / `CustomAction` (`src/components/table-actions/table-actions.tsx`); confirmação de exclusão vem de `useConfirmDelete` (`src/lib/use-confirm-delete.tsx`).

### Formatação

`src/lib/utils.ts` tem `displayMoney`, `displayDate` e `displayCpfCnpj`. Atenção: as três retornam string vazia ou `"—"` para valores nulos — daí o padrão `displayMoney(x) || "—"` espalhado pelas telas.

### PDFs

Orçamento e comprovante de venda são gerados com `@react-pdf/renderer` sobre uma folha timbrada (`src/components/pdf/timbrado-styles.ts`, calibrada para a arte A4 em `timbrado-bg.png`). Renderizar o PDF é caro: os campos que alimentam o documento passam por `useDebouncedValue` antes de reconstruí-lo.

### Auth flow

`AuthContextProvider` (`src/features/auth/providers/auth-context.tsx`) stores the Supabase `User` object in `localStorage` under `authContext`. `Router` (`src/routes/index.tsx`) renders either `AuthRoutes` or `AdminRoutes` based on whether that context is set. The router uses `HashRouter`.

### Styling

Ant Design 5 with a custom theme defined inline in `App.tsx` (light + dark variants). Dark mode is toggled via `ThemeContext` (`src/contexts/theme-context.tsx`). Tailwind is also available but Ant Design tokens are the primary styling mechanism. The `@` alias resolves to `src/`.
