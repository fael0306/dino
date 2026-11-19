// js/abas/viagem.js – Viagem no Tempo
// Junta a antiga Linha do Tempo e a Deriva Continental numa aba só:
//   1. a pessoa escolhe a idade (milhões de anos) na linha do tempo;
//   2. o globo mostra os continentes daquela era;
//   3. aparecem o período, a época, os acontecimentos e os dinossauros;
//   4. o mapa mostra onde os fósseis daquela época foram encontrados.

const INICIO_MESOZOICO = 252;
const FIM_MESOZOICO = 66;
const IDADE_INICIAL = 150;

// Mapas base gratuitos que não exigem chave de acesso. Se o primeiro falhar
// (servidor fora do ar ou bloqueado), o mapa troca para o seguinte.
// Obs.: até a v2.0.0 era usado o CARTO, que passou a exigir chave ("API KEY REQUIRED").
const CAMADAS_MAPA = [
    {
        nome: 'OpenStreetMap',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        opcoes: { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }
    },
    {
        nome: 'Esri World Street Map',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        opcoes: { maxZoom: 19, attribution: 'Mapa © <a href="https://www.esri.com/">Esri</a>' }
    }
];
const ERROS_PARA_TROCAR_CAMADA = 4;

const viagem = {
    idade: IDADE_INICIAL,
    epoca: null,       // nome da época exibida
    era: null,         // era carregada no globo
    globoHoje: false,  // comparar com a Terra atual
    dinoMapa: '',      // '' = todos da época; senão, uma espécie
    timerGlobo: null
};

/** Posição (0–100%) de uma idade na barra, com o mais antigo à esquerda. */
function posicaoNaLinhaDoTempo(idadeMa) {
    return ((INICIO_MESOZOICO - idadeMa) / (INICIO_MESOZOICO - FIM_MESOZOICO)) * 100;
}

function urlGlobo(era) {
    // O globo só lê a era ao carregar; o ?_t= força o recarregamento do iframe
    return `https://dinosaurpictures.org/ancient-earth?_t=${era}#${era}`;
}

/** Espécies mostradas para uma época: as da própria época ou, se não houver, as do período. */
function especiesParaEpoca(epoca) {
    const daEpoca = dinossaurosDaEpoca(epoca.nome, DINOSSAUROS_REAIS);
    const lista = daEpoca.length ? daEpoca : dinossaurosDoPeriodo(epoca.periodo, DINOSSAUROS_REAIS);
    return {
        lista: lista.slice().sort((a, b) => a.Nome.localeCompare(b.Nome, 'pt-BR')),
        doPeriodoInteiro: daEpoca.length === 0
    };
}

function idadeMediaDaEpoca(nomeEpoca) {
    const e = EPOCAS.find(x => x.nome === nomeEpoca);
    return e ? Math.round((e.inicio + e.fim) / 2) : IDADE_INICIAL;
}

registrarAba({
    id: 'viagem',
    titulo: 'Viagem no Tempo',
    subtitulo: 'Escolha um momento do Mesozoico e veja os continentes, a vida e os fósseis daquela época',
    descricao: 'Linha do tempo, continentes, dinossauros e fósseis de cada época.',
    icone: 'bi-hourglass-split',
    grupo: 'explorar',
    render(container) {
        if (state.mapaDinoInicial) {
            const d = buscarDinossauro(state.mapaDinoInicial);
            if (d) { viagem.idade = idadeMediaDaEpoca(d.Periodo); viagem.dinoMapa = d.Nome; }
            state.mapaDinoInicial = null;
        }

        container.innerHTML = `
            <section class="cartao viagem-linha" aria-labelledby="viagem-linha-titulo">
                <h3 id="viagem-linha-titulo" class="visualmente-oculto">Linha do tempo</h3>
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
                    <div class="linha-tempo-epocas">
                        ${EPOCAS.map(e => `<span class="linha-tempo-epoca" data-epoca="${e.nome}"
                            style="left:${posicaoNaLinhaDoTempo(e.inicio)}%;width:${posicaoNaLinhaDoTempo(e.fim) - posicaoNaLinhaDoTempo(e.inicio)}%"
                            title="${e.nome}">${e.nome.split(' ')[1]}</span>`).join('')}
                    </div>
                    <div class="linha-tempo-escala">
                        ${[252, 201, 145, 66].map(m => `<span style="left:${posicaoNaLinhaDoTempo(m)}%">${m} Ma</span>`).join('')}
                    </div>
                </div>
                <div class="campo campo-slider">
                    <label for="slider-tempo">Viaje no tempo: <output id="tempo-val" for="slider-tempo"></output></label>
                    <input type="range" id="slider-tempo" class="slider" min="-252" max="-66" step="1" value="${-viagem.idade}">
                    <div class="slider-legenda"><span>Mais antigo</span><span>Mais recente</span></div>
                </div>
            </section>

            <div class="viagem-grade">
                <section class="cartao viagem-globo" aria-labelledby="globo-titulo">
                    <div class="cartao-cabecalho">
                        <div>
                            <h3 id="globo-titulo"><i class="bi bi-globe2" aria-hidden="true"></i> <span id="globo-titulo-texto">Os continentes</span></h3>
                            <p class="texto-suave" id="globo-legenda"></p>
                        </div>
                        ${htmlSegmentado('globo-modo', [
                            { valor: 'epoca', rotulo: 'Naquela época' },
                            { valor: 'hoje', rotulo: 'Hoje' }
                        ], 'epoca', 'Escolha qual Terra o globo mostra')}
                    </div>
                    <div class="globo-wrapper">
                        <iframe id="iframe-globo" title="Globo interativo da Terra antiga" loading="lazy" referrerpolicy="no-referrer"></iframe>
                    </div>
                    <p class="nota"><i class="bi bi-hand-index" aria-hidden="true"></i> Arraste para girar. Reconstrução de <a href="https://dinosaurpictures.org/ancient-earth" target="_blank" rel="noopener">Ancient Earth</a>; o globo tem mapas a cada 15–30 milhões de anos, então mostramos o mais próximo.</p>
                </section>

                <section class="viagem-periodo" id="viagem-periodo" aria-live="polite"></section>
            </div>

            <section class="cartao" aria-labelledby="mapa-titulo" id="viagem-mapa-cartao">
                <div class="cartao-cabecalho">
                    <div>
                        <h3 id="mapa-titulo"><i class="bi bi-geo-alt" aria-hidden="true"></i> <span id="mapa-titulo-texto">Onde os fósseis foram encontrados</span></h3>
                        <p class="texto-suave" id="mapa-legenda"></p>
                    </div>
                </div>
                <div class="mapa-layout">
                    <div class="mapa-controles">
                        <div class="campo">
                            <label for="dino-mapa">Mostrar no mapa</label>
                            <select id="dino-mapa" class="select"></select>
                        </div>
                        <div id="mapa-sitios" class="lista-sitios" aria-live="polite"></div>
                        <p class="nota"><i class="bi bi-info-circle" aria-hidden="true"></i> O mapa mostra os locais de hoje. Para ver onde esses lugares ficavam na época, compare com o globo acima.</p>
                    </div>
                    <div id="mapa-fosseis" class="mapa" role="region" aria-label="Mapa de sítios fósseis">${htmlCarregando('Carregando mapa...')}</div>
                </div>
            </section>
        `;

        const slider = container.querySelector('#slider-tempo');
        slider.addEventListener('input', () => definirIdadeViagem(-Number(slider.value)));
        container.querySelectorAll('.linha-tempo-periodo').forEach(btn => btn.addEventListener('click', () => {
            definirIdadeViagem(Number(btn.dataset.idade), { atualizarSlider: true });
        }));
        ligarSegmentado(container, 'globo-modo', modo => {
            viagem.globoHoje = modo === 'hoje';
            atualizarGlobo(true);
        });
        container.querySelector('#dino-mapa').addEventListener('change', e => {
            viagem.dinoMapa = e.target.value;
            atualizarMapa();
        });
        container.querySelector('#viagem-periodo').addEventListener('click', e => {
            const btn = e.target.closest('[data-mapa-dino]');
            if (!btn) return;
            selecionarDinoMapa(btn.dataset.mapaDino);
            document.getElementById('viagem-mapa-cartao').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        definirIdadeViagem(viagem.idade, { atualizarSlider: true, globoImediato: true });
        iniciarMapa();
    },
    aoAtivar: () => {
        if (state.graficos.mapa) setTimeout(() => state.graficos.mapa.invalidateSize(), 60);
    }
});

/** Ponto central da aba: tudo é recalculado a partir da idade escolhida. */
function definirIdadeViagem(idade, { atualizarSlider = false, globoImediato = false } = {}) {
    viagem.idade = Math.min(INICIO_MESOZOICO, Math.max(FIM_MESOZOICO, Math.round(idade)));
    const epoca = epocaPorIdade(viagem.idade, EPOCAS);
    const periodo = periodoPorIdade(viagem.idade, PERIODOS);
    const texto = `${viagem.idade} milhões de anos atrás · ${epoca.nome}`;

    const slider = document.getElementById('slider-tempo');
    if (slider) {
        if (atualizarSlider) slider.value = -viagem.idade;
        slider.setAttribute('aria-valuetext', texto);
    }
    const out = document.getElementById('tempo-val');
    if (out) out.textContent = `${viagem.idade} milhões de anos atrás`;
    const marcador = document.getElementById('tempo-marcador');
    if (marcador) marcador.style.left = `${posicaoNaLinhaDoTempo(viagem.idade)}%`;
    document.querySelectorAll('.linha-tempo-periodo').forEach(b => b.classList.toggle('ativo', b.dataset.periodo === periodo.nome));
    document.querySelectorAll('.linha-tempo-epoca').forEach(b => b.classList.toggle('ativo', b.dataset.epoca === epoca.nome));

    atualizarGlobo(globoImediato);

    if (epoca.nome !== viagem.epoca) {
        viagem.epoca = epoca.nome;
        renderPeriodoViagem(epoca, periodo);
        prepararSeletorMapa(epoca);
        atualizarMapa();
    }
}

// ------------------------------------------------------------
// Globo
// ------------------------------------------------------------
function atualizarGlobo(imediato) {
    const era = viagem.globoHoje ? 0 : eraGloboMaisProxima(viagem.idade, ERAS_GLOBO);
    const tituloEl = document.getElementById('globo-titulo-texto');
    const legenda = document.getElementById('globo-legenda');
    if (tituloEl) tituloEl.textContent = viagem.globoHoje ? 'A Terra hoje' : `Os continentes há ~${era} milhões de anos`;
    if (legenda) legenda.textContent = viagem.globoHoje
        ? 'Compare com a época escolhida para ver como os continentes se moveram.'
        : `Mapa mais próximo de ${viagem.idade} Ma disponível no globo.`;
    if (era === viagem.era) return;

    // Espera a pessoa parar de arrastar antes de recarregar o globo (ele é pesado)
    clearTimeout(viagem.timerGlobo);
    const carregar = () => {
        const iframe = document.getElementById('iframe-globo');
        if (!iframe) return;
        viagem.era = era;
        iframe.src = urlGlobo(era);
        iframe.title = era === 0 ? 'Globo interativo da Terra atual' : `Globo interativo da Terra há cerca de ${era} milhões de anos`;
    };
    if (imediato) carregar(); else viagem.timerGlobo = setTimeout(carregar, 450);
}

// ------------------------------------------------------------
// Período, época, acontecimentos e dinossauros
// ------------------------------------------------------------
function renderPeriodoViagem(epoca, periodo) {
    const div = document.getElementById('viagem-periodo');
    if (!div) return;
    const { lista, doPeriodoInteiro } = especiesParaEpoca(epoca);
    const clima = Object.entries(DADOS_CLIMA).find(([k]) => k.startsWith(periodo.nome))?.[1];

    div.innerHTML = `
        <div class="cartao periodo-info" data-periodo="${periodo.nome}">
            <div class="periodo-info-cabecalho">
                <h3>${periodo.nome}</h3>
                <span class="chip">${periodo.inicio} – ${periodo.fim} Ma</span>
            </div>
            <div class="epoca-destaque">
                <span class="eyebrow">Época: ${escapeHtml(epoca.nome)} · ${formatarNumero(epoca.inicio, epoca.inicio % 1 ? 1 : 0)}–${formatarNumero(epoca.fim, epoca.fim % 1 ? 1 : 0)} Ma</span>
                <p>${escapeHtml(epoca.destaque)}</p>
            </div>
            <h4 class="subtitulo">Acontecimentos marcantes do ${periodo.nome}</h4>
            <ul class="lista-eventos">${periodo.eventos.map(e => `<li><i class="bi bi-dot" aria-hidden="true"></i>${escapeHtml(e)}</li>`).join('')}</ul>
            ${clima ? `
                <div class="mini-clima">
                    <span><i class="bi bi-thermometer-half" aria-hidden="true"></i> ~${clima.temperatura} °C</span>
                    <span><i class="bi bi-cloud-haze2" aria-hidden="true"></i> ${formatarNumero(clima.co2, 0)} ppm de CO₂</span>
                    <button type="button" class="link-botao" data-action="ir" data-aba="clima">Clima e plantas <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
                </div>` : ''}
            <h4 class="subtitulo">${doPeriodoInteiro
                ? `Dinossauros do ${periodo.nome} no museu (${lista.length})`
                : `Dinossauros desta época no museu (${lista.length})`}</h4>
            ${doPeriodoInteiro ? `<p class="texto-suave nota-epoca">Nenhuma espécie do museu é do ${escapeHtml(epoca.nome)}; mostramos as do período inteiro.</p>` : ''}
            <div class="dinos-epoca">
                ${lista.map(d => `
                    <div class="dino-epoca">
                        <button type="button" class="dino-epoca-ficha" data-action="abrir-ficha" data-dino="${escapeHtml(d.Nome)}">
                            <img src="${caminhoImagemFossil(d.Nome)}" alt="" loading="lazy" data-fallback="${escapeHtml(d.Nome)}" data-fallback-tamanho="300x200">
                            <span><em>${escapeHtml(d.Nome)}</em><small>${escapeHtml(d.Periodo)}</small></span>
                        </button>
                        <button type="button" class="btn-icone btn-icone-sm" data-mapa-dino="${escapeHtml(d.Nome)}" aria-label="Ver ${escapeHtml(d.Nome)} no mapa" title="Ver no mapa">
                            <i class="bi bi-geo-alt" aria-hidden="true"></i>
                        </button>
                    </div>`).join('')}
            </div>
        </div>`;
    aplicarFallbackImagens(div);
}

// ------------------------------------------------------------
// Mapa dos sítios fósseis
// ------------------------------------------------------------
function prepararSeletorMapa(epoca) {
    const sel = document.getElementById('dino-mapa');
    if (!sel) return;
    const { lista, doPeriodoInteiro } = especiesParaEpoca(epoca);
    const comMapa = lista.filter(d => COORDENADAS_DINOSSAUROS[d.Nome]);
    if (!comMapa.some(d => d.Nome === viagem.dinoMapa)) viagem.dinoMapa = '';
    sel.innerHTML = `<option value="">Todas as espécies (${comMapa.length})</option>` +
        comMapa.map(d => `<option value="${escapeHtml(d.Nome)}"${d.Nome === viagem.dinoMapa ? ' selected' : ''}>${escapeHtml(d.Nome)}</option>`).join('');
    document.getElementById('mapa-titulo-texto').textContent = doPeriodoInteiro
        ? `Onde estão os fósseis do ${epoca.periodo}`
        : `Onde estão os fósseis do ${epoca.nome}`;
    document.getElementById('mapa-legenda').textContent = 'Toque num marcador para ver o dinossauro.';
}

/** Chamado pela ficha ("Ver fósseis no mapa") e pelos botões da lista de dinossauros. */
function selecionarDinoMapa(nome) {
    const d = buscarDinossauro(nome);
    if (!d) return;
    const epocaAtual = EPOCAS.find(e => e.nome === viagem.epoca);
    const visivel = epocaAtual && especiesParaEpoca(epocaAtual).lista.some(x => x.Nome === nome);
    // Se o dinossauro não é da época mostrada, leva a linha do tempo até a época dele
    if (!visivel) definirIdadeViagem(idadeMediaDaEpoca(d.Periodo), { atualizarSlider: true });
    viagem.dinoMapa = nome;
    const sel = document.getElementById('dino-mapa');
    if (sel) sel.value = nome;
    atualizarMapa();
}

registrarAcao('tentar-mapa', iniciarMapa);

/** Adiciona o mapa base, trocando para o próximo provedor se os azulejos falharem. */
function adicionarCamadaBase(mapa, indice = 0) {
    const config = CAMADAS_MAPA[indice];
    if (!config) return null;
    const camada = L.tileLayer(config.url, config.opcoes);
    let erros = 0;
    camada.on('tileerror', () => {
        erros++;
        if (erros === ERROS_PARA_TROCAR_CAMADA && CAMADAS_MAPA[indice + 1]) {
            console.warn(`Mapa base "${config.nome}" indisponível; usando "${CAMADAS_MAPA[indice + 1].nome}".`);
            mapa.removeLayer(camada);
            state.graficos.camadaBase = adicionarCamadaBase(mapa, indice + 1);
        }
    });
    camada.addTo(mapa);
    return camada;
}

async function iniciarMapa() {
    const el = document.getElementById('mapa-fosseis');
    if (!el) return;
    el.innerHTML = htmlCarregando('Carregando mapa...');
    const ok = await carregarBiblioteca('leaflet');
    if (!ok) {
        el.innerHTML = htmlBibliotecaIndisponivel('Leaflet (mapa)', 'tentar-mapa');
        el.classList.add('mapa-indisponivel');
        atualizarListaSitios();
        return;
    }
    el.classList.remove('mapa-indisponivel');
    el.innerHTML = '';
    if (state.graficos.mapa) state.graficos.mapa.remove();
    state.graficos.mapa = L.map(el, { center: [20, 0], zoom: 2, worldCopyJump: true });
    state.graficos.camadaBase = adicionarCamadaBase(state.graficos.mapa);
    state.graficos.camadaMarcadores = L.layerGroup().addTo(state.graficos.mapa);
    atualizarMapa();
    // O container pode ter sido medido antes de ficar visível
    setTimeout(() => state.graficos.mapa && state.graficos.mapa.invalidateSize(), 250);
}

function _especiesNoMapa() {
    const epoca = EPOCAS.find(e => e.nome === viagem.epoca);
    if (!epoca) return [];
    const { lista } = especiesParaEpoca(epoca);
    const comMapa = lista.filter(d => COORDENADAS_DINOSSAUROS[d.Nome]);
    return viagem.dinoMapa ? comMapa.filter(d => d.Nome === viagem.dinoMapa) : comMapa;
}

function _popupDino(nome) {
    const d = buscarDinossauro(nome);
    if (!d) return `<strong>${escapeHtml(nome)}</strong>`;
    return `
        <div class="popup-dino">
            <img src="${caminhoImagemFossil(d.Nome)}" alt="" width="200" height="120" loading="lazy">
            <strong><em>${escapeHtml(d.Nome)}</em></strong>
            <span>${escapeHtml(d.Periodo)} · ${escapeHtml(d.Dieta)}</span>
            <span>${formatarNumero(d.Comprimento, 1)} m · ${formatarMassa(d.Peso)}</span>
        </div>`;
}

function atualizarListaSitios() {
    const lista = document.getElementById('mapa-sitios');
    if (!lista) return;
    const especies = _especiesNoMapa();
    if (!viagem.dinoMapa) {
        const total = especies.reduce((s, d) => s + COORDENADAS_DINOSSAUROS[d.Nome].length, 0);
        lista.innerHTML = `<p class="texto-suave">${total} ${total === 1 ? 'sítio' : 'sítios'} de ${especies.length} ${especies.length === 1 ? 'espécie' : 'espécies'}.</p>`;
        return;
    }
    const coords = COORDENADAS_DINOSSAUROS[viagem.dinoMapa] || [];
    lista.innerHTML = `
        <p class="texto-suave">${coords.length} ${coords.length === 1 ? 'sítio registrado' : 'sítios registrados'}:</p>
        <ul>${coords.map(c => `<li><i class="bi bi-pin-map" aria-hidden="true"></i> ${formatarNumero(Math.abs(c.lat), 1)}° ${c.lat >= 0 ? 'N' : 'S'}, ${formatarNumero(Math.abs(c.lon), 1)}° ${c.lon >= 0 ? 'L' : 'O'}</li>`).join('')}</ul>
        <button type="button" class="btn btn-fantasma btn-sm" data-action="abrir-ficha" data-dino="${escapeHtml(viagem.dinoMapa)}"><i class="bi bi-journal-text" aria-hidden="true"></i> Ver ficha</button>`;
}

function atualizarMapa() {
    atualizarListaSitios();
    const mapa = state.graficos.mapa;
    const camada = state.graficos.camadaMarcadores;
    if (!mapa || !camada || typeof L === 'undefined') return;
    camada.clearLayers();

    const especies = _especiesNoMapa();
    const umaSo = !!viagem.dinoMapa;
    const pontos = [];
    especies.forEach(d => {
        COORDENADAS_DINOSSAUROS[d.Nome].forEach(c => {
            const marcador = umaSo
                ? L.marker([c.lat, c.lon], { title: d.Nome, alt: `Sítio fóssil de ${d.Nome}` })
                : L.circleMarker([c.lat, c.lon], { radius: 7, weight: 1.5, color: '#7a4b23', fillColor: '#e07a3f', fillOpacity: 0.85 });
            marcador.bindPopup(() => _popupDino(d.Nome), { maxWidth: 240 });
            marcador.addTo(camada);
            pontos.push([c.lat, c.lon]);
        });
    });
    if (pontos.length) mapa.fitBounds(pontos, { padding: [40, 40], maxZoom: umaSo ? 6 : 4 });
}
