Gaps que pesam já, com saídas começando

1. Venda agrupada / "carrinho" — hoje 1 venda com 4 itens = 4 movimentações soltas. Sem entidade venda você nunca consegue ticket médio, comprovante, devolução por venda, nem ver "o que foi vendido junto". Como é o começo da
   operação de saída, vale modelar agora antes de ter histórico bagunçado. Sugestão: tabela vendas (id, data, total, observação) + movimentacoes.venda_id opcional, e tela de saída que aceita N produtos.
2. Editar movimentação — só existe create/delete. Erro de digitação obriga apagar e recriar (perde rastro). Adicionar update na RPC, mesmo que recalcule o custo médio.
3. Preço de venda sugerido pela margem — o campo margem no produto já existe e o form de saída tem o preco_venda_unitario, mas não está auto-preenchendo com preco_custo_medio \* (1 + margem/100). É o uso natural do campo.
4. Scanner de código de barras — react-qr-scanner já está no projeto e não está em uso. Botão "📷" ao lado do SelectProduto no form de movimentação acelera muito o balcão (especialmente celular).
5. Botão "Saída rápida" direto da listagem de produtos e da home — evita 3 cliques para a operação mais frequente da fase atual.

Próximas em prioridade (depois que saída estiver fluindo)

Gaps que pesam já, com saídas começando

1. Venda agrupada / "carrinho" — hoje 1 venda com 4 itens = 4 movimentações soltas. Sem entidade venda você nunca consegue ticket médio, comprovante, devolução por venda, nem ver "o que foi vendido junto". Como é o começo da
   operação de saída, vale modelar agora antes de ter histórico bagunçado. Sugestão: tabela vendas (id, data, total, observação) + movimentacoes.venda_id opcional, e tela de saída que aceita N produtos.
2. Editar movimentação — só existe create/delete. Erro de digitação obriga apagar e recriar (perde rastro). Adicionar update na RPC, mesmo que recalcule o custo médio.
3. Preço de venda sugerido pela margem — o campo margem no produto já existe e o form de saída tem o preco_venda_unitario, mas não está auto-preenchendo com preco_custo_medio \* (1 + margem/100). É o uso natural do campo.
4. Scanner de código de barras — react-qr-scanner já está no projeto e não está em uso. Botão "📷" ao lado do SelectProduto no form de movimentação acelera muito o balcão (especialmente celular).
5. Botão "Saída rápida" direto da listagem de produtos e da home — evita 3 cliques para a operação mais frequente da fase atual.

Próximas em prioridade (depois que saída estiver fluindo)

6. Histórico do produto — abrir um produto e ver últimas N movimentações + gráfico simples de saldo no tempo. Você já tem os dados, é só uma aba.
7. Ajuste de inventário — quarto tipo de movimentação (ajuste) ou tela própria de contagem física que gera entrada/saída automática pela diferença. Importante na implantação justamente para acertar o que está no sistema com o
   que está na prateleira.
8. Devolução de venda — tipo de movimentação devolucao ou flag, ligada à venda original.
9. Sugestão de compra — lista de produtos abaixo do mínimo + quanto comprar (baseado em consumo médio dos últimos 30/60 dias). É a evolução natural do relatório de estoque mínimo.
10. Previsão de ruptura — "esse produto acaba em X dias no ritmo atual". Coluna adicional no relatório de estoque.

Análise gerencial

11. Lucratividade do período — saídas a preço de venda menos custo médio das saídas, total e por produto/categoria. Hoje o dashboard mostra entradas vs saídas em valor, mas não a margem real.
12. Curva ABC — quais 20% dos produtos respondem por 80% do faturamento. Útil para decidir o que nunca pode faltar.
13. Produtos parados — sem movimentação há X dias. Capital empatado.

Polimentos de baixo custo

14. Badge no menu "Estoque Mínimo" com a contagem (você já tem o número no dashboard).
15. Exportar CSV das listagens (movimentações, posição de estoque) — útil para contador/imposto.
16. PWA / instalável no celular — Vite tem plugin pronto. Como o uso provavelmente vai ser muito no celular, vira ícone na home e roda offline-lite.
17. Comprovante imprimível/compartilhável após registrar uma venda (PDF simples ou print) — fica natural depois que tiver entidade venda.
