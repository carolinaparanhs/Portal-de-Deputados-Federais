# Portal de Deputados Federais

Site que consome a API de Dados Abertos da Câmara dos Deputados e exibe os deputados federais com busca, filtros, paginação e detalhes de cada parlamentar. 

## Tecnologias e justificativa
HTML, CSS e JavaScript puro (módulos ES e `fetch`). Foram escolhidos por não exigirem build nem dependências, por serem as tecnologias vistas na disciplina e por atenderem a todos os requisitos.

## Como executar
Módulos ES não funcionam abrindo o arquivo direto (`file://`). Use um servidor estático na pasta do projeto:

```bash
python3 -m http.server 8000
# ou: npx serve
```
Acesse `http://localhost:8000`.

## Funcionalidades
- Lista com nome, foto, partido e UF (12 por página)
- Busca por nome (com pequeno atraso para não consultar a cada tecla)
- Filtros por partido e UF, preenchidos pela própria API
- Paginação com base no link `last` retornado pela API
- Janela de detalhes: nome completo, situação, e-mail, gabinete e resumo de gastos do ano
- Mensagens de carregamento, resultado vazio e falha
- Campos ausentes exibidos como "Não informado"
- Layout responsivo
- Fonte e legislatura exibidas na página (os deputados não são apresentados como eleitos em 2026)

## Endereços consultados
Base: `https://dadosabertos.camara.leg.br/api/v2`
- `/deputados` (parâmetros `nome`, `siglaPartido`, `siglaUf`, `pagina`, `itens`, `ordem`, `ordenarPor`)
- `/deputados/{id}`
- `/deputados/{id}/despesas`
- `/partidos`
- `/referencias/deputados/siglaUF`
- `/legislaturas`

## Campos utilizados
- Listagem: `id`, `nome`, `siglaPartido`, `siglaUf`, `urlFoto`
- Detalhe: `nomeCivil`, `ultimoStatus` (`nome`, `siglaPartido`, `siglaUf`, `email`, `situacao`, `urlFoto`, `gabinete`)
- Despesas: `tipoDespesa`, `valorLiquido`
- Legislatura: `id`, `dataInicio`, `dataFim`

## Organização do código
- `js/api.js`: consulta HTTP
- `js/processing.js`: normalização e tratamento de dados ausentes
- `js/ui.js`: renderização
- `js/main.js`: eventos e fluxo

## Limitações
- Os gastos mostram só as 100 despesas mais recentes do ano corrente, não o total anual.
- A busca por nome depende do comportamento da API (correspondência por trecho do nome).
- Sem conexão ou com a API fora do ar, a página exibe mensagem de erro e não há cache.
