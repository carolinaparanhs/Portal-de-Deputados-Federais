import * as api from "./api.js";
import * as dados from "./processing.js";
import * as ui from "./ui.js";

const ITENS = 12;
const estado = { pagina: 1, nome: "", partido: "", uf: "" };
let contador = 0; 

async function carregar() {
  const minha = ++contador;
  ui.mostrarStatus("Carregando deputados…");
  try {
    const r = await api.listarDeputados({
      nome: estado.nome, siglaPartido: estado.partido, siglaUf: estado.uf,
      pagina: estado.pagina, itens: ITENS,
    });
    if (minha !== contador) return;
    const lista = (r.dados || []).map(dados.normalizarDeputado);
    ui.renderLista(lista, abrirDeputado);
    ui.renderPaginacao(estado.pagina, dados.totalPaginas(r.links));
    ui.mostrarStatus(lista.length ? "" : "Nenhum deputado encontrado. Tente outro nome ou limpe os filtros.");
  } catch (e) {
    if (minha !== contador) return;
    ui.renderLista([], abrirDeputado);
    ui.renderPaginacao(1, 1);
    ui.mostrarStatus(`Não foi possível carregar os deputados. ${e.message} Verifique a conexão e tente de novo.`, true);
  }
}

async function abrirDeputado(id) {
  const ano = new Date().getFullYear();
  ui.mensagemDetalhe("Carregando dados do parlamentar…");
  ui.abrirDetalhe();
  try {
    const detalhe = dados.normalizarDetalhe((await api.buscarDeputado(id)).dados);
    let despesas = null;
    try {
      despesas = dados.resumirDespesas((await api.buscarDespesas(id, ano)).dados);
    } catch { }
    ui.renderDetalhe(detalhe, despesas, ano);
  } catch (e) {
    ui.mensagemDetalhe(`Não foi possível carregar este parlamentar. ${e.message}`);
  }
}

function mudar(campo, valor) {
  estado[campo] = valor;
  estado.pagina = 1;
  carregar();
}

function iniciar() {
  const $ = (id) => document.getElementById(id);
  let espera;
  $("busca").addEventListener("input", (e) => {
    clearTimeout(espera);
    espera = setTimeout(() => mudar("nome", e.target.value.trim()), 350);
  });
  $("partido").addEventListener("change", (e) => mudar("partido", e.target.value));
  $("uf").addEventListener("change", (e) => mudar("uf", e.target.value));
  $("filtros").addEventListener("submit", (e) => e.preventDefault());
  $("limpar").addEventListener("click", () => {
    $("filtros").reset();
    Object.assign(estado, { pagina: 1, nome: "", partido: "", uf: "" });
    carregar();
  });
  $("anterior").addEventListener("click", () => { estado.pagina--; carregar(); });
  $("proxima").addEventListener("click", () => { estado.pagina++; carregar(); });
  $("fechar").addEventListener("click", ui.fecharDetalhe);

  carregar();

  
  api.buscarLegislaturaAtual().then((r) => ui.mostrarFonte(r.dados?.[0])).catch(() => ui.mostrarFonte(null));
  api.listarPartidos().then((r) => ui.preencherSelect("partido", r.dados.map((p) => [p.sigla, p.sigla]))).catch(() => {});
  api.listarUfs().then((r) => ui.preencherSelect("uf", r.dados.map((u) => [u.sigla, u.sigla]))).catch(() => {});
}

iniciar();
