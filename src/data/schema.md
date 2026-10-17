# Schema dos dados

Todos os dados do site vivem em arquivos JSON dentro de `/src/data/`. Nenhum dado fica
hardcoded em componentes ou páginas — para atualizar o conteúdo do site, edite apenas
estes arquivos.

> Os valores marcados como `"PLACEHOLDER"` ou com prefixo `EXEMPLO -` são dados fictícios
> de demonstração e devem ser substituídos por dados reais, com fonte verificável, antes
> de qualquer publicação.

## `presidentes.json`

Lista de mandatos presidenciais cobertos pelo site.

| Campo               | Tipo   | Descrição                                                        |
|---------------------|--------|-------------------------------------------------------------------|
| `id`                 | string | Identificador único do mandato (slug), usado nas URLs e como chave estrangeira em outros arquivos. Ex: `lula-2023`. |
| `nome`               | string | Nome do presidente.                                                |
| `mandato_inicio`     | string | Data de início do mandato, formato `YYYY-MM-DD`.                   |
| `mandato_fim`        | string | Data de fim do mandato prevista pela Constituição, formato `YYYY-MM-DD`. Mantida mesmo para mandatos em andamento — é a data em que o mandato *deve* terminar, não uma confirmação de que já terminou. |
| `status_mandato`     | string | Um de: `em_andamento` ou `finalizado`. Controla os labels da UI (ex: "Fim do mandato" vs "Dado mais recente", "ponto de chegada" vs "situação atual") e evita apresentar dados parciais como se fossem o resultado final do mandato. |
| `partido_coligacao`  | string | Partido ou coligação que elegeu o presidente.                      |
| `foto`               | string | Caminho para a foto do presidente, relativo a `/public`.           |

## `eixos.json`

Grandes eixos temáticos usados para agrupar e filtrar propostas.

| Campo        | Tipo   | Descrição                                                          |
|--------------|--------|----------------------------------------------------------------------|
| `id`          | string | Identificador único do eixo (slug), referenciado pelo campo `eixo` em `propostas.json`. |
| `nome`        | string | Nome de exibição do eixo.                                            |
| `descricao`   | string | Breve descrição do que o eixo cobre.                                 |
| `cor`         | string | Cor (hex) usada para identificar visualmente o eixo em gráficos e badges. Não deve remeter a cores partidárias. |

## `propostas.json`

Cada registro é uma proposta de campanha específica, vinculada a um mandato e a um eixo.

| Campo                       | Tipo    | Descrição                                                                                     |
|-----------------------------|---------|-------------------------------------------------------------------------------------------------|
| `id`                         | string  | Identificador único da proposta, usado na URL `/proposta/[id]`.                                 |
| `presidente_id`              | string  | Referência ao `id` em `presidentes.json`.                                                        |
| `eixo`                       | string  | Referência ao `id` em `eixos.json`.                                                               |
| `categoria`                  | string  | Subcategoria livre dentro do eixo (ex: "Combate à fome", "Emprego").                              |
| `titulo`                     | string  | Título curto e objetivo da proposta.                                                              |
| `descricao_original`         | string  | Texto resumido da proposta, o mais próximo possível do documento/discurso original.               |
| `fonte_proposta`             | string  | URL ou nome do documento onde a proposta foi feita (plano de governo, discurso, entrevista, etc). |
| `referencia_documento`       | string  | Localização da proposta dentro do documento (ex: "p. 17 - Redução de Ministérios").              |
| `documento_url`              | string  | Caminho para o PDF do plano de governo, relativo a `/public` (ex: `/propostas-tse/lula.pdf`).     |
| `documento_pagina`           | number  | Página do PDF onde a proposta aparece.                                                            |
| `status`                     | string  | Um de: `cumprido`, `parcialmente_cumprido`, `em_andamento`, `nao_cumprido`, `nao_iniciado`.        |
| `percentual_cumprimento`     | number  | Percentual estimado de cumprimento (0-100), usado na barra de progresso.                          |
| `data_ultima_atualizacao`    | string  | Data da última revisão do status, formato `YYYY-MM-DD`.                                           |
| `evidencias`                 | array   | Lista de evidências que sustentam o status atual.                                                 |
| `evidencias[].descricao`     | string  | Descrição da evidência (ex: notícia, dado oficial, projeto de lei).                                |
| `evidencias[].fonte_url`     | string  | URL da fonte da evidência.                                                                         |
| `evidencias[].data`          | string  | Data da evidência, formato `YYYY-MM-DD`.                                                           |

### Valores possíveis de `status`

- `cumprido` — a proposta foi integralmente realizada. Sempre com `percentual_cumprimento: 100`; havendo ressalva relevante, use `parcialmente_cumprido`.
- `parcialmente_cumprido` — parte da proposta foi realizada, mas não integralmente.
- `em_andamento` — ações estão em curso, mas o resultado final ainda não está definido.
- `nao_cumprido` — o mandato terminou (ou o prazo da proposta se esgotou) sem que ela fosse cumprida.
- `nao_iniciado` — nenhuma ação relevante foi tomada até o momento.

Os critérios detalhados para atribuir cada status estão descritos na página `/metodologia`.

## `indicadores.json`

Métricas objetivas comparando o início e o fim de cada mandato.

| Campo                    | Tipo   | Descrição                                                                 |
|--------------------------|--------|------------------------------------------------------------------------------|
| `id`                      | string | Identificador único do indicador.                                            |
| `presidente_id`           | string | Referência ao `id` em `presidentes.json`.                                     |
| `nome`                    | string | Nome de exibição do indicador.                                                |
| `unidade`                 | string | Unidade de medida (ex: `%`, `R$`, `km²`).                                     |
| `tipo_valor`              | string | Opcional. `inicio_fim` (padrão), `total_mandato` ou `media_anual`. Define quais campos de valor abaixo são usados. |
| `valor_inicio_mandato`    | string | (`inicio_fim`) Valor do indicador no início do mandato. Numérico como string, ou `"PLACEHOLDER"` enquanto não preenchido. |
| `valor_fim_mandato`       | string | (`inicio_fim`) Valor do indicador no fim do mandato (ou mais recente disponível). Mesma regra acima. |
| `valor_total_mandato`     | string | (`total_mandato`) Soma do indicador no mandato. Só é comparável entre mandatos de mesma duração. |
| `valor_media_anual`       | string | (`media_anual`) Média anual do indicador no mandato, calculada apenas com anos completos. Preferível a `total_mandato` quando um dos mandatos está em andamento. |
| `fonte`                   | string | Fonte oficial do dado (ex: IBGE, Banco Central, INPE), com o período de referência entre parênteses antes do link. |
| `categoria`               | string | Categoria do indicador, usada para agrupar entre mandatos na página `/comparar`. Ex: `desemprego`, `inflacao`, `pib`, `divida_publica`, `salario_minimo`, `salario_minimo_real`, `produtividade`, `cambio`, `meio_ambiente`, `extrema_pobreza`, `homicidios`, `aprovacao_popular`. |

> Ao preencher `valor_inicio_mandato` e `valor_fim_mandato` com números reais, o
> `IndicatorComparisonCard` calcula automaticamente a variação percentual e mostra
> se houve melhora ou piora. Enquanto o valor for `"PLACEHOLDER"`, o card exibe o
> aviso de dado pendente em vez de uma variação.
>
> Quando `presidentes.json` marca o mandato como `status_mandato: "em_andamento"`,
> o label do segundo valor muda de "Fim do mandato" para "Dado mais recente" e o
> texto de variação passa a dizer "até o momento" — deixando claro que `valor_fim_mandato`
> ainda é um corte parcial, não o resultado final do mandato.

## Como adicionar um novo mandato

1. Adicione um registro em `presidentes.json`.
2. Adicione as propostas desse mandato em `propostas.json`, usando o mesmo `presidente_id`.
3. Adicione os indicadores desse mandato em `indicadores.json`, usando o mesmo `presidente_id`
   e, de preferência, as mesmas `categoria`s já usadas nos outros mandatos (para que a
   comparação em `/comparar` funcione).
