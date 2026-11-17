// js/abas/clima.js – Clima do Mesozoico comparado com o atual

// Valores aproximados de referência para o clima atual
const CLIMA_ATUAL = { temperatura: 15, co2: 420 };

registrarAba({
    id: 'clima',
    titulo: 'Clima Mesozoico',
    subtitulo: 'Temperatura, CO₂ e vegetação de cada período',
    descricao: 'Compare o clima dos dinossauros com o de hoje.',
    icone: 'bi-cloud-sun',
    grupo: 'explorar',
    render(container) {
        const chaves = Object.keys(DADOS_CLIMA);
        container.innerHTML = `
            <div class="cartao">
                <div class="cartao-cabecalho">
                    ${htmlSegmentado('periodo-clima', chaves.map(k => ({ valor: k, rotulo: k.split(' ')[0] })), chaves[1], 'Escolha o período')}
                    <div class="progresso-mini" aria-live="polite">
                        <span id="clima-visitados"></span>
                    </div>
                </div>
                <div id="clima-info"></div>
            </div>
            <div class="cartao">
                <h3><i class="bi bi-bar-chart" aria-hidden="true"></i> Comparação entre os períodos e hoje</h3>
                <div id="clima-comparacao" class="comparacao-clima"></div>
                <p class="nota">Valores médios aproximados, baseados em Scotese (2021) e IPCC (2021). "Hoje" usa ~15 °C de temperatura média global e ~420 ppm de CO₂.</p>
            </div>
        `;
        ligarSegmentado(container, 'periodo-clima', atualizarClima);
        atualizarClima(chaves[1]);
    }
});

function _barrasClima(chave, unidade, valorAtual, max) {
    const itens = Object.entries(DADOS_CLIMA).map(([k, d]) => ({ nome: k.split(' ')[0], valor: d[chave] }));
    itens.push({ nome: 'Hoje', valor: valorAtual, hoje: true });
    return itens.map(i => `
        <div class="barra-clima${i.hoje ? ' hoje' : ''}">
            <span class="barra-clima-nome">${i.nome}</span>
            <div class="barra-clima-trilho"><div class="barra-clima-valor" style="width:${(i.valor / max) * 100}%"></div></div>
            <span class="barra-clima-num">${formatarNumero(i.valor, 0)} ${unidade}</span>
        </div>`).join('');
}

function atualizarClima(periodo) {
    const dados = DADOS_CLIMA[periodo];
    const info = document.getElementById('clima-info');
    if (!dados || !info) return;
    const nome = periodo.split(' ')[0];
    const intervalo = periodo.match(/\((.*)\)/)?.[1] || '';

    info.innerHTML = `
        <div class="periodo-info-cabecalho">
            <h3>${nome}</h3><span class="chip">${escapeHtml(intervalo)}</span>
        </div>
        <p class="lead">${escapeHtml(dados.descricao)}</p>
        <div class="kpis">
            <div class="kpi kpi-quente"><i class="bi bi-thermometer-half" aria-hidden="true"></i><div><span class="kpi-valor">${dados.temperatura} °C</span><span class="kpi-rotulo">temperatura média · ${formatarNumero(dados.temperatura - CLIMA_ATUAL.temperatura, 0)} °C acima de hoje</span></div></div>
            <div class="kpi kpi-co2"><i class="bi bi-cloud-haze2" aria-hidden="true"></i><div><span class="kpi-valor">${formatarNumero(dados.co2, 0)} ppm</span><span class="kpi-rotulo">CO₂ · cerca de ${formatarNumero(dados.co2 / CLIMA_ATUAL.co2, 1)}× o atual</span></div></div>
            <div class="kpi kpi-mar"><i class="bi bi-water" aria-hidden="true"></i><div><span class="kpi-valor kpi-texto">${escapeHtml(dados.nivelMar)}</span><span class="kpi-rotulo">nível do mar</span></div></div>
        </div>
        <div class="vegetacao"><i class="bi bi-tree" aria-hidden="true"></i><div><strong>Vegetação</strong><p>${escapeHtml(dados.vegetacao)}</p></div></div>
    `;

    const maxTemp = Math.max(...Object.values(DADOS_CLIMA).map(d => d.temperatura), CLIMA_ATUAL.temperatura);
    const maxCo2 = Math.max(...Object.values(DADOS_CLIMA).map(d => d.co2), CLIMA_ATUAL.co2);
    document.getElementById('clima-comparacao').innerHTML = `
        <div><h4 class="subtitulo">Temperatura média</h4>${_barrasClima('temperatura', '°C', CLIMA_ATUAL.temperatura, maxTemp)}</div>
        <div><h4 class="subtitulo">CO₂ atmosférico</h4>${_barrasClima('co2', 'ppm', CLIMA_ATUAL.co2, maxCo2)}</div>`;
    document.querySelectorAll('.barra-clima').forEach(b => b.classList.toggle('ativo', b.querySelector('.barra-clima-nome').textContent === nome));

    // Conquista "climaturista": explorar os três períodos
    const visitados = registrarPeriodoVisitado(nome);
    const todos = ['Triássico', 'Jurássico', 'Cretáceo'];
    const n = todos.filter(p => visitados.includes(p)).length;
    const el = document.getElementById('clima-visitados');
    if (el) el.innerHTML = n === 3
        ? '<i class="bi bi-check-circle-fill" aria-hidden="true"></i> Todos os períodos explorados'
        : `<i class="bi bi-compass" aria-hidden="true"></i> Períodos explorados: ${n}/3`;
    if (n === 3) desbloquearConquista('climaturista');
}
