import { AUSENTE, moeda } from "./processing.js";

const $ = (id) => document.getElementById(id);

function el(tag, props = {}, ...filhos) {
  const e = Object.assign(document.createElement(tag), props);
  filhos.forEach((f) => e.append(f));
  return e;
}

export function mostrarStatus(mensagem, erro = false) {
  const s = $("status");
  s.textContent = mensagem;
  s.classList.toggle("erro", erro);
}

export function mostrarFonte(leg) {
  const periodo = leg
    ? `${leg.id}ª legislatura (${leg.dataInicio?.slice(0, 4)}–${leg.dataFim?.slice(0, 4)})`
    : "legislatura não identificada";
  $("fonte").textContent =
    `Fonte: API de Dados Abertos da Câmara dos Deputados. Consulta de deputados em exercício, ${periodo}.`;
}

export function preencherSelect(id, itens) {
  $(id).append(...itens.map(([valor, rotulo]) => el("option", { value: valor, textContent: rotulo })));
}

export function renderLista(deputados, aoAbrir) {
  $("lista").replaceChildren(
    ...deputados.map((d) => {
      const foto = el("img", { src: d.foto, alt: `Foto de ${d.nome}`, loading: "lazy" });
      foto.onerror = () => foto.removeAttribute("src");
      const card = el("button", { type: "button", className: "card" }, foto,
        el("div", {}, el("strong", { textContent: d.nome }), el("span", { textContent: `${d.partido} · ${d.uf}` })));
      card.onclick = () => aoAbrir(d.id);
      return card;
    })
  );
}

export function renderPaginacao(pagina, total) {
  $("pagina-info").textContent = `Página ${pagina} de ${total}`;
  $("anterior").disabled = pagina <= 1;
  $("proxima").disabled = pagina >= total;
}

const linha = (rotulo, valor) => [el("dt", { textContent: rotulo }), el("dd", { textContent: valor })];

export const abrirDetalhe = () => $("detalhe").showModal();
export const fecharDetalhe = () => $("detalhe").close();

export function renderDetalhe(d, despesas, ano) {
  const g = d.gabinete;
  const foto = el("img", { src: d.foto, alt: `Foto de ${d.nome}` });
  foto.onerror = () => foto.removeAttribute("src");

  const blocoDespesas = el("div", {});
  if (despesas === null) {
    blocoDespesas.append(el("p", { textContent: "Não foi possível carregar os gastos agora." }));
  } else if (despesas.quantidade === 0) {
    blocoDespesas.append(el("p", { textContent: `Sem gastos registrados em ${ano}.` }));
  } else {
    const tabela = el("table", {}, ...despesas.tipos.map(([tipo, v]) =>
      el("tr", {}, el("td", { textContent: tipo }), el("td", { textContent: moeda(v) }))));
    blocoDespesas.append(
      el("p", { textContent: `Total das ${despesas.quantidade} despesas mais recentes de ${ano}: ${moeda(despesas.total)}` }),
      tabela);
  }

  $("detalhe-conteudo").replaceChildren(
    el("div", { className: "perfil" }, foto,
      el("div", {}, el("h2", { id: "detalhe-titulo", textContent: d.nome }),
        el("span", { textContent: `${d.partido} · ${d.uf}` }))),
    el("dl", {}, ...linha("Nome completo", d.nomeCivil), ...linha("Situação", d.situacao),
      ...linha("E-mail", d.email), ...linha("Gabinete", g.nome),
      ...linha("Localização", g.predio === AUSENTE ? AUSENTE : `Prédio ${g.predio}, andar ${g.andar}, sala ${g.sala}`),
      ...linha("Telefone", g.telefone)),
    el("h2", { textContent: `Gastos em ${ano}` }),
    blocoDespesas
  );
}

export function mensagemDetalhe(texto) {
  $("detalhe-conteudo").replaceChildren(el("p", { textContent: texto }));
}
