// js/abas/arvore.js – Cladograma interativo (vis-network) + versão em lista

const CORES_CLADOS = {
    Reptilia: '#5b6b7a', Archosauria: '#6d5a8c', Dinosauria: '#c0622d', Pterosauria: '#3f7cac',
    Saurischia: '#3d8b5a', Ornithischia: '#c98b2b', Theropoda: '#b5452f', Sauropodomorpha: '#7b55a3',
    Tyrannosauridae: '#d1553b', Dromaeosauridae: '#e0883a', Spinosauridae: '#a8562a', Brachiosauridae: '#4aa36b',
    Diplodocidae: '#2f9b8f', Ceratopsia: '#3d86c6', Ornithopoda: '#8d63b8', Stegosauria: '#c9a227',
    Ankylosauria: '#b07a3a', Sauropterygia: '#2a8c8c', Plesiosauria: '#2b7a6b', Ichthyosauria: '#3c6fa0'
};

/** Constrói a estrutura hierárquica { nome, filhos[] } a partir das arestas. */
function construirArvore(arestas, raiz = 'Reptilia') {
    const filhos = {};
    arestas.forEach(([pai, filho]) => { (filhos[pai] = filhos[pai] || []).push(filho); });
    const montar = nome => ({ nome, filhos: (filhos[nome] || []).map(montar) });
    return montar(raiz);
}

function _htmlListaArvore(no) {
    return `<li>
        <button type="button" class="no-arvore" data-clado="${no.nome}"><span class="ponto" style="background:${CORES_CLADOS[no.nome] || '#888'}"></span>${no.nome}</button>
        ${no.filhos.length ? `<ul>${no.filhos.map(_htmlListaArvore).join('')}</ul>` : ''}
    </li>`;
}

registrarAba({
    id: 'arvore',
    titulo: 'Árvore Evolutiva',
    subtitulo: 'Parentesco entre os grandes grupos de répteis',
    descricao: 'Cladograma interativo dos dinossauros e parentes.',
    icone: 'bi-diagram-3',
    grupo: 'explorar',
    render(container) {
        container.innerHTML = `
            <div class="arvore-layout">
                <div class="cartao arvore-cartao">
                    <div class="cartao-cabecalho">
                        <h3><i class="bi bi-diagram-3" aria-hidden="true"></i> Cladograma</h3>
                        ${htmlSegmentado('arvore-modo', [
                            { valor: 'grafico', rotulo: 'Diagrama', icone: 'bi-diagram-3' },
                            { valor: 'lista', rotulo: 'Lista', icone: 'bi-list-nested' }
                        ], 'grafico', 'Modo de visualização da árvore')}
                    </div>
                    <div id="arvore-evolutiva" class="arvore-grafico" role="img" aria-label="Diagrama da árvore evolutiva. Use o modo Lista para navegar pelo teclado."></div>
                    <ul id="arvore-lista" class="arvore-lista" hidden>${_htmlListaArvore(construirArvore(ARVORE_ARESTAS))}</ul>
                </div>
                <aside class="cartao arvore-painel" aria-live="polite" id="arvore-painel"></aside>
            </div>
        `;
        ligarSegmentado(container, 'arvore-modo', modo => {
            document.getElementById('arvore-evolutiva').hidden = modo !== 'grafico';
            document.getElementById('arvore-lista').hidden = modo !== 'lista';
            if (modo === 'grafico' && state.graficos.arvore) state.graficos.arvore.fit();
        });
        container.querySelector('#arvore-lista').addEventListener('click', e => {
            const btn = e.target.closest('[data-clado]');
            if (btn) mostrarClado(btn.dataset.clado);
        });
        mostrarClado('Dinosauria');
        desenharArvore();
    }
});

registrarAcao('tentar-arvore', desenharArvore);

function mostrarClado(nome) {
    const painel = document.getElementById('arvore-painel');
    if (!painel) return;
    const filhos = ARVORE_ARESTAS.filter(([p]) => p === nome).map(([, f]) => f);
    const pai = (ARVORE_ARESTAS.find(([, f]) => f === nome) || [])[0];
    painel.innerHTML = `
        <span class="eyebrow">Clado selecionado</span>
        <h3 style="color:${CORES_CLADOS[nome]}">${escapeHtml(nome)}</h3>
        <p>${escapeHtml(CLADOS_INFO[nome] || '')}</p>
        ${pai ? `<p class="texto-suave"><strong>Pertence a:</strong> <button type="button" class="link-botao" data-clado-ir="${pai}">${pai}</button></p>` : ''}
        ${filhos.length ? `<p class="texto-suave"><strong>Inclui:</strong> ${filhos.map(f => `<button type="button" class="link-botao" data-clado-ir="${f}">${f}</button>`).join(', ')}</p>` : ''}
    `;
    painel.querySelectorAll('[data-clado-ir]').forEach(b => b.addEventListener('click', () => {
        mostrarClado(b.dataset.cladoIr);
        if (state.graficos.arvore) state.graficos.arvore.selectNodes([b.dataset.cladoIr]);
    }));
    document.querySelectorAll('#arvore-lista .no-arvore').forEach(b => b.classList.toggle('ativo', b.dataset.clado === nome));
}

async function desenharArvore() {
    const el = document.getElementById('arvore-evolutiva');
    if (!el) return;
    el.innerHTML = htmlCarregando('Carregando diagrama...');
    const ok = await carregarBiblioteca('vis');
    if (!ok) {
        el.innerHTML = htmlBibliotecaIndisponivel('vis-network (diagrama)', 'tentar-arvore');
        return;
    }
    el.innerHTML = '';
    const nos = Object.keys(CLADOS_INFO).map(id => ({
        id, label: id,
        color: { background: CORES_CLADOS[id], border: CORES_CLADOS[id], highlight: { background: CORES_CLADOS[id], border: '#111' } }
    }));
    const dados = {
        nodes: new vis.DataSet(nos),
        edges: new vis.DataSet(ARVORE_ARESTAS.map(([from, to]) => ({ from, to })))
    };
    const opcoes = {
        layout: { hierarchical: { direction: 'LR', sortMethod: 'directed', nodeSpacing: 46, levelSeparation: 170 } },
        physics: { enabled: false },
        interaction: { hover: true, navigationButtons: false, keyboard: false },
        edges: { arrows: { to: { enabled: true, scaleFactor: 0.5 } }, color: { color: cssVar('--borda-forte') || '#bbb' }, smooth: { type: 'cubicBezier', forceDirection: 'horizontal' } },
        nodes: { shape: 'box', margin: 9, borderWidth: 0, font: { size: 14, color: '#ffffff', face: 'Inter, system-ui, sans-serif' }, shapeProperties: { borderRadius: 8 } }
    };
    if (state.graficos.arvore) state.graficos.arvore.destroy();
    const rede = new vis.Network(el, dados, opcoes);
    rede.on('click', p => { if (p.nodes.length) mostrarClado(p.nodes[0]); });
    rede.once('afterDrawing', () => rede.fit());
    state.graficos.arvore = rede;
}

document.addEventListener('paleolab:tema', () => {
    const rede = state.graficos.arvore;
    if (rede) rede.setOptions({ edges: { color: { color: cssVar('--borda-forte') } } });
});
