// js/abas/fosseis.js – Museu com os 50 dinossauros reais + ficha detalhada

const _filtroMuseu = { busca: '', periodo: 'Todos', dieta: 'Todas', ordem: 'nome' };

function filtrarDinossauros(lista, { busca = '', periodo = 'Todos', dieta = 'Todas', ordem = 'nome' } = {}) {
    const termo = busca.trim().toLowerCase();
    const filtrada = lista.filter(d =>
        (!termo || d.Nome.toLowerCase().includes(termo) || d.Curiosidade.toLowerCase().includes(termo)) &&
        (periodo === 'Todos' || extrairPeriodo(d.Periodo) === periodo) &&
        (dieta === 'Todas' || d.Dieta === dieta)
    );
    const comparadores = {
        nome: (a, b) => a.Nome.localeCompare(b.Nome, 'pt-BR'),
        peso: (a, b) => b.Peso - a.Peso,
        comprimento: (a, b) => b.Comprimento - a.Comprimento,
        antiguidade: (a, b) => rankPeriodo(a.Periodo) - rankPeriodo(b.Periodo) || a.Nome.localeCompare(b.Nome, 'pt-BR')
    };
    return filtrada.sort(comparadores[ordem] || comparadores.nome);
}

registrarAba({
    id: 'fosseis',
    titulo: 'Fósseis Reais',
    subtitulo: 'Museu com 50 espécies descritas pela ciência',
    descricao: 'Busque, filtre e conheça 50 espécies reais.',
    icone: 'bi-bank',
    grupo: 'explorar',
    render(container) {
        const dietas = [...new Set(DINOSSAUROS_REAIS.map(d => d.Dieta))].sort();
        container.innerHTML = `
            <div class="barra-ferramentas cartao">
                <div class="campo campo-busca">
                    <label for="museu-busca" class="visualmente-oculto">Buscar dinossauro</label>
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <input id="museu-busca" type="search" class="input" placeholder="Buscar por nome ou curiosidade..." autocomplete="off">
                </div>
                ${htmlSegmentado('museu-periodo', [
                    { valor: 'Todos', rotulo: 'Todos' },
                    { valor: 'Triássico', rotulo: 'Triássico' },
                    { valor: 'Jurássico', rotulo: 'Jurássico' },
                    { valor: 'Cretáceo', rotulo: 'Cretáceo' }
                ], 'Todos', 'Filtrar por período')}
                <div class="campo campo-inline">
                    <label for="museu-dieta">Dieta</label>
                    <select id="museu-dieta" class="select">
                        <option value="Todas">Todas</option>${htmlOpcoes(dietas)}
                    </select>
                </div>
                <div class="campo campo-inline">
                    <label for="museu-ordem">Ordenar</label>
                    <select id="museu-ordem" class="select">
                        <option value="nome">Nome (A–Z)</option>
                        <option value="peso">Mais pesados</option>
                        <option value="comprimento">Mais compridos</option>
                        <option value="antiguidade">Mais antigos</option>
                    </select>
                </div>
                <button type="button" class="btn btn-primario" data-action="sortear-fossil"><i class="bi bi-dice-5" aria-hidden="true"></i> Sortear</button>
            </div>
            <p id="museu-contagem" class="contagem" aria-live="polite"></p>
            <div id="museu-grade" class="grade-fosseis"></div>
        `;
        const buscar = debounce(() => { _filtroMuseu.busca = container.querySelector('#museu-busca').value; renderGradeMuseu(); }, 150);
        container.querySelector('#museu-busca').addEventListener('input', buscar);
        container.querySelector('#museu-dieta').addEventListener('change', e => { _filtroMuseu.dieta = e.target.value; renderGradeMuseu(); });
        container.querySelector('#museu-ordem').addEventListener('change', e => { _filtroMuseu.ordem = e.target.value; renderGradeMuseu(); });
        ligarSegmentado(container, 'museu-periodo', v => { _filtroMuseu.periodo = v; renderGradeMuseu(); });
        renderGradeMuseu();
    }
});

function renderGradeMuseu() {
    const grade = document.getElementById('museu-grade');
    if (!grade) return;
    const lista = filtrarDinossauros(DINOSSAUROS_REAIS, _filtroMuseu);
    document.getElementById('museu-contagem').textContent =
        `${lista.length} ${lista.length === 1 ? 'espécie encontrada' : 'espécies encontradas'}`;
    if (lista.length === 0) {
        grade.innerHTML = htmlVazio('bi-search', 'Nenhum dinossauro corresponde aos filtros.');
        return;
    }
    grade.innerHTML = lista.map(d => `
        <button type="button" class="cartao-fossil" data-action="abrir-ficha" data-dino="${escapeHtml(d.Nome)}">
            <span class="cartao-fossil-img">
                <img src="${caminhoImagemFossil(d.Nome)}" alt="" loading="lazy" decoding="async"
                     data-fallback="${escapeHtml(d.Nome)}" data-fallback-tamanho="300x200">
            </span>
            <span class="cartao-fossil-info">
                <strong><em>${escapeHtml(d.Nome)}</em></strong>
                <span class="chips">
                    <span class="chip chip-periodo" data-periodo="${extrairPeriodo(d.Periodo)}">${escapeHtml(d.Periodo)}</span>
                    <span class="chip">${escapeHtml(d.Dieta)}</span>
                </span>
                <span class="cartao-fossil-medidas">
                    <span><i class="bi bi-arrow-left-right" aria-hidden="true"></i> ${formatarNumero(d.Comprimento, 1)} m</span>
                    <span><i class="bi bi-speedometer2" aria-hidden="true"></i> ${formatarMassa(d.Peso)}</span>
                </span>
            </span>
        </button>`).join('');
    aplicarFallbackImagens(grade);
}

// ------------------------------------------------------------
// Ficha detalhada (diálogo reutilizado por várias abas)
// ------------------------------------------------------------
function abrirFichaDinossauro(nome) {
    const dino = DINOSSAUROS_REAIS.find(d => d.Nome === nome);
    const dialog = document.getElementById('dialogo-ficha');
    if (!dino || !dialog) return;
    const max = chave => Math.max(...DINOSSAUROS_REAIS.map(d => d[chave]));
    const barra = (rotulo, valor, chave, texto) => `
        <div class="medida">
            <div class="medida-topo"><span>${rotulo}</span><strong>${texto}</strong></div>
            <div class="medida-trilho"><div class="medida-barra" style="width:${Math.max(2, (valor / max(chave)) * 100)}%"></div></div>
        </div>`;
    const temMapa = !!COORDENADAS_DINOSSAUROS[dino.Nome];

    dialog.querySelector('.dialogo-conteudo').innerHTML = `
        <div class="ficha">
            <div class="ficha-img">
                <img src="${caminhoImagemFossil(dino.Nome)}" alt="Reconstituição de ${escapeHtml(dino.Nome)}"
                     data-fallback="${escapeHtml(dino.Nome)}" data-fallback-tamanho="300x200">
            </div>
            <div class="ficha-info">
                <h2 id="ficha-titulo"><em>${escapeHtml(dino.Nome)}</em></h2>
                <div class="chips">
                    <span class="chip chip-periodo" data-periodo="${extrairPeriodo(dino.Periodo)}">${escapeHtml(dino.Periodo)}</span>
                    <span class="chip">${escapeHtml(dino.Dieta)}</span>
                    <span class="chip">${escapeHtml(dino.Postura)}</span>
                </div>
                <p class="ficha-curiosidade">${escapeHtml(dino.Curiosidade)}</p>
                ${barra('Comprimento', dino.Comprimento, 'Comprimento', `${formatarNumero(dino.Comprimento, 1)} m`)}
                ${barra('Altura', dino.Altura, 'Altura', `${formatarNumero(dino.Altura, 1)} m`)}
                ${barra('Peso', dino.Peso, 'Peso', formatarMassa(dino.Peso))}
                <p class="nota">Barras relativas ao maior valor entre as 50 espécies do museu.</p>
                <div class="ficha-acoes">
                    ${temMapa ? `<button type="button" class="btn btn-secundario" data-action="ver-no-mapa" data-dino="${escapeHtml(dino.Nome)}"><i class="bi bi-geo-alt" aria-hidden="true"></i> Ver fósseis no mapa</button>` : ''}
                    <button type="button" class="btn btn-secundario" data-action="duelar-com" data-dino="${escapeHtml(dino.Nome)}"><i class="bi bi-lightning-charge" aria-hidden="true"></i> Usar no modo Batalha</button>
                </div>
            </div>
        </div>`;
    aplicarFallbackImagens(dialog);
    if (typeof dialog.showModal === 'function') {
        if (!dialog.open) dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }
}

function fecharFicha() {
    const dialog = document.getElementById('dialogo-ficha');
    if (dialog && dialog.open) dialog.close();
}

registrarAcao('abrir-ficha', el => abrirFichaDinossauro(el.dataset.dino));
registrarAcao('fechar-ficha', fecharFicha);
registrarAcao('sortear-fossil', () => {
    const d = DINOSSAUROS_REAIS[Math.floor(Math.random() * DINOSSAUROS_REAIS.length)];
    abrirFichaDinossauro(d.Nome);
});
registrarAcao('ver-no-mapa', el => {
    fecharFicha();
    state.mapaDinoInicial = el.dataset.dino;
    navegarParaAba('deriva');
    if (state.initialized.deriva && typeof selecionarDinoMapa === 'function') selecionarDinoMapa(el.dataset.dino);
});
registrarAcao('duelar-com', el => {
    fecharFicha();
    state.batalhaDinoInicial = el.dataset.dino;
    navegarParaAba('quiz');
    if (typeof abrirModoBatalha === 'function') abrirModoBatalha(el.dataset.dino);
});
