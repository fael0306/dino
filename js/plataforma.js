// js/plataforma.js – Modo aplicativo (versão Android)
//
// Ativado quando a página é aberta com ?plataforma=app ou quando o app nativo
// expõe a ponte window.PaleoLabNativo. Troca a barra lateral do site por uma
// navegação de aplicativo: barra superior com título e botão voltar, barra de
// navegação inferior, telas de seção ("hubs"), fichas em bottom sheet etc.

const MODO_APP = document.documentElement.getAttribute('data-plataforma') === 'app';

const SECOES_APP = [
    { id: 'inicio', titulo: 'Início', icone: 'bi-house', iconeAtivo: 'bi-house-fill' },
    { id: 'explorar', titulo: 'Explorar', icone: 'bi-compass', iconeAtivo: 'bi-compass-fill', subtitulo: 'Escalas, fósseis, mapas e o clima de outras eras' },
    { id: 'laboratorio', titulo: 'Laboratório', icone: 'bi-flask', iconeAtivo: 'bi-flask-fill', subtitulo: 'Simule, calcule e investigue como um paleontólogo' },
    { id: 'desafios', titulo: 'Desafios', icone: 'bi-trophy', iconeAtivo: 'bi-trophy-fill', subtitulo: 'Quiz, batalhas, conquistas e relatório' }
];

/** Seção (aba da barra inferior) a que uma aba pertence. */
function secaoDaAba(abaId) {
    if (SECOES_APP.some(s => s.id === abaId)) return abaId;
    return obterAba(abaId)?.grupo || 'inicio';
}

if (MODO_APP) {
    // --------------------------------------------------------
    // Telas de seção (hubs): listam os módulos de cada grupo
    // --------------------------------------------------------
    SECOES_APP.filter(s => s.id !== 'inicio').forEach(secao => {
        registrarAba({
            id: secao.id,
            titulo: secao.titulo,
            subtitulo: secao.subtitulo,
            icone: secao.iconeAtivo,
            grupo: 'hub', // fora de GRUPOS_ABAS: não aparece na barra lateral do site
            render(container) {
                const modulos = ABAS.filter(a => a.grupo === secao.id);
                container.innerHTML = `
                    <div class="lista-modulos">
                        ${modulos.map(a => `
                            <button type="button" class="item-modulo" data-action="ir" data-aba="${a.id}">
                                <span class="item-modulo-icone"><i class="bi ${a.icone}" aria-hidden="true"></i></span>
                                <span class="item-modulo-texto">
                                    <strong>${escapeHtml(a.titulo)}</strong>
                                    <span>${escapeHtml(a.descricao || a.subtitulo)}</span>
                                </span>
                                <i class="bi bi-chevron-right item-modulo-seta" aria-hidden="true"></i>
                            </button>`).join('')}
                    </div>`;
            }
        });
    });

    // --------------------------------------------------------
    // Barra superior e barra de navegação inferior
    // --------------------------------------------------------
    function construirInterfaceApp() {
        const conteudo = document.querySelector('.conteudo');

        const barra = document.createElement('header');
        barra.className = 'app-barra';
        barra.innerHTML = `
            <button type="button" class="app-barra-botao" id="app-voltar" aria-label="Voltar" hidden>
                <i class="bi bi-arrow-left" aria-hidden="true"></i>
            </button>
            <div class="app-barra-titulo">
                <span class="logo-icone app-logo" aria-hidden="true">🦴</span>
                <h1 id="app-titulo">PaleoLab</h1>
            </div>
            <button type="button" class="app-barra-botao" id="app-tema" aria-label="Alternar tema">
                <i class="bi bi-moon-stars" aria-hidden="true"></i>
            </button>`;
        conteudo.prepend(barra);

        const nav = document.createElement('nav');
        nav.className = 'app-nav';
        nav.setAttribute('aria-label', 'Navegação principal');
        nav.innerHTML = SECOES_APP.map(s => `
            <button type="button" class="app-nav-item" data-secao="${s.id}" aria-label="${s.titulo}">
                <span class="app-nav-indicador"><i class="bi ${s.icone}" aria-hidden="true"></i></span>
                <span class="app-nav-rotulo">${s.titulo}</span>
                ${s.id === 'desafios' ? '<span class="app-nav-badge" id="app-badge" hidden></span>' : ''}
            </button>`).join('');
        document.body.appendChild(nav);

        nav.addEventListener('click', e => {
            const item = e.target.closest('.app-nav-item');
            if (!item) return;
            vibrar(8);
            navegarParaAba(item.dataset.secao, { focar: false });
        });
        barra.querySelector('#app-voltar').addEventListener('click', () => voltarApp());
        barra.querySelector('#app-tema').addEventListener('click', () => { vibrar(8); alternarTema(); });

        // Barra superior ganha sombra quando a tela rola
        const atualizarSombra = () => barra.classList.toggle('rolada', window.scrollY > 4);
        window.addEventListener('scroll', atualizarSombra, { passive: true });
    }

    function atualizarInterfaceApp(abaId) {
        const aba = obterAba(abaId);
        const secao = secaoDaAba(abaId);
        const raiz = SECOES_APP.some(s => s.id === abaId);

        const titulo = document.getElementById('app-titulo');
        titulo.textContent = abaId === 'inicio' ? 'PaleoLab' : aba.titulo;
        document.querySelector('.app-barra').classList.toggle('na-raiz', raiz);
        document.querySelector('.app-logo').hidden = abaId !== 'inicio';
        document.getElementById('app-voltar').hidden = raiz;

        document.querySelectorAll('.app-nav-item').forEach(item => {
            const ativo = item.dataset.secao === secao;
            item.classList.toggle('ativo', ativo);
            item.setAttribute('aria-current', ativo ? 'page' : 'false');
            const s = SECOES_APP.find(x => x.id === item.dataset.secao);
            item.querySelector('i').className = `bi ${ativo ? s.iconeAtivo : s.icone}`;
        });

        // Animação de entrada: telas internas deslizam da direita
        const painel = document.getElementById(`tab-${abaId}`);
        painel.classList.remove('entrar-lado', 'entrar-fade');
        void painel.offsetWidth;
        painel.classList.add(raiz ? 'entrar-fade' : 'entrar-lado');
    }

    function atualizarIconeTema() {
        const btn = document.getElementById('app-tema');
        if (btn) btn.innerHTML = `<i class="bi ${temaAtual() === 'escuro' ? 'bi-sun' : 'bi-moon-stars'}" aria-hidden="true"></i>`;
        // Informa o app nativo para pintar a barra de status (cor do topo)
        // e a barra de navegação do sistema (cor da barra inferior)
        chamarNativo('temaMudou', { tema: temaAtual(), corTopo: cssVar('--fundo'), corBase: cssVar('--superficie') });
    }

    function atualizarBadgeApp() {
        const badge = document.getElementById('app-badge');
        if (!badge) return;
        const n = contarConquistas(CONQUISTAS_LISTA.map(c => c.id));
        badge.textContent = String(n);
        badge.hidden = n === 0;
    }

    // --------------------------------------------------------
    // Botão voltar (chamado pelo Android via evaluateJavascript)
    // --------------------------------------------------------
    /** @returns {boolean} true se o app tratou o "voltar"; false para fechar o app. */
    function voltarApp() {
        if (document.body.classList.contains('menu-aberto')) { fecharMenu(); return true; }
        const dialogo = [...document.querySelectorAll('dialog')].find(d => d.open);
        if (dialogo) { dialogo.close(); return true; }
        const atual = state.abaAtiva;
        if (atual === 'inicio') return false;
        const secao = secaoDaAba(atual);
        navegarParaAba(secao === atual ? 'inicio' : secao, { focar: false });
        return true;
    }

    function vibrar(ms) {
        chamarNativo('vibrar', { ms });
    }

    window.PaleoLabApp = { voltar: voltarApp };

    // --------------------------------------------------------
    // Ligações
    // --------------------------------------------------------
    document.addEventListener('DOMContentLoaded', () => {
        construirInterfaceApp();
        atualizarIconeTema();
        atualizarBadgeApp();
    });
    document.addEventListener('paleolab:navegando', e => atualizarInterfaceApp(e.detail.aba));
    document.addEventListener('paleolab:tema', () => setTimeout(atualizarIconeTema, 0));

    // Mantém o contador de conquistas da barra inferior em dia
    const _atualizarIndicadoresOriginal = atualizarIndicadoresProgresso;
    atualizarIndicadoresProgresso = function () {
        _atualizarIndicadoresOriginal();
        atualizarBadgeApp();
    };

    // Um toque leve ao acertar/errar no quiz e ao desbloquear conquistas
    document.addEventListener('click', e => {
        if (e.target.closest('.quiz-opcao:not(:disabled), .segmento, .cartao-fossil, .item-modulo, .cartao-modulo')) vibrar(6);
    }, true);
}
