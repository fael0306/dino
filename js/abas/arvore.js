// js/abas/arvore.js – Árvore evolutiva vertical (estilo árvore genealógica)
// Desenhada só com HTML e CSS: não depende de bibliotecas externas,
// funciona offline e cada clado é um botão navegável pelo teclado.

const CORES_CLADOS = {
    Reptilia: '#5b6b7a', Archosauria: '#6d5a8c', Dinosauria: '#c0622d', Pterosauria: '#3f7cac',
    Saurischia: '#3d8b5a', Ornithischia: '#c98b2b', Theropoda: '#b5452f', Sauropodomorpha: '#7b55a3',
    Tyrannosauridae: '#d1553b', Dromaeosauridae: '#e0883a', Spinosauridae: '#a8562a', Brachiosauridae: '#4aa36b',
    Diplodocidae: '#2f9b8f', Ceratopsia: '#3d86c6', Ornithopoda: '#8d63b8', Stegosauria: '#b08a17',
    Ankylosauria: '#b07a3a', Sauropterygia: '#2a8c8c', Plesiosauria: '#2b7a6b', Ichthyosauria: '#3c6fa0'
};

/** Ícone para clados sem espécie no museu (grupos que não são dinossauros). */
const ICONES_CLADOS = {
    Reptilia: '🦎', Archosauria: '🐊', Pterosauria: 'bi-wind',
    Sauropterygia: 'bi-water', Plesiosauria: 'bi-tsunami', Ichthyosauria: '🐬'
};

const arvoreEstado = { selecionado: 'Dinosauria', escala: 1, ajustar: true };

function _exemplos(clado) {
    return exemplosDoClado(clado, ARVORE_ARESTAS, CLADO_DINOSSAURO, DINOSSAUROS_REAIS);
}

function _ehDinossauro(clado) {
    return cladoEDescendentes('Dinosauria', ARVORE_ARESTAS).includes(clado);
}

/** Espécie que "representa" o clado na foto: primeiro uma do próprio clado, depois dos descendentes. */
function _representante(clado) {
    const proprios = DINOSSAUROS_REAIS.filter(d => CLADO_DINOSSAURO[d.Nome] === clado);
    return (proprios[0] || _exemplos(clado)[0] || null);
}

function _ancestrais(clado) {
    const lista = [];
    let atual = clado;
    for (;;) {
        const aresta = ARVORE_ARESTAS.find(([, filho]) => filho === atual);
        if (!aresta) break;
        lista.unshift(aresta[0]);
        atual = aresta[0];
    }
    return lista;
}

function _avatarClado(clado) {
    const rep = _representante(clado);
    if (rep) {
        return `<img src="${caminhoImagemFossil(rep.Nome)}" alt="" loading="lazy" data-fallback="${escapeHtml(rep.Nome)}" data-fallback-tamanho="120x120">`;
    }
    const icone = ICONES_CLADOS[clado] || 'bi-diagram-3';
    return icone.startsWith('bi-') ? `<i class="bi ${icone}" aria-hidden="true"></i>` : `<span class="emoji" aria-hidden="true">${icone}</span>`;
}

function _htmlNoArvore(no) {
    const n = _exemplos(no.nome).length;
    const contagem = n ? `${n} ${n === 1 ? 'espécie' : 'espécies'}` : 'não é dinossauro';
    return `
        <li>
            <button type="button" class="no-clado" data-clado="${no.nome}" style="--cor-clado:${CORES_CLADOS[no.nome] || '#888'}"
                    aria-pressed="false" aria-label="${no.nome}: ${contagem}">
                <span class="no-avatar">${_avatarClado(no.nome)}</span>
                <span class="no-texto"><strong>${no.nome}</strong><small>${contagem}</small></span>
            </button>
            ${no.filhos.length ? `<ul>${no.filhos.map(_htmlNoArvore).join('')}</ul>` : ''}
        </li>`;
}

registrarAba({
    id: 'arvore',
    titulo: 'Árvore Evolutiva',
    subtitulo: 'O "parentesco" entre os grandes grupos de répteis, como numa árvore genealógica',
    descricao: 'Árvore genealógica dos dinossauros e parentes, com exemplos.',
    icone: 'bi-diagram-3',
    grupo: 'explorar',
    render(container) {
        container.innerHTML = `
            <div class="cartao arvore-cartao">
                <div class="cartao-cabecalho">
                    <p class="texto-suave">Toque em um grupo para ver quem faz parte dele. Quanto mais abaixo, mais específico o grupo. Arraste para os lados para ver a árvore inteira.</p>
                    <div class="arvore-zoom" role="group" aria-label="Zoom da árvore">
                        <button type="button" class="btn-icone btn-icone-sm" data-action="arvore-zoom" data-zoom="-1" aria-label="Diminuir zoom"><i class="bi bi-zoom-out" aria-hidden="true"></i></button>
                        <button type="button" class="btn btn-secundario btn-sm" data-action="arvore-zoom" data-zoom="0"><i class="bi bi-arrows-angle-contract" aria-hidden="true"></i> Ajustar</button>
                        <button type="button" class="btn-icone btn-icone-sm" data-action="arvore-zoom" data-zoom="1" aria-label="Aumentar zoom"><i class="bi bi-zoom-in" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div class="arvore-viewport" id="arvore-viewport">
                    <div class="arvore-sizer" id="arvore-sizer">
                        <ul class="arvore-org" id="arvore-org">${_htmlNoArvore(construirArvore(ARVORE_ARESTAS))}</ul>
                    </div>
                </div>
            </div>
            <section class="cartao arvore-painel" id="arvore-painel" aria-live="polite"></section>
        `;
        aplicarFallbackImagens(container);
        container.querySelector('#arvore-org').addEventListener('click', e => {
            const btn = e.target.closest('.no-clado');
            if (btn) mostrarClado(btn.dataset.clado, { rolar: true });
        });
        window.addEventListener('resize', debounce(() => { if (arvoreEstado.ajustar) ajustarArvore(); }, 150));
        mostrarClado(arvoreEstado.selecionado);
        requestAnimationFrame(ajustarArvore);
    },
    aoAtivar: () => requestAnimationFrame(() => { if (arvoreEstado.ajustar) ajustarArvore(); else aplicarEscalaArvore(); })
});

// ------------------------------------------------------------
// Zoom
// ------------------------------------------------------------
function aplicarEscalaArvore() {
    const org = document.getElementById('arvore-org');
    const sizer = document.getElementById('arvore-sizer');
    if (!org || !sizer || !org.offsetParent) return;
    org.style.transform = 'none';
    const largura = org.scrollWidth, altura = org.scrollHeight;
    const s = arvoreEstado.escala;
    org.style.transform = `scale(${s})`;
    sizer.style.width = `${Math.ceil(largura * s)}px`;
    sizer.style.height = `${Math.ceil(altura * s)}px`;
}

/** Cabe a árvore na largura disponível (sem ficar pequena demais para tocar). */
function ajustarArvore() {
    const viewport = document.getElementById('arvore-viewport');
    const org = document.getElementById('arvore-org');
    if (!viewport || !org || !viewport.offsetParent) return;
    org.style.transform = 'none';
    const largura = org.scrollWidth;
    // Abaixo disso os nomes ficam pequenos demais; a árvore passa a rolar para os lados
    const minimo = window.matchMedia('(max-width: 720px)').matches ? 0.62 : 0.72;
    arvoreEstado.escala = Math.max(minimo, Math.min(1, (viewport.clientWidth - 8) / largura));
    arvoreEstado.ajustar = true;
    aplicarEscalaArvore();
    // Se ainda for mais larga que a tela, centraliza no clado selecionado
    centralizarNoClado(arvoreEstado.selecionado);
}

function centralizarNoClado(clado) {
    const viewport = document.getElementById('arvore-viewport');
    const no = viewport?.querySelector(`.no-clado[data-clado="${clado}"]`);
    if (!viewport || !no || viewport.scrollWidth <= viewport.clientWidth) return;
    const r = no.getBoundingClientRect(), v = viewport.getBoundingClientRect();
    viewport.scrollLeft += (r.left + r.width / 2) - (v.left + v.width / 2);
}

registrarAcao('arvore-zoom', el => {
    const passo = Number(el.dataset.zoom);
    if (passo === 0) { ajustarArvore(); return; }
    arvoreEstado.ajustar = false;
    arvoreEstado.escala = Math.max(0.35, Math.min(1.4, Math.round((arvoreEstado.escala + passo * 0.15) * 100) / 100));
    aplicarEscalaArvore();
});

// ------------------------------------------------------------
// Painel do clado selecionado
// ------------------------------------------------------------
function mostrarClado(nome, { rolar = false } = {}) {
    const painel = document.getElementById('arvore-painel');
    if (!painel || !CLADOS_INFO[nome]) return;
    arvoreEstado.selecionado = nome;
    const caminho = new Set(_ancestrais(nome));
    document.querySelectorAll('#arvore-org .no-clado').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.clado === nome));
        b.classList.toggle('no-caminho', caminho.has(b.dataset.clado));
    });

    const filhos = ARVORE_ARESTAS.filter(([p]) => p === nome).map(([, f]) => f);
    const ancestrais = _ancestrais(nome);
    const exemplos = _exemplos(nome);
    const extras = EXEMPLOS_EXTRAS_CLADOS[nome] || [];
    const LIMITE = 12;

    painel.innerHTML = `
        <div class="arvore-painel-topo" style="--cor-clado:${CORES_CLADOS[nome]}">
            <span class="no-avatar no-avatar-grande">${_avatarClado(nome)}</span>
            <div>
                <span class="eyebrow">${_ehDinossauro(nome) ? 'Grupo de dinossauros' : 'Não é dinossauro'}</span>
                <h3>${escapeHtml(nome)}</h3>
            </div>
        </div>
        <p class="lead">${escapeHtml(CLADOS_INFO[nome])}</p>
        ${ancestrais.length ? `<p class="texto-suave arvore-trilha"><strong>Linhagem:</strong> ${ancestrais.map(a => `<button type="button" class="link-botao" data-clado-ir="${a}">${a}</button>`).join(' <i class="bi bi-chevron-right" aria-hidden="true"></i> ')} <i class="bi bi-chevron-right" aria-hidden="true"></i> <strong>${escapeHtml(nome)}</strong></p>` : ''}
        ${filhos.length ? `<p class="texto-suave"><strong>Inclui:</strong> ${filhos.map(f => `<button type="button" class="link-botao" data-clado-ir="${f}">${f}</button>`).join(', ')}</p>` : ''}
        ${exemplos.length ? `
            <h4 class="subtitulo">Exemplos no museu (${exemplos.length})</h4>
            <div class="arvore-exemplos">
                ${exemplos.slice(0, LIMITE).map(d => `
                    <button type="button" class="arvore-exemplo" data-action="abrir-ficha" data-dino="${escapeHtml(d.Nome)}">
                        <img src="${caminhoImagemFossil(d.Nome)}" alt="" loading="lazy" data-fallback="${escapeHtml(d.Nome)}" data-fallback-tamanho="300x200">
                        <span><em>${escapeHtml(d.Nome)}</em><small>${escapeHtml(CLADO_DINOSSAURO[d.Nome])} · ${escapeHtml(d.Periodo)}</small></span>
                    </button>`).join('')}
            </div>
            ${exemplos.length > LIMITE ? `<p class="nota">E mais ${exemplos.length - LIMITE}. Toque num grupo mais abaixo na árvore para ver todos.</p>` : ''}` : ''}
        ${extras.length ? `
            <h4 class="subtitulo">${exemplos.length ? 'Outros exemplos' : 'Exemplos'}</h4>
            <div class="chips">${extras.map(e => `<span class="chip">${escapeHtml(e)}</span>`).join('')}</div>` : ''}
    `;
    aplicarFallbackImagens(painel);
    painel.querySelectorAll('[data-clado-ir]').forEach(b => b.addEventListener('click', () => {
        mostrarClado(b.dataset.cladoIr);
        centralizarNoClado(b.dataset.cladoIr);
    }));
    if (rolar && window.matchMedia('(max-width: 960px)').matches) {
        painel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
