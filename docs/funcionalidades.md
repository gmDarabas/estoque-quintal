# Funcionalidades — Brainstorm

Levantamento de ideias para o sistema de controle de estoque familiar.
Dashboard não incluído (em andamento separado).

---

## Em desenvolvimento / planejado

### Movimentação via mensagem (WhatsApp / Telegram)

Bot que interpreta linguagem natural e registra movimentações automaticamente.

- Usuário envia: _"entrou 10 kg de farinha a R$5"_
- Um LLM pequeno (ex: Claude Haiku) extrai produto, tipo, quantidade e preço
- Resultado é enviado via webhook → Supabase
- Resposta de confirmação no próprio chat antes de gravar

**Desafio principal:** mapeamento do nome livre para o produto correto no banco (similaridade de texto ou sugestão interativa).

---

### Movimentação via nota fiscal

Upload de NF-e (XML SEFAZ) ou foto da nota → leitura automatizada → múltiplas movimentações de entrada agrupadas por lote.

- XML NF-e: parsing direto, dados estruturados (CNPJ fornecedor, itens, valores)
- Foto: OCR + LLM para extração
- Movimentações criadas com referência ao número da nota (agrupador de lote)
- Permite rastrear origem de cada lote e contestar fornecedor se necessário

---

## Outras ideias

### Alerta de estoque mínimo

O campo `estoque_minimo` já existe. Falta fechar o ciclo com notificação ativa.

- Trigger no Supabase detecta quando `quantidade_atual` cruza o limiar
- Notificação via: push (PWA), WhatsApp, e-mail
- Não depende do usuário abrir o app para saber que precisa comprar

---

### Lista de compras automática

Derivada direta dos produtos abaixo do mínimo.

- Gera lista com produto, quantidade atual, mínimo e sugestão de compra
- Exportável como PDF ou texto simples para WhatsApp
- Pode incluir fornecedor preferencial se a entidade Fornecedores existir

---

### Leitura de código de barras

`react-qr-scanner` já está declarado no projeto. Falta conectar ao fluxo de movimentação.

- Escaneia código de barras ou QR code no celular
- Sistema localiza o produto → usuário informa apenas a quantidade
- Ideal para uso durante recebimento de mercadoria
- Também útil na conferência de inventário (ver abaixo)

---

### Histórico de preço de custo

`preco_custo_unitario` já é gravado por movimentação e o custo médio é calculado.

- Gráfico de evolução do preço de compra por produto ao longo do tempo
- Ajuda a identificar aumentos de fornecedor e negociar reposição
- Pode alertar quando o preço de uma entrada está acima da média histórica

---

### Fornecedores

Entidade simples vinculada a entradas de estoque.

- Campos: nome, contato (telefone/e-mail), observações
- Vincula movimentações de entrada e notas fiscais a um fornecedor
- Aparece como sugestão na lista de compras automática
- Permite histórico de compras por fornecedor

---

### Múltiplos usuários com perfis

Auth já existe. Para uso familiar com mais de uma pessoa.

- Perfil **operador**: registra movimentações, confere inventário
- Perfil **admin**: edita produtos, vê relatórios, ajusta estoque
- Supabase RLS já suporta isso sem infraestrutura adicional

---

### Conferência de inventário

Fluxo periódico (mensal, trimestral) para validar o estoque físico contra o sistema.

**Fluxo proposto:**

1. **Abertura da conferência** — admin cria uma sessão de inventário com data e descrição (ex: "Inventário maio 2026"). O sistema gera uma lista de todos os produtos ativos com a quantidade atual registrada.

2. **Contagem física** — operador percorre o estoque produto a produto:
   - Escaneia código de barras ou seleciona da lista
   - Informa a quantidade contada fisicamente
   - Marca como **OK** se bate com o sistema, ou registra a quantidade real se divergir
   - Pode adicionar observação (ex: "embalagem danificada")

3. **Relatório de divergências** — ao finalizar, o sistema exibe:
   - Produtos sem divergência (✓)
   - Produtos com sobra (quantidade física > sistema)
   - Produtos com falta (quantidade física < sistema)
   - Produtos não contados

4. **Ajuste** — admin revisa as divergências e aprova os ajustes. Cada ajuste gera uma movimentação do tipo `ajuste_inventario` (positivo ou negativo) com referência à sessão de conferência.

5. **Fechamento** — sessão é fechada, estoque fica sincronizado. Histórico de conferências fica disponível para auditoria.

**Dados da sessão:**

```
conferencia_inventario: id, descricao, status (aberta/fechada), created_at, fechada_at
itens_conferencia:      id, conferencia_id, produto_id, qtd_sistema, qtd_contada, observacao, status (pendente/ok/ajustado)
```

**Por que isso importa:** sem conferência periódica, pequenas divergências acumulam (quebras não registradas, erros de digitação, furtos) e o sistema perde confiabilidade gradualmente.

---

## Priorização sugerida

| Prioridade | Funcionalidade            | Motivo                                                           |
| ---------- | ------------------------- | ---------------------------------------------------------------- |
| 1          | Código de barras          | Impacto imediato, sem integração externa                         |
| 2          | Alerta + lista de compras | Fecha o ciclo do `estoque_minimo` já existente                   |
| 3          | Conferência de inventário | Mantém a confiabilidade do sistema a longo prazo                 |
| 4          | Bot de mensagem           | Muito conveniente, mas depende de integração externa             |
| 5          | NF-e XML                  | Elimina digitação no recebimento, maior esforço de implementação |
| 6          | Validade de produtos      | Relevante se o negócio trabalha com perecíveis                   |
| 7          | Fornecedores              | Complementa lista de compras e rastreabilidade de notas          |
| 8          | Múltiplos usuários        | Quando mais de uma pessoa usar o sistema                         |
| 9          | Histórico de preço        | Analítico, útil após volume de dados acumulado                   |
