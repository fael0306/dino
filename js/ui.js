// js/ui.js
// Componentes de interface reutilizáveis: toasts, diálogo de confirmação,
// tema claro/escuro, anúncios para leitores de tela e blocos de estado.

const CHAVE_TEMA = 'paleolab_tema';

// ------------------------------------------------------------
// Acessibilidade
// ------------------------------------------------------------
function anunciar(mensagem) {
    const el = document.getElementById('aria-announcer');
    if (!el) return;
    el.textContent = '';
    // pequeno atraso garante que leitores de tela percebam a mudança
    setTimeout(() => { el.textContent = mensagem; }, 30);
}

// ------------------------------------------------------------
// Toasts (substituem os antigos alert())
// ------------------------------------------------------------
const ICONES_TOAST = {
    sucesso: 'bi-check-circle-fill',
    erro: 'bi-x-octagon-fill',
    aviso: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill',
    conquista: 'bi-trophy-fill'
};

function toast(mensagem, tipo = 'info', { titulo = null, duracao = 4200 } = {}) {
    const area = document.getElementById('toast-area');
    if (!area) return;
    const el = document.createElement('div');
    el.className = `toast toast-${tipo}`;
    el.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
    el.innerHTML = `
        <i class="bi ${ICONES_TOAST[tipo] || ICONES_TOAST.info} toast-icone" aria-hidden="true"></i>
        <div class="toast-corpo">
            ${titulo ? `<strong class="toast-titulo">${escapeHtml(titulo)}</strong>` : ''}
            <span>${escapeHtml(mensagem)}</span>
        </div>
        <button type="button" class="toast-fechar" aria-label="Fechar notificação"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    `;
    const remover = () => {
        el.classList.add('saindo');
        setTimeout(() => el.remove(), 250);
    };
    el.querySelector('.toast-fechar').addEventListener('click', remover);
    area.appendChild(el);
    if (duracao > 0) setTimeout(remover, duracao);
    return el;
}

// ------------------------------------------------------------
// Diálogo de confirmação acessível (usa <dialog>)
// ------------------------------------------------------------
function confirmar(mensagem, { titulo = 'Confirmar', textoOk = 'Confirmar', perigo = false } = {}) {
    return new Promise(resolve => {
        const dialog = document.getElementById('dialogo-confirmacao');
        if (!dialog || typeof dialog.showModal !== 'function') {
            resolve(window.confirm(mensagem));
            return;
        }
        dialog.querySelector('[data-dialogo="titulo"]').textContent = titulo;
        dialog.querySelector('[data-dialogo="mensagem"]').textContent = mensagem;
        const ok = dialog.querySelector('[data-dialogo="ok"]');
        ok.textContent = textoOk;
        ok.classList.toggle('btn-perigo', perigo);
        ok.classList.toggle('btn-primario', !perigo);
        const aoFechar = () => {
            dialog.removeEventListener('close', aoFechar);
            resolve(dialog.returnValue === 'ok');
        };
        dialog.addEventListener('close', aoFechar);
        dialog.returnValue = '';
        dialog.showModal();
    });
}

// ------------------------------------------------------------
// Tema claro / escuro
// ------------------------------------------------------------
function temaAtual() {
    return document.documentElement.getAttribute('data-tema') || 'claro';
}

function temaInicial() {
    try {
        const salvo = localStorage.getItem(CHAVE_TEMA);
        if (salvo === 'claro' || salvo === 'escuro') return salvo;
    } catch (e) { /* ignora */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
}

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    const botao = document.getElementById('btn-tema');
    if (botao) {
        const escuro = tema === 'escuro';
        botao.setAttribute('aria-pressed', String(escuro));
        botao.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
        botao.innerHTML = `<i class="bi ${escuro ? 'bi-sun' : 'bi-moon-stars'}" aria-hidden="true"></i>`;
    }
    document.dispatchEvent(new CustomEvent('paleolab:tema', { detail: { tema } }));
}

function alternarTema() {
    const novo = temaAtual() === 'escuro' ? 'claro' : 'escuro';
    try { localStorage.setItem(CHAVE_TEMA, novo); } catch (e) { /* ignora */ }
    aplicarTema(novo);
    anunciar(`Tema ${novo} ativado.`);
}

/** Lê uma variável CSS do tema atual (ex.: cssVar('--texto')). */
function cssVar(nome) {
    return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

// ------------------------------------------------------------
// Blocos de estado
// ------------------------------------------------------------
function htmlCarregando(texto = 'Carregando...') {
    return `<div class="estado-carregando" role="status"><span class="spinner" aria-hidden="true"></span><span>${escapeHtml(texto)}</span></div>`;
}

function htmlVazio(icone, texto) {
    return `<div class="estado-vazio"><i class="bi ${icone}" aria-hidden="true"></i><p>${escapeHtml(texto)}</p></div>`;
}

function htmlAlerta(tipo, conteudoHtml, icone = null) {
    const icones = { sucesso: 'bi-check-circle', erro: 'bi-x-octagon', aviso: 'bi-exclamation-triangle', info: 'bi-info-circle' };
    return `<div class="alerta alerta-${tipo}" role="${tipo === 'erro' ? 'alert' : 'status'}">
        <i class="bi ${icone || icones[tipo]}" aria-hidden="true"></i><div>${conteudoHtml}</div></div>`;
}

/** Aviso exibido quando uma biblioteca externa não carrega. */
function htmlBibliotecaIndisponivel(nomeLib, acaoRetentar) {
    return `
        <div class="alerta alerta-aviso alerta-lib" role="alert">
            <i class="bi bi-wifi-off" aria-hidden="true"></i>
            <div>
                <strong>Não foi possível carregar ${escapeHtml(nomeLib)}.</strong>
                <p>Este recurso precisa de internet para baixar a biblioteca. Verifique a conexão e tente novamente.</p>
                ${acaoRetentar ? `<button type="button" class="btn btn-secundario btn-sm" data-action="${acaoRetentar}"><i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Tentar novamente</button>` : ''}
            </div>
        </div>`;
}

// ------------------------------------------------------------
// Ponte com o app Android
// ------------------------------------------------------------
/**
 * Envia uma mensagem ao app nativo. O app injeta window.PaleoLabNativo
 * (somente na página principal, nunca em iframes) com o método postMessage.
 * @returns {boolean} false quando a página não está rodando dentro do app.
 */
function chamarNativo(acao, dados = {}) {
    const nativo = window.PaleoLabNativo;
    if (!nativo || typeof nativo.postMessage !== 'function') return false;
    try {
        nativo.postMessage(JSON.stringify({ acao, ...dados }));
        return true;
    } catch (e) {
        console.error('Falha ao chamar o app nativo:', e);
        return false;
    }
}

function estaNoAppNativo() {
    return !!(window.PaleoLabNativo && typeof window.PaleoLabNativo.postMessage === 'function');
}

// ------------------------------------------------------------
// Download de arquivos (funciona no navegador e no app Android)
// ------------------------------------------------------------
function _blobParaBase64(blob) {
    return new Promise((resolve, reject) => {
        const leitor = new FileReader();
        leitor.onload = () => resolve(String(leitor.result).split(',')[1] || '');
        leitor.onerror = reject;
        leitor.readAsDataURL(blob);
    });
}

/**
 * Salva um arquivo. No app Android, envia o conteúdo ao app (o WebView não
 * suporta <a download>); o app grava em Downloads/PaleoLab e oferece abrir
 * ou compartilhar. No navegador, faz o download normal.
 * @returns {Promise<boolean>}
 */
async function baixarArquivo(blob, nomeArquivo) {
    if (estaNoAppNativo()) {
        const base64 = await _blobParaBase64(blob);
        return chamarNativo('salvarArquivo', { nome: nomeArquivo, mime: blob.type || 'application/octet-stream', base64 });
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
}
