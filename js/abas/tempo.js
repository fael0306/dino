// js/abas/tempo.js – Linha do tempo do Mesozoico (sem bibliotecas externas)

const INICIO_MESOZOICO = 252;
const FIM_MESOZOICO = 66;

/** Posição (0–100%) de uma idade na barra, com o mais antigo à esquerda. */
function posicaoNaLinhaDoTempo(idadeMa) {
    return ((INICIO_MESOZOICO - idadeMa) / (INICIO_MESOZOICO - FIM_MESOZOICO)) * 100;
}

registrarAba({
    id: 'tempo',
    titulo: 'Linha do Tempo',
    subtitulo: 'Os 186 milhões de anos da Era Mesozoica',
    descricao: 'Viaje pelo Triássico, Jurássico e Cretáceo.',
    icone: 'bi-hourglass-split',
    grupo: 'explorar',
    render(container) {
        container.innerHTML = `
            <div class="cartao">
                <div class="linha-tempo" aria-hidden="true">
                    <div class="linha-tempo-barra">
                        ${PERIODOS.map(p => `
                            <button type="button" class="linha-tempo-periodo" tabindex="-1" data-periodo="${p.nome}"
                                    data-idade="${Math.round((p.inicio + p.fim) / 2)}"
                                    style="width:${((p.inicio - p.fim) / (INICIO_MESOZOICO - FIM_MESOZOICO)) * 100}%">
                                <span>${p.nome}</span>
                            </button>`).join('')}
                        <div class="linha-tempo-marcador" id="tempo-marcador"></div>
                    </div>
                    <div class="linha-tempo-escala">
                        ${[252, 201, 145, 66].map(m => `<span style="left:${posicaoNaLinhaDoTempo(m)}%">${m} Ma</span>`).join('')}
                    </div>
                </div>
                <div class="campo campo-slider">
                    <label for="slider-tempo">Viaje no tempo: <output id="tempo-val" for="slider-tempo">150 milhões de anos atrás</output></label>
                    <input type="range" id="slider-tempo" class="slider" min="-252" max="-66" step="1" value="-150"
                           aria-valuetext="150 milhões de anos atrás">
                    <div class="slider-legenda"><span>Mais antigo</span><span>Mais recente</span></div>
                </div>
            </div>
            <div id="tempo-info" aria-live="polite"></div>
        `;
        const slider = container.querySelector('#slider-tempo');
        slider.addEventListener('input', () => atualizarLinhaTempo(-Number(slider.value)));
        container.querySelectorAll('.linha-tempo-periodo').forEach(btn => btn.addEventListener('click', () => {
            slider.value = -Number(btn.dataset.idade);
            atualizarLinhaTempo(Number(btn.dataset.idade));
        }));
        atualizarLinhaTempo(150);
    }
});

let _periodoTempoAtual = null;

function atualizarLinhaTempo(idade) {
    const texto = `${idade} milhões de anos atrás`;
    const out = document.getElementById('tempo-val');
    const slider = document.getElementById('slider-tempo');
    if (out) out.textContent = texto;
    if (slider) slider.setAttribute('aria-valuetext', texto);
    const marcador = document.getElementById('tempo-marcador');
    if (marcador) marcador.style.left = `${posicaoNaLinhaDoTempo(idade)}%`;

    const periodo = periodoPorIdade(idade, PERIODOS);
    document.querySelectorAll('.linha-tempo-periodo').forEach(b => b.classList.toggle('ativo', periodo && b.dataset.periodo === periodo.nome));
    if (!periodo || periodo.nome === _periodoTempoAtual) return;
    _periodoTempoAtual = periodo.nome;

    const dinos = dinossaurosDoPeriodo(periodo.nome, DINOSSAUROS_REAIS)
        .sort((a, b) => rankPeriodo(a.Periodo) - rankPeriodo(b.Periodo) || a.Nome.localeCompare(b.Nome, 'pt-BR'));
    document.getElementById('tempo-info').innerHTML = `
        <div class="cartao periodo-info" data-periodo="${periodo.nome}">
            <div class="periodo-info-cabecalho">
                <h3>${periodo.nome}</h3>
                <span class="chip">${periodo.inicio} – ${periodo.fim} milhões de anos atrás · ${periodo.inicio - periodo.fim} Ma de duração</span>
            </div>
            <h4 class="subtitulo">Acontecimentos marcantes</h4>
            <ul class="lista-eventos">${periodo.eventos.map(e => `<li><i class="bi bi-dot" aria-hidden="true"></i>${escapeHtml(e)}</li>`).join('')}</ul>
            <h4 class="subtitulo">Dinossauros do museu que viveram neste período (${dinos.length})</h4>
            <div class="chips chips-acao">
                ${dinos.map(d => `<button type="button" class="chip chip-botao" data-action="abrir-ficha" data-dino="${escapeHtml(d.Nome)}"><em>${escapeHtml(d.Nome)}</em></button>`).join('')}
            </div>
        </div>`;
}
