// js/main.js – Ponto de entrada: navegação (roteamento por hash), menu e eventos

console.log(`🚀 PaleoLab Científico v${VERSAO_APP}`);

// ------------------------------------------------------------
// Construção da navegação e dos painéis a partir de ABAS
// ------------------------------------------------------------
function construirNavegacao() {
    const nav = document.getElementById('nav-abas');
    const main = document.getElementById('paineis');
    nav.innerHTML = GRUPOS_ABAS.map(g => {
        const abas = ABAS.filter(a => a.grupo === g.id);
        if (!abas.length) return '';
        return `
            ${g.titulo ? `<p class="nav-grupo" id="nav-grupo-${g.id}" aria-hidden="true">${g.titulo}</p>` : ''}
            ${abas.map(a => `
                <button type="button" class="tab-btn" role="tab" id="btn-tab-${a.id}" data-tab="${a.id}"
                        aria-controls="tab-${a.id}" aria-selected="false" tabindex="-1">
                    <i class="bi ${a.icone}" aria-hidden="true"></i>
                    <span>${escapeHtml(a.titulo)}</span>
                    ${a.id === 'conquistas' ? '<span id="badge-conquistas" class="badge" hidden>0</span>' : ''}
                </button>`).join('')}`;
    }).join('');

    main.innerHTML = ABAS.map(a => `
        <section class="painel" id="tab-${a.id}" role="tabpanel" aria-labelledby="btn-tab-${a.id}" hidden>
            <header class="painel-cabecalho">
                <h2 tabindex="-1" id="titulo-${a.id}"><i class="bi ${a.icone}" aria-hidden="true"></i> ${escapeHtml(a.titulo)}</h2>
                <p>${escapeHtml(a.subtitulo)}</p>
            </header>
            <div class="painel-corpo" id="corpo-${a.id}"></div>
        </section>`).join('');
}

// ------------------------------------------------------------
// Navegação entre abas (com persistência de estado)
// ------------------------------------------------------------
function abaDoHash() {
    const id = (location.hash || '').replace(/^#\/?/, '');
    return obterAba(id) ? id : null;
}

async function navegarParaAba(abaId, { focar = true } = {}) {
    if (!obterAba(abaId)) abaId = 'inicio';
    if (location.hash !== `#/${abaId}`) {
        // atualiza a URL sem disparar uma segunda navegação
        history.pushState(null, '', `#/${abaId}`);
    }
    if (state.abaAtiva === abaId) { fecharMenu(); return; }
    state.abaAtiva = abaId;

    document.querySelectorAll('.painel').forEach(p => { p.hidden = p.id !== `tab-${abaId}`; });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const ativo = btn.dataset.tab === abaId;
        btn.classList.toggle('ativo', ativo);
        btn.setAttribute('aria-selected', String(ativo));
        btn.tabIndex = ativo ? 0 : -1;
    });

    const aba = obterAba(abaId);
    document.title = abaId === 'inicio' ? 'PaleoLab Científico – Laboratório Virtual de Paleontologia' : `${aba.titulo} · PaleoLab Científico`;
    fecharMenu();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });

    // Renderiza a aba apenas na primeira visita
    if (!state.initialized[abaId]) {
        state.initialized[abaId] = true;
        const corpo = document.getElementById(`corpo-${abaId}`);
        try {
            await aba.render(corpo);
        } catch (e) {
            console.error(`Erro ao renderizar a aba "${abaId}":`, e);
            corpo.innerHTML = htmlAlerta('erro', `<strong>Não foi possível carregar esta seção.</strong> ${escapeHtml(e.message || '')}`);
        }
    } else if (typeof aba.aoAtivar === 'function') {
        aba.aoAtivar();
    }

    // Bibliotecas que precisam medir o container visível
    if (abaId === 'deriva' && state.graficos.mapa) setTimeout(() => state.graficos.mapa.invalidateSize(), 50);
    if (abaId === 'arvore' && state.graficos.arvore) setTimeout(() => state.graficos.arvore.fit(), 50);

    if (focar) document.getElementById(`titulo-${abaId}`)?.focus({ preventScroll: true });
    anunciar(`${aba.titulo} aberta.`);
}

window.navegarParaAba = navegarParaAba;

// ------------------------------------------------------------
// Menu lateral (gaveta em telas pequenas)
// ------------------------------------------------------------
function abrirMenu() {
    document.body.classList.add('menu-aberto');
    document.getElementById('btn-menu').setAttribute('aria-expanded', 'true');
    document.querySelector('.tab-btn.ativo, .tab-btn')?.focus();
}

function fecharMenu() {
    if (!document.body.classList.contains('menu-aberto')) return;
    document.body.classList.remove('menu-aberto');
    const btn = document.getElementById('btn-menu');
    btn.setAttribute('aria-expanded', 'false');
    if (window.matchMedia('(max-width: 960px)').matches) btn.focus();
}

// ------------------------------------------------------------
// Eventos centralizados (sem nenhum onclick inline)
// ------------------------------------------------------------
function initEvents() {
    // Ações declarativas: <button data-action="nome">
    document.addEventListener('click', e => {
        const el = e.target.closest('[data-action]');
        if (el && !el.disabled) executarAcao(el.dataset.action, el, e);
    });

    // Abas
    const lista = document.getElementById('nav-abas');
    lista.addEventListener('click', e => {
        const btn = e.target.closest('.tab-btn');
        if (btn) navegarParaAba(btn.dataset.tab);
    });
    lista.addEventListener('keydown', e => {
        const botoes = [...lista.querySelectorAll('.tab-btn')];
        const atual = botoes.indexOf(document.activeElement);
        if (atual < 0) return;
        let alvo = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') alvo = botoes[(atual + 1) % botoes.length];
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') alvo = botoes[(atual - 1 + botoes.length) % botoes.length];
        else if (e.key === 'Home') alvo = botoes[0];
        else if (e.key === 'End') alvo = botoes[botoes.length - 1];
        if (alvo) { e.preventDefault(); alvo.focus(); }
    });

    // Navegação pelo histórico (voltar/avançar) e links #/aba.
    // Âncoras comuns (ex.: o link "Pular para o conteúdo") são ignoradas.
    const aoMudarUrl = () => {
        if (location.hash && !location.hash.startsWith('#/')) return;
        navegarParaAba(abaDoHash() || 'inicio', { focar: false });
    };
    window.addEventListener('popstate', aoMudarUrl);
    window.addEventListener('hashchange', aoMudarUrl);

    document.getElementById('btn-menu').addEventListener('click', () =>
        document.body.classList.contains('menu-aberto') ? fecharMenu() : abrirMenu());
    document.getElementById('sobreposicao').addEventListener('click', fecharMenu);
    document.getElementById('btn-tema').addEventListener('click', alternarTema);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharMenu(); });

    // Fecha diálogos ao clicar no fundo
    document.querySelectorAll('dialog').forEach(d => d.addEventListener('click', e => {
        if (e.target === d) d.close();
    }));
}

window.initEvents = initEvents;

// ------------------------------------------------------------
// Inicialização
// ------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    aplicarTema(temaInicial());
    construirNavegacao();
    initEvents();
    atualizarIndicadoresProgresso();
    navegarParaAba(abaDoHash() || 'inicio', { focar: false });
});
