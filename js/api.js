const BASE = "https://dadosabertos.camara.leg.br/api/v2";

async function get(caminho, params = {}) {
  const url = new URL(BASE + caminho);
  for (const [chave, valor] of Object.entries(params)) {
    if (valor !== "" && valor != null) url.searchParams.set(chave, valor);
  }
  const resposta = await fetch(url, { headers: { Accept: "application/json" } });
  if (!resposta.ok) throw new Error(`A API respondeu com erro ${resposta.status}.`);
  return resposta.json();
}

export const listarDeputados = ({ nome, siglaPartido, siglaUf, pagina, itens }) =>
  get("/deputados", { nome, siglaPartido, siglaUf, pagina, itens, ordem: "ASC", ordenarPor: "nome" });

export const buscarDeputado = (id) => get(`/deputados/${id}`);

export const buscarDespesas = (id, ano) =>
  get(`/deputados/${id}/despesas`, { ano, itens: 100, ordem: "DESC", ordenarPor: "dataDocumento" });

export const listarPartidos = () => get("/partidos", { itens: 100, ordenarPor: "sigla" });

export const listarUfs = () => get("/referencias/deputados/siglaUF");

export const buscarLegislaturaAtual = () =>
  get("/legislaturas", { itens: 1, ordem: "DESC", ordenarPor: "id" });
