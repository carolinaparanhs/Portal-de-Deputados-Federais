export const AUSENTE = "Não informado";
const texto = (v) => (v && String(v).trim() ? String(v).trim() : AUSENTE);

export function normalizarDeputado(d) {
  return {
    id: d.id,
    nome: texto(d.nome),
    partido: texto(d.siglaPartido),
    uf: texto(d.siglaUf),
    foto: d.urlFoto || "",
  };
}

export function normalizarDetalhe(d) {
  const s = d.ultimoStatus || {};
  const g = s.gabinete || {};
  return {
    nomeCivil: texto(d.nomeCivil),
    nome: texto(s.nome),
    partido: texto(s.siglaPartido),
    uf: texto(s.siglaUf),
    foto: s.urlFoto || "",
    email: texto(s.email),
    situacao: texto(s.situacao),
    gabinete: {
      nome: texto(g.nome), predio: texto(g.predio), sala: texto(g.sala),
      andar: texto(g.andar), telefone: texto(g.telefone),
    },
  };
}

export function totalPaginas(links = []) {
  const ultimo = links.find((l) => l.rel === "last");
  if (!ultimo) return 1;
  return Number(new URL(ultimo.href).searchParams.get("pagina")) || 1;
}

export function resumirDespesas(lista = []) {
  const porTipo = new Map();
  let total = 0;
  for (const d of lista) {
    const valor = Number(d.valorLiquido) || 0;
    const tipo = d.tipoDespesa || "Sem classificação";
    total += valor;
    porTipo.set(tipo, (porTipo.get(tipo) || 0) + valor);
  }
  const tipos = [...porTipo].sort((a, b) => b[1] - a[1]).slice(0, 5);
  return { total, tipos, quantidade: lista.length };
}

export const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
