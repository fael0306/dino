// js/app.js
// Núcleo da aplicação: registro de abas, registro de ações (eventos
// centralizados), conquistas e indicadores de progresso.

const VERSAO_APP = '2.1.0';

// ------------------------------------------------------------
// Estado global compartilhado entre as abas
// ------------------------------------------------------------
const state = {
    abaAtiva: null,
    initialized: {},      // abas já renderizadas (não re-renderizam ao voltar)
    graficos: {},         // instâncias Chart.js e Leaflet por nome
    escala: null,         // última comparação de escala (usada no PDF)
    simulacao: null,      // último resultado da simulação K-Pg (usado no PDF)
    quiz: null,           // último quiz concluído (usado no PDF)
    batalha: null         // última batalha concluída (usada no PDF)
};

// ------------------------------------------------------------
// Registro de abas
// ------------------------------------------------------------
const GRUPOS_ABAS = [
    { id: 'inicio', titulo: null },
    { id: 'explorar', titulo: 'Explorar' },
    { id: 'laboratorio', titulo: 'Laboratório' },
    { id: 'desafios', titulo: 'Desafios' }
];

const ABAS = [];

/**
 * @param {{id:string, titulo:string, subtitulo:string, icone:string, grupo:string,
 *          descricao?:string, render:(container:HTMLElement)=>void|Promise<void>}} aba
 */
function registrarAba(aba) {
    ABAS.push(aba);
}

function obterAba(id) {
    return ABAS.find(a => a.id === id) || null;
}

// ------------------------------------------------------------
// Registro de ações – um único ouvinte de clique delegado
// (substitui todos os antigos onclick="" inline)
// ------------------------------------------------------------
const ACOES = {};

/** Associa um nome de ação (atributo data-action) a uma função. */
function registrarAcao(nome, fn) {
    ACOES[nome] = fn;
}

function executarAcao(nome, elemento, evento) {
    const fn = ACOES[nome];
    if (!fn) {
        console.warn(`Ação não registrada: ${nome}`);
        return;
    }
    try {
        const r = fn(elemento, evento);
        if (r && typeof r.catch === 'function') {
            r.catch(e => {
                console.error(`Erro na ação "${nome}":`, e);
                toast('Algo deu errado. Tente novamente.', 'erro');
            });
        }
    } catch (e) {
        console.error(`Erro na ação "${nome}":`, e);
        toast('Algo deu errado. Tente novamente.', 'erro');
    }
}

// Navegação genérica: <button data-action="ir" data-aba="quiz">
registrarAcao('ir', el => navegarParaAba(el.dataset.aba));

// ------------------------------------------------------------
// Conquistas
// ------------------------------------------------------------
function desbloquearConquista(id) {
    const meta = CONQUISTAS_LISTA.find(c => c.id === id);
    if (!meta) return false;
    const nova = registrarConquista(id);
    if (nova) {
        toast(meta.descricao, 'conquista', { titulo: `Conquista desbloqueada: ${meta.titulo}`, duracao: 6000 });
        anunciar(`Conquista desbloqueada: ${meta.titulo}.`);
        atualizarIndicadoresProgresso();
    }
    return nova;
}

function atualizarIndicadoresProgresso() {
    const total = CONQUISTAS_LISTA.length;
    const obtidas = contarConquistas(CONQUISTAS_LISTA.map(c => c.id));
    const pct = Math.round((obtidas / total) * 100);

    document.querySelectorAll('[data-progresso="texto"]').forEach(el => { el.textContent = `${obtidas}/${total}`; });
    document.querySelectorAll('[data-progresso="barra"]').forEach(el => {
        el.style.width = `${pct}%`;
        const trilho = el.parentElement;
        if (trilho) {
            trilho.setAttribute('aria-valuenow', String(obtidas));
            trilho.setAttribute('aria-valuetext', `${obtidas} de ${total} conquistas`);
        }
    });
    const badge = document.getElementById('badge-conquistas');
    if (badge) {
        badge.textContent = String(obtidas);
        badge.hidden = obtidas === 0;
        badge.setAttribute('aria-label', `${obtidas} conquistas desbloqueadas`);
    }
    // Atualiza a aba de conquistas, se já estiver renderizada
    if (state.initialized.conquistas && typeof renderListaConquistas === 'function') {
        renderListaConquistas();
    }
}

// ------------------------------------------------------------
// Utilidades de interface compartilhadas pelas abas
// ------------------------------------------------------------
/** Troca imagens quebradas por um placeholder desenhado em canvas. */
function aplicarFallbackImagens(raiz) {
    raiz.querySelectorAll('img[data-fallback]').forEach(img => {
        const trocar = () => {
            if (img.dataset.fallbackAplicado) return;
            img.dataset.fallbackAplicado = '1';
            const [w, h] = (img.dataset.fallbackTamanho || '300x200').split('x').map(Number);
            img.src = gerarSilhuetaPlaceholder(img.dataset.fallback, w, h);
            img.classList.add('img-placeholder');
        };
        img.addEventListener('error', trocar, { once: true });
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) trocar();
    });
}

/** Gera <option>s a partir de uma lista de nomes. */
function htmlOpcoes(nomes, selecionado = null) {
    return nomes.map(n => `<option value="${escapeHtml(n)}"${n === selecionado ? ' selected' : ''}>${escapeHtml(n)}</option>`).join('');
}

/** Controle segmentado acessível (grupo de botões com aria-pressed). */
function htmlSegmentado(nomeGrupo, opcoes, valorAtual, rotuloAria) {
    return `<div class="segmentado" role="group" aria-label="${escapeHtml(rotuloAria)}" data-segmentado="${nomeGrupo}">
        ${opcoes.map(o => `<button type="button" class="segmento" data-valor="${escapeHtml(o.valor)}" aria-pressed="${o.valor === valorAtual}">
            ${o.icone ? `<i class="bi ${o.icone}" aria-hidden="true"></i>` : ''}<span>${escapeHtml(o.rotulo)}</span></button>`).join('')}
    </div>`;
}

/** Liga um controle segmentado a um callback (valor) => void. */
function ligarSegmentado(raiz, nomeGrupo, aoMudar) {
    const grupo = raiz.querySelector(`[data-segmentado="${nomeGrupo}"]`);
    if (!grupo) return;
    grupo.addEventListener('click', e => {
        const btn = e.target.closest('.segmento');
        if (!btn || !grupo.contains(btn)) return;
        grupo.querySelectorAll('.segmento').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        aoMudar(btn.dataset.valor, btn);
    });
}

function valorSegmentado(raiz, nomeGrupo) {
    const btn = raiz.querySelector(`[data-segmentado="${nomeGrupo}"] .segmento[aria-pressed="true"]`);
    return btn ? btn.dataset.valor : null;
}

/** Busca um dinossauro pelo nome nas duas bases. */
function buscarDinossauro(nome) {
    return DINOSSAUROS_REAIS.find(d => d.Nome === nome) || DINOSSAUROS_CLASSICOS.find(d => d.Nome === nome) || null;
}

/** Cores dos gráficos de acordo com o tema atual. */
function coresGrafico() {
    return {
        texto: cssVar('--texto-suave') || '#5a6a7a',
        grade: cssVar('--borda') || '#e5e0d5',
        fundo: cssVar('--superficie') || '#ffffff'
    };
}
