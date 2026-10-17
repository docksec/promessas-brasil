# Radar de Propostas

Site estático (sem backend, sem banco de dados) para acompanhar e comparar propostas de
campanha de presidentes do Brasil, no estilo "roadmap eleitoral": o que foi prometido, o
que foi cumprido, e como os principais indicadores do país mudaram do início ao fim de
cada mandato.

> Os dados em `/src/data/` são reais e cada um traz sua fonte: indicadores com o período de
> referência no campo `fonte`, e propostas com evidências datadas e com link. Antes de
> publicar alterações, confira cada novo número na fonte primária (IBGE, Banco Central,
> INPE, Diário Oficial/Planalto).

## Stack

- [Astro](https://astro.build) (site 100% estático, `output: "static"`)
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- Sem framework de UI (React/Vue), sem servidor, sem CMS, sem autenticação

## Rodando localmente

```sh
npm install
npm run dev
```

O site fica disponível em `http://localhost:4321`.

Para gerar o build de produção (arquivos estáticos em `./dist/`, prontos para Vercel,
Netlify ou qualquer hosting estático):

```sh
npm run build
npm run preview   # opcional: serve o build localmente para conferir
```

## Estrutura do projeto

```text
/src
  /components       Componentes reutilizáveis (cards, badges, tabelas, filtros)
  /data              TODOS os dados do site (JSON) + schema.md explicando os campos
  /layouts           Layout.astro (header, footer, aviso de neutralidade)
  /lib/data.ts        Funções e tipos para ler/consultar os dados JSON
  /pages
    index.astro                Home
    metodologia.astro          Metodologia (critérios de status, fontes, limitações)
    comparar.astro             Comparação entre dois mandatos
    /presidente/[id].astro     Página de um mandato específico
    /proposta/[id].astro       Página de detalhe de uma proposta
/public/images       Imagens estáticas (fotos de presidentes, etc.)
```

## Como editar os dados (sem mexer em código)

Todo o conteúdo do site — presidentes, propostas, eixos temáticos e indicadores — vive em
arquivos JSON dentro de `/src/data/`. **Não é necessário tocar em nenhum componente ou
página para atualizar o conteúdo.**

O arquivo [`src/data/schema.md`](./src/data/schema.md) documenta em detalhe cada campo de
cada arquivo. Resumo rápido:

- **`presidentes.json`** — lista de mandatos (nome, datas, partido/coligação, foto).
- **`eixos.json`** — os grandes eixos temáticos usados para agrupar/filtrar propostas
  (Economia, Meio Ambiente, etc).
- **`propostas.json`** — cada proposta de campanha, vinculada a um `presidente_id` e a um
  `eixo`, com status (`cumprido`, `parcialmente_cumprido`, `em_andamento`, `nao_cumprido`,
  `nao_iniciado`), percentual de cumprimento e lista de evidências com fonte.
- **`indicadores.json`** — métricas objetivas (desemprego, inflação, PIB, etc.) com valor
  no início e no fim de cada mandato e a fonte oficial.

### Para adicionar uma nova proposta

Adicione um objeto em `propostas.json` seguindo a estrutura já existente, com um `id`
único (ex: `proposta-0011`), referenciando um `presidente_id` já cadastrado em
`presidentes.json` e um `eixo` já cadastrado em `eixos.json`. A página do presidente e a
página de detalhe da proposta são geradas automaticamente a partir desse arquivo — não é
preciso criar nenhuma rota nova.

### Para adicionar um novo mandato/presidente

1. Adicione o registro em `presidentes.json`.
2. Adicione as propostas desse mandato em `propostas.json` (mesmo `presidente_id`).
3. Adicione os indicadores desse mandato em `indicadores.json` (mesmo `presidente_id`),
   reaproveitando as mesmas `categoria`s dos outros mandatos para que a página
   `/comparar` funcione corretamente.
4. Rode `npm run build` (ou `npm run dev`) — as páginas `/presidente/[id]` e
   `/proposta/[id]` são geradas automaticamente para todo novo registro.

### Substituindo valores PLACEHOLDER

Os campos com valor `"PLACEHOLDER"` (principalmente em `indicadores.json`) devem ser
substituídos por números reais, com a fonte oficial preenchida no campo `fonte`. Enquanto
o valor for `"PLACEHOLDER"`, o card de indicador exibe um aviso de "dado ainda não
preenchido" em vez de calcular uma variação.

### Página de doação (`/doacao`)

A página de doação lê `src/data/doacao.json`. Enquanto um campo estiver como `"PENDENTE"`,
o bloco correspondente aparece como "ainda não configurado".

- **`pix`** — `chave`, `nome_recebedor` e `cidade` do recebedor, exibidos na página.
  `copia_e_cola` é o código emitido pelo banco: quando preenchido, é usado sem alteração (o
  build falha se o CRC estiver inválido); se vazio, `src/lib/pix.ts` gera um BR Code estático,
  sem valor definido, a partir da chave. O QR Code é gerado no build a partir desse código.
  `link_pagamento` (opcional) é a página de cobrança do banco, mostrada como alternativa.
- **`web3forms_access_key`** — chave de acesso do [Web3Forms](https://web3forms.com), gerada
  com o e-mail que deve receber as solicitações de melhoria. O site é estático, então o envio
  do formulário é feito por esse serviço. A chave é pública por design (só permite enviar
  para o e-mail cadastrado nela).

## Metodologia

A página `/metodologia` descreve os critérios de cada status, as fontes usadas, a
frequência de atualização e as limitações da avaliação. Para alterá-la, edite
`src/pages/metodologia.astro`.

## Deploy

Projeto é build estático puro (`output: "static"`), compatível com Vercel e Netlify sem
configuração adicional além de apontar `npm run build` e a pasta `dist/` como saída.
