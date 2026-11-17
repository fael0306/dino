// js/abas/massa.js – Estimativa de massa pelo fêmur (Campione & Evans, 2012)

const REFERENCIAS_MASSA = [
    { nome: 'Elefante africano', toneladas: 6.0, icone: '🐘' },
    { nome: 'Tyrannosaurus rex', toneladas: 8.4, icone: '🦖' },
    { nome: 'Patagotitan', toneladas: 70.0, icone: '🦕' }
];

registrarAba({
    id: 'massa',
    titulo: 'Massa Corporal',
    subtitulo: 'Estime o peso de um dinossauro a partir do fêmur',
    descricao: 'A mesma equação usada por paleontólogos.',
    icone: 'bi-calculator',
    grupo: 'laboratorio',
    render(container) {
        container.innerHTML = `
            <div class="lab-layout">
                <div class="cartao lab-controles">
                    <h3><i class="bi bi-rulers" aria-hidden="true"></i> Medida do fóssil</h3>
                    <div class="campo">
                        <span class="rotulo" id="rotulo-postura">Tipo de locomoção</span>
                        ${htmlSegmentado('postura', [
                            { valor: 'bipede', rotulo: 'Bípede' },
                            { valor: 'quadrupede', rotulo: 'Quadrúpede' }
                        ], 'bipede', 'Tipo de locomoção')}
                    </div>
                    <div class="campo campo-slider">
                        <label for="femur-range">Circunferência do fêmur</label>
                        <div class="slider-com-numero">
                            <input type="range" id="femur-range" class="slider" min="5" max="150" step="0.5" value="50" aria-label="Circunferência do fêmur em centímetros">
                            <div class="input-unidade">
                                <input type="number" id="femur-cm" class="input" value="50" min="0.5" max="300" step="0.5" aria-label="Circunferência do fêmur em centímetros (valor exato)">
                                <span aria-hidden="true">cm</span>
                            </div>
                        </div>
                        <small class="ajuda">Meça a volta completa do osso da coxa, na parte mais estreita.</small>
                    </div>
                    <div class="campo">
                        <label for="massa-exemplo">Ou carregue um exemplo</label>
                        <select id="massa-exemplo" class="select">
                            <option value="">Escolha um dinossauro...</option>
                            ${DINOSSAUROS_CLASSICOS.map(d => `<option value="${escapeHtml(d.Nome)}">${escapeHtml(d.Nome)}</option>`).join('')}
                        </select>
                    </div>
                    <details class="detalhes">
                        <summary>De onde vem a fórmula?</summary>
                        <p class="formula">Massa (kg) = a × (circunferência em mm)<sup>b</sup></p>
                        <p>Bípedes: a = 0,00016 e b = 2,73 · Quadrúpedes: a = 0,00049 e b = 2,75.</p>
                        <p>Campione &amp; Evans (2012) mostraram que, em tetrápodes terrestres, o peso que os ossos das pernas sustentam cresce de forma previsível com a sua espessura.</p>
                    </details>
                </div>
                <div class="lab-resultados">
                    <div class="cartao resultado-destaque" aria-live="polite" id="resultado-massa"></div>
                    <div class="cartao">
                        <div class="cartao-cabecalho">
                            <h3><i class="bi bi-graph-up" aria-hidden="true"></i> Comparação com dinossauros clássicos</h3>
                            <label class="interruptor"><input type="checkbox" id="massa-log" checked><span>Escala logarítmica</span></label>
                        </div>
                        <div class="grafico-wrapper" id="grafico-massa-container">
                            <canvas id="grafico-massa" role="img" aria-label="Gráfico de dispersão: circunferência do fêmur versus massa"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const range = container.querySelector('#femur-range');
        const numero = container.querySelector('#femur-cm');
        range.addEventListener('input', () => { numero.value = range.value; calcularMassa(); });
        numero.addEventListener('input', () => {
            const v = Number(numero.value);
            if (v >= 5 && v <= 150) range.value = v;
            calcularMassa();
        });
        ligarSegmentado(container, 'postura', () => calcularMassa());
        container.querySelector('#massa-log').addEventListener('change', () => atualizarGraficoMassa());
        container.querySelector('#massa-exemplo').addEventListener('change', e => {
            const d = DINOSSAUROS_CLASSICOS.find(x => x.Nome === e.target.value);
            if (!d) return;
            const postura = normalizarPostura(d.Postura);
            const cm = Math.round(calcularCircunferenciaPorMassa(d.Peso * 1000, postura) / 10 * 2) / 2;
            container.querySelectorAll('[data-segmentado="postura"] .segmento').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.valor === postura)));
            numero.value = cm;
            range.value = Math.min(150, cm);
            calcularMassa();
        });
        calcularMassa();
    }
});

registrarAcao('tentar-grafico-massa', () => atualizarGraficoMassa());

function _lerEntradaMassa() {
    const raiz = document.getElementById('tab-massa');
    return {
        postura: valorSegmentado(raiz, 'postura') || 'bipede',
        circCm: Number(document.getElementById('femur-cm').value)
    };
}

function calcularMassa() {
    const div = document.getElementById('resultado-massa');
    if (!div) return;
    const { postura, circCm } = _lerEntradaMassa();
    if (!(circCm > 0) || circCm > 300) {
        div.innerHTML = htmlAlerta('aviso', 'Informe uma circunferência entre 0,5 e 300 cm.');
        return;
    }
    const { kg, toneladas } = calcularMassaFemur(circCm, postura);
    const proximo = DINOSSAUROS_CLASSICOS.reduce((melhor, d) =>
        Math.abs(Math.log(d.Peso / toneladas)) < Math.abs(Math.log(melhor.Peso / toneladas)) ? d : melhor);

    div.innerHTML = `
        <span class="eyebrow">Massa estimada</span>
        <p class="numero-grande">${formatarMassa(toneladas)}</p>
        <p class="texto-suave">${formatarNumero(kg, 0)} kg · fêmur de ${formatarNumero(circCm, 1)} cm (${postura === 'bipede' ? 'bípede' : 'quadrúpede'})</p>
        <div class="equivalencias">
            ${REFERENCIAS_MASSA.map(r => `
                <div class="equivalencia"><span class="equivalencia-icone" aria-hidden="true">${r.icone}</span>
                <div><strong>${formatarNumero(toneladas / r.toneladas, toneladas / r.toneladas < 1 ? 2 : 1)}×</strong><span>${r.nome}</span></div></div>`).join('')}
        </div>
        <p class="nota"><i class="bi bi-bullseye" aria-hidden="true"></i> Peso mais parecido entre os clássicos: <strong>${escapeHtml(proximo.Nome)}</strong> (${formatarMassa(proximo.Peso)}).</p>
    `;
    state.massa = { postura, circCm, toneladas };
    atualizarGraficoMassa();
}

/** Dados dos 7 dinossauros clássicos com a circunferência estimada pela equação inversa. */
function obterDadosGraficoMassa() {
    return DINOSSAUROS_CLASSICOS.map(d => ({
        nome: d.Nome,
        massaTon: d.Peso,
        circMm: calcularCircunferenciaPorMassa(d.Peso * 1000, d.Postura),
        postura: normalizarPostura(d.Postura)
    }));
}

async function atualizarGraficoMassa() {
    const wrapper = document.getElementById('grafico-massa-container');
    if (!wrapper) return;
    const ok = await carregarBiblioteca('chart');
    if (!ok) {
        wrapper.innerHTML = htmlBibliotecaIndisponivel('Chart.js (gráficos)', 'tentar-grafico-massa');
        return;
    }
    if (!document.getElementById('grafico-massa')) {
        wrapper.innerHTML = '<canvas id="grafico-massa" role="img" aria-label="Gráfico de dispersão: circunferência do fêmur versus massa"></canvas>';
    }
    const canvas = document.getElementById('grafico-massa');
    const fixos = obterDadosGraficoMassa();
    const cores = coresGrafico();
    const log = document.getElementById('massa-log')?.checked;
    const datasets = [
        {
            label: 'Bípedes clássicos',
            data: fixos.filter(d => d.postura === 'bipede').map(d => ({ x: d.circMm, y: d.massaTon, nome: d.nome })),
            backgroundColor: '#3d86c6', pointRadius: 7, pointHoverRadius: 9
        },
        {
            label: 'Quadrúpedes clássicos',
            data: fixos.filter(d => d.postura === 'quadrupede').map(d => ({ x: d.circMm, y: d.massaTon, nome: d.nome })),
            backgroundColor: '#3d8b5a', pointRadius: 7, pointHoverRadius: 9, pointStyle: 'rect'
        }
    ];
    if (state.massa && state.massa.toneladas > 0) {
        datasets.push({
            label: 'Seu fóssil',
            data: [{ x: state.massa.circCm * 10, y: state.massa.toneladas, nome: 'Seu fóssil' }],
            backgroundColor: '#e07a3f', borderColor: '#7a3a12', borderWidth: 2, pointRadius: 11, pointHoverRadius: 13, pointStyle: 'rectRot'
        });
    }
    const eixo = (titulo) => ({
        type: log ? 'logarithmic' : 'linear',
        beginAtZero: !log,
        title: { display: true, text: titulo, color: cores.texto },
        ticks: { color: cores.texto, callback: v => formatarNumero(v, v < 1 ? 2 : 0) },
        grid: { color: cores.grade }
    });
    const config = {
        type: 'scatter',
        data: { datasets },
        options: {
            responsive: true, maintainAspectRatio: false, animation: { duration: 250 },
            plugins: {
                legend: { position: 'top', labels: { color: cores.texto, usePointStyle: true } },
                tooltip: { callbacks: { label: c => `${c.raw.nome}: ${formatarMassa(c.raw.y)} · fêmur ${formatarNumero(c.raw.x / 10, 1)} cm` } }
            },
            scales: { x: eixo('Circunferência do fêmur (mm)'), y: eixo('Massa (toneladas)') }
        }
    };
    if (state.graficos.massa) state.graficos.massa.destroy();
    state.graficos.massa = new Chart(canvas.getContext('2d'), config);
}

document.addEventListener('paleolab:tema', () => {
    if (state.graficos.massa) atualizarGraficoMassa();
});
