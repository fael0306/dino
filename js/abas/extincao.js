// js/abas/extincao.js – Simulador da extinção K-Pg (Lotka–Volterra + RK4)

const CORES_POPULACOES = { P: '#3d8b5a', H: '#3d86c6', C: '#c8463a' };

registrarAba({
    id: 'extincao',
    titulo: 'Extinção K‑Pg',
    subtitulo: 'Simule o impacto do asteroide de 66 milhões de anos atrás',
    descricao: 'Modelo predador–presa do fim do Cretáceo.',
    icone: 'bi-fire',
    grupo: 'laboratorio',
    render(container) {
        container.innerHTML = `
            <div class="lab-layout">
                <div class="cartao lab-controles">
                    <h3><i class="bi bi-sliders" aria-hidden="true"></i> Parâmetros</h3>
                    <p class="texto-suave">Cenários prontos:</p>
                    <div class="cenarios">
                        ${CENARIOS_KPG.map(c => `
                            <button type="button" class="cenario" data-action="cenario-kpg" data-cenario="${c.id}">
                                <strong>${escapeHtml(c.nome)}</strong><span>${escapeHtml(c.descricao)}</span>
                            </button>`).join('')}
                    </div>
                    <div class="campo campo-slider">
                        <label for="bloqueio"><i class="bi bi-cloud-fog2" aria-hidden="true"></i> Bloqueio solar <output id="bloqueio-val" for="bloqueio">15%</output></label>
                        <input type="range" id="bloqueio" class="slider" min="0" max="100" value="15" aria-describedby="bloqueio-ajuda">
                        <small id="bloqueio-ajuda" class="ajuda">Poeira e fuligem que impedem a fotossíntese.</small>
                    </div>
                    <div class="campo campo-slider">
                        <label for="chuva"><i class="bi bi-cloud-drizzle" aria-hidden="true"></i> Chuva ácida <output id="chuva-val" for="chuva">40%</output></label>
                        <input type="range" id="chuva" class="slider" min="0" max="100" value="40" aria-describedby="chuva-ajuda">
                        <small id="chuva-ajuda" class="ajuda">Aumenta a mortalidade de herbívoros e carnívoros.</small>
                    </div>
                    <div class="campo campo-slider">
                        <label for="anos-sim"><i class="bi bi-calendar-range" aria-hidden="true"></i> Anos após o impacto <output id="anos-val" for="anos-sim">30 anos</output></label>
                        <input type="range" id="anos-sim" class="slider" min="1" max="50" value="30">
                    </div>
                    <details class="detalhes">
                        <summary>Como o modelo funciona?</summary>
                        <p>Usamos três equações de Lotka–Volterra resolvidas pelo método de Runge–Kutta de 4ª ordem (passo de 0,5 ano):</p>
                        <p class="formula">dP/dt = r·P − a·P·H<br>dH/dt = b·a·P·H − d·H − e·H·C<br>dC/dt = f·e·H·C − g·C</p>
                        <p><strong>P</strong> = plantas, <strong>H</strong> = herbívoros, <strong>C</strong> = carnívoros. O bloqueio solar reduz a taxa de crescimento das plantas (r) e a chuva ácida aumenta a mortalidade (d e g).</p>
                    </details>
                </div>
                <div class="lab-resultados">
                    <div id="status-extincao" aria-live="polite"></div>
                    <div class="kpis" id="kpis-extincao"></div>
                    <div class="cartao">
                        <h3><i class="bi bi-graph-down" aria-hidden="true"></i> Populações ao longo do tempo</h3>
                        <div class="grafico-wrapper" id="grafico-container">
                            <canvas id="grafico-extincao" role="img" aria-label="Gráfico das populações de plantas, herbívoros e carnívoros ao longo do tempo"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const executar = debounce(executarSimulacao, 120);
        [['bloqueio', '%'], ['chuva', '%'], ['anos-sim', ' anos']].forEach(([id, sufixo]) => {
            const input = container.querySelector(`#${id}`);
            const out = container.querySelector(`#${id === 'anos-sim' ? 'anos-val' : id + '-val'}`);
            input.addEventListener('input', () => {
                out.textContent = `${input.value}${sufixo}`;
                input.setAttribute('aria-valuetext', `${input.value}${sufixo}`);
                executar();
            });
        });
        executarSimulacao();
    }
});

registrarAcao('cenario-kpg', el => {
    const c = CENARIOS_KPG.find(x => x.id === el.dataset.cenario);
    if (!c) return;
    const definir = (id, valor, out, sufixo) => {
        document.getElementById(id).value = valor;
        document.getElementById(out).textContent = `${valor}${sufixo}`;
    };
    definir('bloqueio', c.bloqueio, 'bloqueio-val', '%');
    definir('chuva', c.chuva, 'chuva-val', '%');
    document.querySelectorAll('.cenario').forEach(b => b.classList.toggle('ativo', b === el));
    executarSimulacao();
});
registrarAcao('tentar-grafico-kpg', () => executarSimulacao());

async function executarSimulacao() {
    const statusDiv = document.getElementById('status-extincao');
    if (!statusDiv) return;
    const bloqueio = Number(document.getElementById('bloqueio').value);
    const chuva = Number(document.getElementById('chuva').value);
    const anos = Number(document.getElementById('anos-sim').value);

    const dados = simularExtincao(bloqueio, chuva, anos);
    const resultado = classificarEcossistema(dados);
    state.simulacao = { bloqueio, chuva, anos, dados, resultado };

    const tipos = { colapso: 'erro', devastado: 'aviso', instavel: 'aviso', estavel: 'sucesso' };
    const icones = { colapso: 'bi-fire', devastado: 'bi-exclamation-triangle', instavel: 'bi-shuffle', estavel: 'bi-tree' };
    statusDiv.innerHTML = htmlAlerta(tipos[resultado.nivel], `<strong>${resultado.titulo}.</strong> ${resultado.texto}`, icones[resultado.nivel]);

    const final = k => dados[k][dados[k].length - 1];
    const kpi = (k, nome, icone) => {
        const pct = (final(k) / dados[k][0]) * 100;
        return `<div class="kpi" style="--cor-kpi:${CORES_POPULACOES[k]}"><i class="bi ${icone}" aria-hidden="true"></i>
            <div><span class="kpi-valor">${formatarNumero(final(k), 1)}</span>
            <span class="kpi-rotulo">${nome} · ${formatarNumero(pct, 0)}% da população inicial</span></div></div>`;
    };
    document.getElementById('kpis-extincao').innerHTML =
        kpi('P', 'Plantas', 'bi-flower1') + kpi('H', 'Herbívoros', 'bi-egg') + kpi('C', 'Carnívoros', 'bi-lightning');

    const ok = await carregarBiblioteca('chart');
    const wrapper = document.getElementById('grafico-container');
    if (!wrapper) return;
    if (!ok) {
        wrapper.innerHTML = htmlBibliotecaIndisponivel('Chart.js (gráficos)', 'tentar-grafico-kpg');
        return;
    }
    if (!document.getElementById('grafico-extincao')) {
        wrapper.innerHTML = '<canvas id="grafico-extincao" role="img" aria-label="Gráfico das populações ao longo do tempo"></canvas>';
    }
    desenharGraficoExtincao(dados);
}

function desenharGraficoExtincao(dados) {
    const canvas = document.getElementById('grafico-extincao');
    if (!canvas || typeof Chart === 'undefined') return;
    const cores = coresGrafico();
    const serie = (k, nome) => ({
        label: nome, data: dados[k], borderColor: CORES_POPULACOES[k],
        backgroundColor: CORES_POPULACOES[k] + '22', fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2.5
    });
    const config = {
        type: 'line',
        data: { labels: dados.t.map(t => formatarNumero(t, 1)), datasets: [serie('P', 'Plantas'), serie('H', 'Herbívoros'), serie('C', 'Carnívoros')] },
        options: {
            responsive: true, maintainAspectRatio: false, animation: { duration: 300 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { position: 'top', labels: { color: cores.texto, usePointStyle: true } },
                tooltip: { callbacks: { title: i => `Ano ${i[0].label}`, label: c => `${c.dataset.label}: ${formatarNumero(c.parsed.y, 1)}` } }
            },
            scales: {
                x: { title: { display: true, text: 'Anos após o impacto', color: cores.texto }, ticks: { color: cores.texto, maxTicksLimit: 10 }, grid: { color: cores.grade } },
                y: { beginAtZero: true, title: { display: true, text: 'População (unidades relativas)', color: cores.texto }, ticks: { color: cores.texto }, grid: { color: cores.grade } }
            }
        }
    };
    if (state.graficos.extincao) state.graficos.extincao.destroy();
    state.graficos.extincao = new Chart(canvas.getContext('2d'), config);
}

document.addEventListener('paleolab:tema', () => {
    if (state.graficos.extincao && state.simulacao) desenharGraficoExtincao(state.simulacao.dados);
});
