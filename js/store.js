// js/store.js
// Persistência do progresso (conquistas e períodos climáticos visitados)
// no localStorage, com importação/exportação em JSON.

const CHAVE_CONQUISTAS = 'conquistas';
const CHAVE_PERIODOS = 'periodos_visitados';
const CHAVE_RECORDES = 'quiz_recordes';
const VERSAO_EXPORTACAO = '2.0.0';

/** Acesso seguro ao localStorage (pode falhar em modo privado ou file://). */
function _storage() {
    try {
        return globalThis.localStorage || null;
    } catch (e) {
        return null;
    }
}

function _lerJSON(chave, padrao) {
    try {
        const bruto = _storage()?.getItem(chave);
        if (bruto === null || bruto === undefined) return padrao;
        const valor = JSON.parse(bruto);
        return valor ?? padrao;
    } catch (e) {
        return padrao;
    }
}

function _gravarJSON(chave, valor) {
    try {
        _storage()?.setItem(chave, JSON.stringify(valor));
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Conquistas no formato { id: dataISO }.
 * Versões anteriores salvavam { id: true } – ambos são aceitos.
 */
function lerConquistas() {
    const c = _lerJSON(CHAVE_CONQUISTAS, {});
    return c && typeof c === 'object' && !Array.isArray(c) ? c : {};
}

function conquistaObtida(id) {
    return !!lerConquistas()[id];
}

/** Desbloqueia uma conquista. Retorna true se for nova. */
function registrarConquista(id, agora = new Date()) {
    const conquistas = lerConquistas();
    if (conquistas[id]) return false;
    conquistas[id] = agora.toISOString();
    _gravarJSON(CHAVE_CONQUISTAS, conquistas);
    return true;
}

function contarConquistas(idsValidos) {
    const c = lerConquistas();
    const ids = idsValidos || Object.keys(c);
    return ids.filter(id => !!c[id]).length;
}

function lerPeriodosVisitados() {
    const p = _lerJSON(CHAVE_PERIODOS, []);
    return Array.isArray(p) ? p : [];
}

/** Registra um período climático visitado; retorna a lista atualizada. */
function registrarPeriodoVisitado(nome) {
    const lista = lerPeriodosVisitados();
    if (nome && !lista.includes(nome)) {
        lista.push(nome);
        _gravarJSON(CHAVE_PERIODOS, lista);
    }
    return lista;
}

// ------------------------------------------------------------
// Recordes do quiz (melhor aproveitamento por nível)
// ------------------------------------------------------------
function lerRecordes() {
    const r = _lerJSON(CHAVE_RECORDES, {});
    return r && typeof r === 'object' && !Array.isArray(r) ? r : {};
}

/** Salva o resultado se for o melhor aproveitamento do nível. Retorna true se for recorde. */
function registrarRecorde(nivel, acertos, total) {
    if (!total) return false;
    const recordes = lerRecordes();
    const atual = recordes[nivel];
    const pct = acertos / total;
    if (atual && atual.acertos / atual.total >= pct) return false;
    recordes[nivel] = { acertos, total };
    _gravarJSON(CHAVE_RECORDES, recordes);
    return true;
}

function resetarProgresso() {
    const s = _storage();
    try {
        s?.removeItem(CHAVE_CONQUISTAS);
        s?.removeItem(CHAVE_PERIODOS);
        s?.removeItem(CHAVE_RECORDES);
    } catch (e) { /* ignora */ }
}

// ------------------------------------------------------------
// Importação / exportação (funções puras + wrappers)
// ------------------------------------------------------------
function criarPayloadExportacao(conquistas, periodos, agora = new Date()) {
    return {
        app: 'PaleoLab Científico',
        versao: VERSAO_EXPORTACAO,
        dataExportacao: agora.toISOString(),
        conquistas: { ...conquistas },
        periodosVisitados: [...periodos]
    };
}

/**
 * Valida o conteúdo de um arquivo importado.
 * Ignora ids desconhecidos em vez de falhar, para tolerar versões futuras.
 * @returns {{ok:true, conquistas:object, periodos:string[], ignoradas:string[]} | {ok:false, erro:string}}
 */
function validarPayloadImportacao(dados, idsValidos, periodosValidos = ['Triássico', 'Jurássico', 'Cretáceo']) {
    if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        return { ok: false, erro: 'O arquivo não contém um objeto JSON.' };
    }
    const bruto = dados.conquistas;
    if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) {
        return { ok: false, erro: 'O arquivo não possui o campo "conquistas".' };
    }
    const conquistas = {};
    const ignoradas = [];
    Object.entries(bruto).forEach(([id, valor]) => {
        if (!idsValidos.includes(id)) { ignoradas.push(id); return; }
        if (valor === true) conquistas[id] = true;
        else if (typeof valor === 'string' && !Number.isNaN(Date.parse(valor))) conquistas[id] = valor;
    });
    const periodos = Array.isArray(dados.periodosVisitados)
        ? dados.periodosVisitados.filter(p => periodosValidos.includes(p))
        : [];
    return { ok: true, conquistas, periodos, ignoradas };
}

/** Mescla o progresso importado com o atual (nada é perdido). */
function aplicarImportacao(resultado) {
    if (!resultado || !resultado.ok) return false;
    const atuais = lerConquistas();
    const mescladas = { ...resultado.conquistas, ...atuais };
    const periodos = Array.from(new Set([...lerPeriodosVisitados(), ...resultado.periodos]));
    return _gravarJSON(CHAVE_CONQUISTAS, mescladas) && _gravarJSON(CHAVE_PERIODOS, periodos);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CHAVE_CONQUISTAS,
        CHAVE_PERIODOS,
        CHAVE_RECORDES,
        lerConquistas,
        conquistaObtida,
        registrarConquista,
        contarConquistas,
        lerPeriodosVisitados,
        registrarPeriodoVisitado,
        lerRecordes,
        registrarRecorde,
        resetarProgresso,
        criarPayloadExportacao,
        validarPayloadImportacao,
        aplicarImportacao
    };
}
