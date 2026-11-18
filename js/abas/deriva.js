// js/abas/deriva.js – Globo da Terra antiga + mapa de sítios fósseis

const ERAS_GLOBO = [
    { valor: '0', rotulo: 'Hoje' },
    { valor: '66', rotulo: '66 Ma · Cretáceo' },
    { valor: '150', rotulo: '150 Ma · Jurássico' },
    { valor: '240', rotulo: '240 Ma · Triássico' }
];

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

const urlGlobo = era => `https://dinosaurpictures.org/ancient-earth?_t=${era}#${era}`;

registrarAba({
    id: 'deriva',
    titulo: 'Deriva Continental',
    subtitulo: 'Como os continentes estavam quando os dinossauros viviam',
    descricao: 'Globo da Terra antiga e mapa de sítios fósseis.',
    icone: 'bi-globe-americas',
    grupo: 'explorar',
    render(container) {
        const nomes = Object.keys(COORDENADAS_DINOSSAUROS).sort((a, b) => a.localeCompare(b, 'pt-BR'));
        const inicial = state.mapaDinoInicial && COORDENADAS_DINOSSAUROS[state.mapaDinoInicial] ? state.mapaDinoInicial : 'Tyrannosaurus rex';
        container.innerHTML = `
            <section class="cartao" aria-labelledby="globo-titulo">
                <div class="cartao-cabecalho">
                    <div>
                        <h3 id="globo-titulo"><i class="bi bi-globe2" aria-hidden="true"></i> Globo da Terra antiga</h3>
                        <p class="texto-suave">Arraste para girar. Reconstrução paleogeográfica de <a href="https://dinosaurpictures.org/ancient-earth" target="_blank" rel="noopener">Ancient Earth</a>.</p>
                    </div>
                    ${htmlSegmentado('era-globo', ERAS_GLOBO, '66', 'Escolha a era do globo')}
                </div>
                <div class="globo-wrapper">
                    <iframe id="iframe-globo" title="Globo interativo da Terra há 66 milhões de anos" src="${urlGlobo(66)}" loading="lazy" referrerpolicy="no-referrer"></iframe>
                </div>
            </section>

            <section class="cartao" aria-labelledby="mapa-titulo">
                <div class="cartao-cabecalho">
                    <div>
                        <h3 id="mapa-titulo"><i class="bi bi-geo-alt" aria-hidden="true"></i> Onde os fósseis foram encontrados</h3>
                        <p class="texto-suave">Clique em um marcador para ver a ficha resumida do dinossauro.</p>
                    </div>
                </div>
                <div class="mapa-layout">
                    <div class="mapa-controles">
                        <div class="campo">
                            <label for="dino-mapa">Dinossauro</label>
                            <select id="dino-mapa" class="select">${htmlOpcoes(nomes, inicial)}</select>
                        </div>
                        <label class="interruptor">
                            <input type="checkbox" id="mapa-todos">
                            <span>Mostrar todas as espécies</span>
                        </label>
                        <div id="mapa-sitios" class="lista-sitios" aria-live="polite"></div>
                    </div>
                    <div id="mapa-fosseis" class="mapa" role="region" aria-label="Mapa de sítios fósseis">${htmlCarregando('Carregando mapa...')}</div>
                </div>
            </section>
        `;

        ligarSegmentado(container, 'era-globo', era => {
            const iframe = document.getElementById('iframe-globo');
            iframe.src = urlGlobo(era);
            iframe.title = era === '0' ? 'Globo interativo da Terra atual' : `Globo interativo da Terra há ${era} milhões de anos`;
        });
        container.querySelector('#dino-mapa').addEventListener('change', atualizarMapa);
        container.querySelector('#mapa-todos').addEventListener('change', atualizarMapa);
        iniciarMapa();
    }
});

registrarAcao('tentar-mapa', iniciarMapa);

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
    if (state.graficos.mapa) { state.graficos.mapa.remove(); }
    state.graficos.mapa = L.map(el, { center: [20, 0], zoom: 2, worldCopyJump: true });
    state.graficos.camadaBase = adicionarCamadaBase(state.graficos.mapa);
    state.graficos.camadaMarcadores = L.layerGroup().addTo(state.graficos.mapa);
    atualizarMapa();
    // O container pode ter sido medido antes de ficar visível
    setTimeout(() => state.graficos.mapa && state.graficos.mapa.invalidateSize(), 250);
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
    const todos = document.getElementById('mapa-todos')?.checked;
    const nome = document.getElementById('dino-mapa')?.value;
    if (todos) {
        const total = Object.values(COORDENADAS_DINOSSAUROS).reduce((s, c) => s + c.length, 0);
        lista.innerHTML = `<p class="texto-suave">${total} sítios de ${Object.keys(COORDENADAS_DINOSSAUROS).length} espécies.</p>`;
        return;
    }
    const coords = COORDENADAS_DINOSSAUROS[nome] || [];
    lista.innerHTML = `
        <p class="texto-suave">${coords.length} ${coords.length === 1 ? 'sítio registrado' : 'sítios registrados'}:</p>
        <ul>${coords.map(c => `<li><i class="bi bi-pin-map" aria-hidden="true"></i> ${formatarNumero(Math.abs(c.lat), 1)}° ${c.lat >= 0 ? 'N' : 'S'}, ${formatarNumero(Math.abs(c.lon), 1)}° ${c.lon >= 0 ? 'L' : 'O'}</li>`).join('')}</ul>
        <button type="button" class="btn btn-fantasma btn-sm" data-action="abrir-ficha" data-dino="${escapeHtml(nome)}"><i class="bi bi-journal-text" aria-hidden="true"></i> Ver ficha</button>`;
}

function atualizarMapa() {
    atualizarListaSitios();
    const mapa = state.graficos.mapa;
    const camada = state.graficos.camadaMarcadores;
    if (!mapa || !camada || typeof L === 'undefined') return;
    camada.clearLayers();

    const todos = document.getElementById('mapa-todos')?.checked;
    const nomeSel = document.getElementById('dino-mapa')?.value;
    const nomes = todos ? Object.keys(COORDENADAS_DINOSSAUROS) : [nomeSel];
    const pontos = [];
    nomes.forEach(nome => {
        (COORDENADAS_DINOSSAUROS[nome] || []).forEach(c => {
            const marcador = todos
                ? L.circleMarker([c.lat, c.lon], { radius: 6, weight: 1, color: '#7a4b23', fillColor: '#e07a3f', fillOpacity: 0.85 })
                : L.marker([c.lat, c.lon], { title: nome, alt: `Sítio fóssil de ${nome}` });
            marcador.bindPopup(() => _popupDino(nome), { maxWidth: 240 });
            marcador.addTo(camada);
            pontos.push([c.lat, c.lon]);
        });
    });
    if (pontos.length) mapa.fitBounds(pontos, { padding: [40, 40], maxZoom: todos ? 3 : 6 });
}

function selecionarDinoMapa(nome) {
    const sel = document.getElementById('dino-mapa');
    if (!sel || !COORDENADAS_DINOSSAUROS[nome]) return;
    sel.value = nome;
    const todos = document.getElementById('mapa-todos');
    if (todos) todos.checked = false;
    atualizarMapa();
}
