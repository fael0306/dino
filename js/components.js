// js/components.js

console.log('🔄 components.js carregado (versão UI renovada)');

// ============================================================
// ESTADO GLOBAL PARA PERSISTÊNCIA ENTRE ABAS
// ============================================================
const state = {
    initialized: {
        escala: false,
        deriva: false,
        extincao: false,
        icnofosseis: false,
        fosseis: false,
        massa: false,
        quiz: false,
        tempo: false,
        clima: false,
        conquistas: false,
        pdf: false,
        arvore: false
    }
};

// ============================================================
// FUNÇÃO AUXILIAR DE FALLBACK PARA BIBLIOTECAS EXTERNAS
// ============================================================
function verificarBiblioteca(nome, objeto, containerId) {
    if (typeof objeto !== 'undefined') return true;

    const mensagem = `
        <div class="card-paleo" style="border-left: 4px solid #e74c3c; background: #fdf0ed;">
            <h5><i class="bi bi-exclamation-triangle" style="color: #e74c3c;"></i> Biblioteca não carregada</h5>
            <p>A biblioteca <strong>${nome}</strong> não pôde ser carregada. Verifique sua conexão com a internet e recarregue a página.</p>
            <p><small>Se o problema persistir, tente usar um navegador atualizado ou entre em contato com o suporte.</small></p>
            <button class="btn-paleo" onclick="location.reload()"><i class="bi bi-arrow-clockwise"></i> Recarregar página</button>
        </div>
    `;

    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = mensagem;
        } else {
            console.warn(`Biblioteca ${nome} não disponível e container #${containerId} não encontrado.`);
            alert(`A biblioteca ${nome} não pôde ser carregada. Verifique sua conexão.`);
        }
    } else {
        console.warn(`Biblioteca ${nome} não disponível.`);
        alert(`A biblioteca ${nome} não pôde ser carregada. Verifique sua conexão.`);
    }
    return false;
}

// ============================================================
// RENDERIZAÇÃO DAS ABAS (com isolamento de erros)
// ============================================================
function renderizarAbas() {
    console.log('▶️ renderizarAbas() iniciado');
    const renderizadores = [
        { fn: renderEscalaReal, id: 'escala' },
        { fn: renderDerivaContinental, id: 'deriva' },
        { fn: renderExtincaoKpg, id: 'extincao' },
        { fn: renderIcnofosseis, id: 'icnofosseis' },
        { fn: renderFosseisReais, id: 'fosseis' },
        { fn: renderMassaCorporal, id: 'massa' },
        { fn: renderQuiz, id: 'quiz' },
        { fn: renderLinhaTempo, id: 'tempo' },
        { fn: renderClima, id: 'clima' },
        { fn: renderConquistas, id: 'conquistas' },
        { fn: renderExportPDF, id: 'pdf' },
        { fn: renderArvoreEvolutiva, id: 'arvore' }
    ];

    renderizadores.forEach(({ fn, id }) => {
        try {
            console.log(`📌 Renderizando aba: ${id}`);
            fn();
        } catch (e) {
            console.error(`❌ Erro ao renderizar aba "${id}":`, e);
            const container = document.getElementById(`tab-${id}`);
            if (container) {
                container.innerHTML = `
                    <div class="card-paleo" style="border-left:4px solid #e74c3c;">
                        <h5><i class="bi bi-exclamation-triangle"></i> Erro ao carregar</h5>
                        <p class="text-danger">${e.message || 'Verifique o console.'}</p>
                    </div>
                `;
            }
        }
    });
    console.log('✅ renderizarAbas() concluído');
}

// ============================================================
// 1. ESCALA REAL – com comparação múltipla (3 animais)
// ============================================================
function renderEscalaReal() {
    if (state.initialized.escala) return;
    console.log('🔧 renderEscalaReal()');
    const container = document.getElementById('tab-escala');

    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-rulers"></i> Compare a Escala</h4>
            <div class="row g-3 align-items-end">
                <!-- Dinossauro principal -->
                <div class="col-md-4">
                    <label class="form-label">Dinossauro</label>
                    <select id="dino-escala" class="form-select">
                        ${DINOSSAUROS_CLASSICOS.map(d => `<option value="${d.Nome}">${d.Nome}</option>`).join('')}
                    </select>
                </div>
                <!-- Primeira referência -->
                <div class="col-md-4">
                    <label class="form-label">Comparar com</label>
                    <select id="ref-escala" class="form-select">
                        <option value="Humano">Humano (1.7m)</option>
                        <option value="Elefante">Elefante (3.3m)</option>
                        <option value="Outro">Outro dinossauro...</option>
                    </select>
                </div>
                <div id="outro-dino-container" class="col-md-4" style="display:none;">
                    <label class="form-label">Outro dinossauro</label>
                    <select id="outro-dino-escala" class="form-select"></select>
                </div>
                <!-- Segunda referência (nova) -->
                <div class="col-md-4">
                    <label class="form-label">Comparar também com</label>
                    <select id="ref-escala-2" class="form-select">
                        <option value="Nenhum">Nenhum</option>
                        <option value="Humano">Humano (1.7m)</option>
                        <option value="Elefante">Elefante (3.3m)</option>
                        <option value="Outro">Outro dinossauro...</option>
                    </select>
                </div>
                <div id="outro-dino-container-2" class="col-md-4" style="display:none;">
                    <label class="form-label">Outro dinossauro</label>
                    <select id="outro-dino-escala-2" class="form-select"></select>
                </div>
                <div class="col-12">
                    <button class="btn-paleo" onclick="atualizarEscala()"><i class="bi bi-arrow-repeat"></i> Atualizar</button>
                </div>
            </div>
            <div id="imagem-comparacao" class="mt-3 text-center" style="background:#f8f9fa; padding:1.5rem; border-radius:12px;">
                <p class="text-muted">Selecione os animais e clique em Atualizar.</p>
            </div>
        </div>
    `;

    // Popula os selects "Outro dinossauro"
    const nomes = DINOSSAUROS_CLASSICOS.map(d => d.Nome);

    const outroSelect1 = document.getElementById('outro-dino-escala');
    outroSelect1.innerHTML = nomes.map(n => `<option value="${n}">${n}</option>`).join('');

    const outroSelect2 = document.getElementById('outro-dino-escala-2');
    outroSelect2.innerHTML = nomes.map(n => `<option value="${n}">${n}</option>`).join('');

    // Eventos para mostrar/ocultar os selects "Outro"
    document.getElementById('ref-escala').addEventListener('change', function() {
        document.getElementById('outro-dino-container').style.display = this.value === 'Outro' ? 'block' : 'none';
    });

    document.getElementById('ref-escala-2').addEventListener('change', function() {
        document.getElementById('outro-dino-container-2').style.display = this.value === 'Outro' ? 'block' : 'none';
    });

    console.log('✅ renderEscalaReal() concluído');
    state.initialized.escala = true;
}

// ============================================================
// ATUALIZAR ESCALA – com suporte para 2 ou 3 imagens
// ============================================================
window.atualizarEscala = async function() {
    const container = document.getElementById('imagem-comparacao');
    container.innerHTML = `
        <div class="loading-message">
            <i class="bi bi-arrow-repeat spinner"></i>
            <span>Carregando imagens e gerando comparação...</span>
        </div>
    `;
    try {
        // --- DINOSSAURO PRINCIPAL ---
        const dinoSel = document.getElementById('dino-escala').value;
        const dino = DINOSSAUROS_CLASSICOS.find(d => d.Nome === dinoSel);
        if (!dino) throw new Error(`Dinossauro "${dinoSel}" não encontrado.`);

        // --- PRIMEIRA REFERÊNCIA ---
        const refSel = document.getElementById('ref-escala').value;
        let ref1Nome, ref1Altura;
        if (refSel === 'Outro') {
            ref1Nome = document.getElementById('outro-dino-escala').value;
            const refObj = DINOSSAUROS_CLASSICOS.find(d => d.Nome === ref1Nome);
            ref1Altura = refObj ? refObj.Altura : 1.7;
        } else if (refSel === 'Humano') {
            ref1Nome = 'Humano';
            ref1Altura = 1.7;
        } else if (refSel === 'Elefante') {
            ref1Nome = 'Elefante';
            ref1Altura = 3.3;
        } else {
            ref1Nome = 'Humano';
            ref1Altura = 1.7;
        }

        // --- SEGUNDA REFERÊNCIA (opcional) ---
        const refSel2 = document.getElementById('ref-escala-2').value;
        let ref2Nome = null;
        let ref2Altura = null;
        let usarTerceiro = false;

        if (refSel2 !== 'Nenhum') {
            usarTerceiro = true;
            if (refSel2 === 'Outro') {
                ref2Nome = document.getElementById('outro-dino-escala-2').value;
                const refObj = DINOSSAUROS_CLASSICOS.find(d => d.Nome === ref2Nome);
                ref2Altura = refObj ? refObj.Altura : 1.7;
            } else if (refSel2 === 'Humano') {
                ref2Nome = 'Humano';
                ref2Altura = 1.7;
            } else if (refSel2 === 'Elefante') {
                ref2Nome = 'Elefante';
                ref2Altura = 3.3;
            }
        }

        // --- DEFINE ALTURA MÁXIMA PARA REDIMENSIONAMENTO ---
        const alturaMax = 300;
        const alturas = [dino.Altura, ref1Altura];
        if (usarTerceiro && ref2Altura !== null) alturas.push(ref2Altura);
        const maxAltura = Math.max(...alturas);

        function calcularAlturaPx(alturaReal) {
            return Math.round(alturaMax * (alturaReal / maxAltura));
        }

        const alturaDinoPx = calcularAlturaPx(dino.Altura);
        const alturaRef1Px = calcularAlturaPx(ref1Altura);

        // Carrega imagens
        const imgDino = await carregarImagemOriginal(dinoSel);
        const imgRef1 = await carregarImagemOriginal(ref1Nome);

        function imgParaDataUrl(img, altura) {
            const ratio = altura / img.height;
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * ratio);
            canvas.height = altura;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/png');
        }

        const dataUrlDino = imgParaDataUrl(imgDino, alturaDinoPx);
        const dataUrlRef1 = imgParaDataUrl(imgRef1, alturaRef1Px);

        let dataUrlFinal;

        if (usarTerceiro && ref2Nome && ref2Altura !== null) {
            // --- TRÊS IMAGENS ---
            const alturaRef2Px = calcularAlturaPx(ref2Altura);
            const imgRef2 = await carregarImagemOriginal(ref2Nome);
            const dataUrlRef2 = imgParaDataUrl(imgRef2, alturaRef2Px);
            dataUrlFinal = await combinarLadoALadoTres(dataUrlRef1, dataUrlDino, dataUrlRef2);
            // Ordem: referência1, dinossauro, referência2
            container.innerHTML = `
                <img src="${dataUrlFinal}" style="max-width:100%; display:block; margin:0 auto; border-radius:8px;">
                <p style="text-align:center; margin-top:12px; font-weight:500;">
                    <strong>${ref1Nome}</strong> (${ref1Altura}m) &nbsp;×&nbsp;
                    <strong>${dinoSel}</strong> (${dino.Altura}m) &nbsp;×&nbsp;
                    <strong>${ref2Nome}</strong> (${ref2Altura}m) —
                    proporções <strong>${(dino.Altura/ref1Altura).toFixed(1)}x</strong> e <strong>${(dino.Altura/ref2Altura).toFixed(1)}x</strong>
                </p>
            `;
        } else {
            // --- DUAS IMAGENS (comportamento original) ---
            dataUrlFinal = await combinarLadoALado(dataUrlRef1, dataUrlDino);
            const razao = (dino.Altura / ref1Altura).toFixed(1);
            container.innerHTML = `
                <img src="${dataUrlFinal}" style="max-width:100%; display:block; margin:0 auto; border-radius:8px;">
                <p style="text-align:center; margin-top:12px; font-weight:500;">
                    <strong>${ref1Nome}</strong> (${ref1Altura}m) &nbsp;×&nbsp;
                    <strong>${dinoSel}</strong> (${dino.Altura}m) —
                    proporção <strong>${razao}x</strong>
                </p>
            `;
        }
    } catch (e) {
        console.error('Erro em atualizarEscala:', e);
        container.innerHTML = `
            <div class="alert alert-danger">Erro ao carregar a comparação.<br><small>${e.message}</small></div>
        `;
    }
};

// ============================================================
// 2. DERIVA CONTINENTAL (com popup sem imagem)
// ============================================================
window.criarPopupConteudo = function(nome) {
    try {
        let dino = DINOSSAUROS_REAIS.find(d => d.Nome === nome);
        if (!dino) dino = DINOSSAUROS_CLASSICOS.find(d => d.Nome === nome);
        if (!dino) {
            return `<b>${nome}</b><br>Dados não disponíveis.`;
        }

        return `
            <div style="min-width:180px; max-width:300px; text-align:left; padding:4px 0;">
                <h4 style="margin:0 0 6px 0; font-size:1.1rem;">${dino.Nome}</h4>
                <p style="margin:4px 0;"><strong>Período:</strong> ${dino.Periodo}</p>
                <p style="margin:4px 0;"><strong>Dieta:</strong> ${dino.Dieta}</p>
            </div>
        `;
    } catch (e) {
        console.error('Erro ao gerar popup:', e);
        return `<b>${nome}</b><br>Erro ao carregar informações.`;
    }
};

function renderDerivaContinental() {
    if (state.initialized.deriva) return;
    console.log('🔧 renderDerivaContinental()');
    const container = document.getElementById('tab-deriva');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-globe2"></i> Globo Interativo da Terra Antiga</h4>
            <div class="mb-3">
                <label class="form-label">Selecione a era:</label>
                <select id="era-globo" class="form-select">
                    <option value="0">Mundo Atual (0 Ma)</option>
                    <option value="66" selected>Cretáceo Superior (66 Ma)</option>
                    <option value="150">Jurássico Superior (150 Ma)</option>
                    <option value="240">Triássico Médio (240 Ma)</option>
                </select>
            </div>
            <iframe id="iframe-globo" src="https://dinosaurpictures.org/ancient-earth?_t=66#66" width="100%" height="500" style="border:none; border-radius:12px;"></iframe>
            <div class="mt-4">
                <h5><i class="bi bi-geo-alt"></i> Localização dos Fósseis</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <select id="dino-mapa" class="form-select">
                            ${Object.keys(COORDENADAS_DINOSSAUROS).map(n => `<option value="${n}">${n}</option>`).join('')}
                        </select>
                        <button class="btn-paleo mt-2" onclick="atualizarMapa()"><i class="bi bi-search"></i> Mostrar no mapa</button>
                    </div>
                    <div class="col-md-8">
                        <div id="mapa-fosseis" style="height:300px; border-radius:12px; overflow:hidden;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    if (!verificarBiblioteca('Leaflet', L, 'tab-deriva')) {
        return;
    }

    document.getElementById('era-globo').addEventListener('change', function() {
        const url = `https://dinosaurpictures.org/ancient-earth?_t=${this.value}#${this.value}`;
        document.getElementById('iframe-globo').src = url;
    });

    setTimeout(() => {
        try { atualizarMapa(); } catch(e) { console.error('Erro no mapa:', e); }
    }, 500);

    state.initialized.deriva = true;
}

let mapaLeaflet = null;

window.atualizarMapa = function() {
    try {
        const dino = document.getElementById('dino-mapa')?.value;
        if (!dino) {
            console.warn('Nenhum dinossauro selecionado');
            return;
        }
        const coords = COORDENADAS_DINOSSAUROS[dino] || [];
        const container = document.getElementById('mapa-fosseis');
        if (!container) {
            console.warn('Container do mapa não encontrado');
            return;
        }

        if (typeof L === 'undefined') {
            container.innerHTML = '<p class="text-danger">Leaflet não está disponível.</p>';
            return;
        }

        if (!mapaLeaflet) {
            mapaLeaflet = L.map(container, {
                center: [0, 0],
                zoom: 2
            });
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap, © CartoDB',
                maxZoom: 19
            }).addTo(mapaLeaflet);
        }

        mapaLeaflet.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                mapaLeaflet.removeLayer(layer);
            }
        });

        if (coords.length > 0) {
            const bounds = [];
            coords.forEach(c => {
                const marker = L.marker([c.lat, c.lon], {
                    dinoName: dino,
                    bubblingMouseEvents: false,
                    interactive: true
                });
                marker.addTo(mapaLeaflet);

                marker.on('click', async function(e) {
                    L.DomEvent.stopPropagation(e);
                    const nome = this.options.dinoName;
                    try {
                        this.bindPopup('<div style="text-align:center;">Carregando...</div>').openPopup();
                        const html = window.criarPopupConteudo(nome);
                        this.closePopup();
                        this.bindPopup(html).openPopup();
                    } catch (err) {
                        console.error('Erro ao abrir popup:', err);
                        this.closePopup();
                        this.bindPopup(`<b>${nome}</b><br>Erro ao carregar informações.`).openPopup();
                    }
                });

                bounds.push([c.lat, c.lon]);
            });
            mapaLeaflet.fitBounds(bounds);
        } else {
            mapaLeaflet.setView([0, 0], 2);
        }
    } catch (e) {
        console.error('Erro em atualizarMapa:', e);
    }
};

// ============================================================
// 3. EXTINÇÃO K-PG
// ============================================================
function renderExtincaoKpg() {
    if (state.initialized.extincao) return;
    console.log('🔧 renderExtincaoKpg()');
    const container = document.getElementById('tab-extincao');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-biohazard"></i> Simulador do Fim do Cretáceo</h4>
            <div class="row g-4">
                <div class="col-md-4">
                    <label class="form-label">🌑 Bloqueio Solar (%)</label>
                    <input type="range" id="bloqueio" class="form-range" min="0" max="100" value="15">
                    <span id="bloqueio-val" class="badge bg-primary">15</span>
                    <label class="form-label mt-3">☔ Chuva Ácida (%)</label>
                    <input type="range" id="chuva" class="form-range" min="0" max="100" value="40">
                    <span id="chuva-val" class="badge bg-primary">40</span>
                    <label class="form-label mt-3">📅 Anos após impacto</label>
                    <input type="number" id="anos-sim" class="form-control" value="30" min="1" max="50">
                    <button class="btn-paleo mt-3" onclick="executarSimulacao()"><i class="bi bi-play-circle"></i> Simular</button>
                </div>
                <div class="col-md-8">
                    <div id="grafico-container">
                        <canvas id="grafico-extincao" width="400" height="300"></canvas>
                    </div>
                    <div id="status-extincao" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;

    if (!verificarBiblioteca('Chart.js', Chart, 'tab-extincao')) {
        return;
    }

    document.getElementById('bloqueio').addEventListener('input', function() {
        document.getElementById('bloqueio-val').textContent = this.value;
    });
    document.getElementById('chuva').addEventListener('input', function() {
        document.getElementById('chuva-val').textContent = this.value;
    });

    state.initialized.extincao = true;
}

let chartExtincao = null;
window.executarSimulacao = function() {
    const statusDiv = document.getElementById('status-extincao');
    statusDiv.innerHTML = `
        <div class="loading-message" style="padding: 1rem;">
            <i class="bi bi-arrow-repeat spinner"></i>
            <span>Processando simulação...</span>
        </div>
    `;
    try {
        if (typeof Chart === 'undefined') {
            statusDiv.innerHTML = `<div class="alert alert-warning">Chart.js não carregado. Verifique sua conexão.</div>`;
            return;
        }
        const bloqueio = parseFloat(document.getElementById('bloqueio').value);
        const chuva = parseFloat(document.getElementById('chuva').value);
        const anos = parseInt(document.getElementById('anos-sim').value);

        const dados = simularExtincao(bloqueio, chuva, anos);
        const labels = dados.P.map((_, i) => (i * 0.5).toFixed(1));

        const ctx = document.getElementById('grafico-extincao').getContext('2d');
        if (chartExtincao) chartExtincao.destroy();
        chartExtincao = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'Plantas', data: dados.P, borderColor: '#27ae60', backgroundColor: 'rgba(39,174,96,0.1)', fill: true },
                    { label: 'Herbívoros', data: dados.H, borderColor: '#2980b9', backgroundColor: 'rgba(41,128,185,0.1)', fill: true },
                    { label: 'Carnívoros', data: dados.C, borderColor: '#e74c3c', backgroundColor: 'rgba(231,76,60,0.1)', fill: true }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true } }
            }
        });

        const P_final = dados.P[dados.P.length - 1];
        const H_final = dados.H[dados.H.length - 1];
        if (P_final < 1) {
            statusDiv.innerHTML = `<div class="alert alert-danger">🔥 COLAPSO TOTAL: extinção das plantas.</div>`;
        } else if (H_final < 5) {
            statusDiv.innerHTML = `<div class="alert alert-warning">⚠️ ECOSSISTEMA DEVASTADO.</div>`;
        } else {
            statusDiv.innerHTML = `<div class="alert alert-success">🌿 ECOSSISTEMA ESTÁVEL.</div>`;
        }
    } catch (e) {
        console.error('Erro na simulação:', e);
        statusDiv.innerHTML = `<div class="alert alert-danger">Erro na simulação.</div>`;
    }
};

// ============================================================
// 4. ICNOFÓSSEIS (com atualização dinâmica)
// ============================================================
function renderIcnofosseis() {
    if (state.initialized.icnofosseis) return;
    console.log('🔧 renderIcnofosseis()');
    const container = document.getElementById('tab-icnofosseis');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-footprints"></i> Paleo-Detetive: Identifique a Pegada</h4>
            <div class="row g-4">
                <div class="col-md-5">
                    <div id="icno-imagem" class="icno-imagem text-center" style="min-height:200px;">
                        <p class="text-muted">Clique em "Novo Desafio"</p>
                    </div>
                    <button class="btn-paleo mt-3" onclick="novoDesafioIcnofosseis()"><i class="bi bi-shuffle"></i> Novo Desafio</button>
                </div>
                <div class="col-md-7">
                    <div id="icno-perguntas"></div>
                    <button class="btn-paleo mt-3" onclick="identificarIcnofosseis()"><i class="bi bi-check-lg"></i> Identificar</button>
                    <div id="icno-resultado" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;
    if (!window.icnoEstado) {
        window.icnoEstado = { desafio: null, respostas: {} };
    }
    setTimeout(novoDesafioIcnofosseis, 100);
    state.initialized.icnofosseis = true;
}

let icnoDesafioAtual = null;

window.atualizarPerguntasExtras = function() {
    const extraDiv = document.getElementById('icno-perguntas-extra');
    if (!extraDiv) return;

    const dedos = parseInt(document.getElementById('icno-dedos').value);
    const garras = document.getElementById('icno-garras').value === 'true';

    let html = '';

    if (dedos === 3) {
        html += `
            <div class="mb-2">
                <label>3. Tamanho:</label>
                <select id="icno-tamanho" class="form-select">
                    <option value="pequeno">Pequeno (<25cm)</option>
                    <option value="grande">Grande (>25cm)</option>
                </select>
            </div>
        `;
        if (garras) {
            html += `
                <div class="mb-2">
                    <label>4. Formato:</label>
                    <select id="icno-forma" class="form-select">
                        <option value="alongada">Alongada e estreita</option>
                        <option value="larga">Larga e robusta</option>
                    </select>
                </div>
            `;
        }
    } else {
        if (!garras) {
            html += `
                <div class="mb-2">
                    <label>3. Proporção:</label>
                    <select id="icno-proporcao" class="form-select">
                        <option value="larga">Mais larga que comprida</option>
                        <option value="alongada">Mais comprida que larga</option>
                    </select>
                </div>
            `;
        }
    }

    extraDiv.innerHTML = html;
};

window.novoDesafioIcnofosseis = async function() {
    const imgDiv = document.getElementById('icno-imagem');
    imgDiv.innerHTML = `
        <div class="loading-message">
            <i class="bi bi-arrow-repeat spinner"></i>
            <span>Carregando pegada misteriosa...</span>
        </div>
    `;
    try {
        const nomes = Object.keys(ICNOFOSSEIS);
        icnoDesafioAtual = nomes[Math.floor(Math.random() * nomes.length)];

        const imgSrc = await carregarImagemIcnofossil(icnoDesafioAtual);
        imgDiv.innerHTML = `<img src="${imgSrc}" class="img-fluid" alt="Pegada de ${icnoDesafioAtual}" style="max-height:250px;"><p class="mt-2 text-muted">Fóssil misterioso</p>`;

        const perguntasDiv = document.getElementById('icno-perguntas');
        perguntasDiv.innerHTML = `
            <div class="mb-2">
                <label>1. Quantos dedos tocam o chão?</label>
                <select id="icno-dedos" class="form-select">
                    <option value="3">3 dedos</option>
                    <option value="4">4 dedos</option>
                </select>
            </div>
            <div class="mb-2">
                <label>2. Há marcas de garras?</label>
                <select id="icno-garras" class="form-select">
                    <option value="true">Sim</option>
                    <option value="false">Não</option>
                </select>
            </div>
            <div id="icno-perguntas-extra"></div>
        `;

        document.getElementById('icno-dedos').addEventListener('change', window.atualizarPerguntasExtras);
        document.getElementById('icno-garras').addEventListener('change', window.atualizarPerguntasExtras);

        window.atualizarPerguntasExtras();
        document.getElementById('icno-resultado').innerHTML = '';
    } catch (e) {
        console.error('Erro no novo desafio:', e);
        imgDiv.innerHTML = `<div class="alert alert-danger">Erro ao carregar pegada.</div>`;
    }
};

window.identificarIcnofosseis = function() {
    try {
        const dedos = parseInt(document.getElementById('icno-dedos').value);
        const garras = document.getElementById('icno-garras').value === 'true';
        const tamanho = document.getElementById('icno-tamanho') ? document.getElementById('icno-tamanho').value : null;
        const forma = document.getElementById('icno-forma') ? document.getElementById('icno-forma').value : null;
        const proporcao = document.getElementById('icno-proporcao') ? document.getElementById('icno-proporcao').value : null;

        const resultado = identificarIcnogenus(dedos, garras, tamanho, forma, proporcao);
        const div = document.getElementById('icno-resultado');
        if (resultado === icnoDesafioAtual) {
            div.innerHTML = `<div class="alert alert-success">✅ Parabéns! Você acertou! O fóssil é <strong>${resultado}</strong>.</div>`;
            desbloquearConquista('detetive_icno');
        } else {
            div.innerHTML = `<div class="alert alert-danger">❌ Você descreveu <strong>${resultado}</strong>, mas o fóssil é <strong>${icnoDesafioAtual}</strong>.</div>`;
        }
    } catch (e) {
        console.error('Erro na identificação:', e);
        document.getElementById('icno-resultado').innerHTML = `<div class="alert alert-danger">Erro ao identificar.</div>`;
    }
};

// ============================================================
// 5. FÓSSEIS REAIS
// ============================================================
function renderFosseisReais() {
    if (state.initialized.fosseis) return;
    console.log('🔧 renderFosseisReais()');
    const container = document.getElementById('tab-fosseis');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-bone"></i> Museu de Fósseis Reais</h4>
            <button class="btn-paleo mb-3" onclick="sortearFossil()"><i class="bi bi-dice-6"></i> Sortear Dinossauro Real</button>
            <div id="fossil-detalhe"></div>
        </div>
    `;
    setTimeout(sortearFossil, 100);
    state.initialized.fosseis = true;
}

window.sortearFossil = async function() {
    try {
        const dino = DINOSSAUROS_REAIS[Math.floor(Math.random() * DINOSSAUROS_REAIS.length)];
        const div = document.getElementById('fossil-detalhe');

        const imgSrc = await carregarImagemFossilReal(dino.Nome);

        div.innerHTML = `
            <div class="card-paleo" style="border-left:4px solid var(--secondary);">
                <div class="row g-3">
                    <div class="col-md-6">
                        <h5>${dino.Nome}</h5>
                        <p><strong>Período:</strong> ${dino.Periodo}</p>
                        <p><strong>Dieta:</strong> ${dino.Dieta}</p>
                        <p><strong>Comprimento:</strong> ${dino.Comprimento} m</p>
                        <p><strong>Peso:</strong> ${dino.Peso} ton</p>
                        <p><strong>Curiosidade:</strong> ${dino.Curiosidade}</p>
                    </div>
                    <div class="col-md-6 text-center">
                        <img src="${imgSrc}" class="img-fluid" alt="${dino.Nome}" style="max-height:300px; border-radius:12px;">
                    </div>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Erro ao sortear fóssil:', e);
        document.getElementById('fossil-detalhe').innerHTML = `<div class="alert alert-danger">Erro ao carregar fóssil.</div>`;
    }
};

// ============================================================
// 6. MASSA CORPORAL
// ============================================================
function renderMassaCorporal() {
    if (state.initialized.massa) return;
    console.log('🔧 renderMassaCorporal()');
    const container = document.getElementById('tab-massa');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-weight-scale"></i> Estimativa de Massa Corporal</h4>
            <div class="row g-4">
                <div class="col-md-5">
                    <label class="form-label">Tipo de Locomoção:</label>
                    <select id="tipo-postura" class="form-select">
                        <option value="bipede">Bípede (ex: T-Rex)</option>
                        <option value="quadrupede">Quadrúpede (ex: Braquiossauro)</option>
                    </select>
                    <label class="form-label mt-3">Circunferência do Fêmur (cm):</label>
                    <input type="number" id="femur-cm" class="form-control" value="50" min="0.5" max="300">
                    <button class="btn-paleo mt-3" onclick="calcularMassa()"><i class="bi bi-calculator"></i> Calcular</button>
                    <div id="resultado-massa" class="mt-3"></div>
                </div>
                <div class="col-md-7">
                    <p><strong>Fórmula:</strong> Massa = a × (Circunferência_mm)^b</p>
                    <p><strong>Referência:</strong> Campione & Evans (2012)</p>
                    <div id="comparacao-massa"></div>
                    <!-- NOVO: gráfico de dispersão -->
                    <div class="mt-4">
                        <h6>📊 Comparação com dinossauros clássicos</h6>
                        <canvas id="grafico-massa" width="400" height="250"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
    state.initialized.massa = true;
    // No final de renderMassaCorporal, adicione:
setTimeout(() => {
    // Inicializa o gráfico com os dados fixos, sem ponto do usuário
    atualizarGraficoMassa(0, 0);
}, 100);
}

window.calcularMassa = function() {
    try {
        const postura = document.getElementById('tipo-postura').value;
        const circCm = parseFloat(document.getElementById('femur-cm').value);
        const a = postura === 'bipede' ? 0.00016 : 0.00049;
        const b = postura === 'bipede' ? 2.73 : 2.75;
        const circMm = circCm * 10;
        const massaKg = a * Math.pow(circMm, b);
        const massaTon = massaKg / 1000;

        document.getElementById('resultado-massa').innerHTML = `
            <div class="alert alert-info">
                <strong>Massa estimada:</strong> ${massaTon.toFixed(2)} toneladas (${massaKg.toFixed(0)} kg)
            </div>
        `;

        const elefante = 6.0;
        const trex = 8.4;
        const patago = 70.0;
        document.getElementById('comparacao-massa').innerHTML = `
            <p>Equivalente a:</p>
            <ul class="list-unstyled">
                <li>🐘 ${(massaTon / elefante).toFixed(1)} elefantes</li>
                <li>🦖 ${(massaTon / trex).toFixed(1)} T-Rex</li>
                <li>🦕 ${(massaTon / patago).toFixed(2)} Patagotitan</li>
            </ul>
        `;

        // 🔥 ATUALIZA O GRÁFICO COM O PONTO DO USUÁRIO
        atualizarGraficoMassa(circCm, massaTon);

    } catch (e) {
        console.error('Erro no cálculo de massa:', e);
        document.getElementById('resultado-massa').innerHTML = `<div class="alert alert-danger">Erro no cálculo.</div>`;
    }
};

// ============================================================
// 7. QUIZ
// ============================================================
let quizEstado = { nivel: null, indice: 0, pontuacao: 0, perguntas: [], respostas: [], concluido: false };

function renderQuiz() {
    if (state.initialized.quiz) return;
    console.log('🔧 renderQuiz()');
    const container = document.getElementById('tab-quiz');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-question-circle"></i> Quiz Paleontológico</h4>
            <div id="quiz-area"></div>
        </div>
    `;
    const area = document.getElementById('quiz-area');

    // Seletor de modo
    area.innerHTML = `
        <div class="mb-3">
            <label>Escolha o modo:</label>
            <select id="modo-quiz" class="form-select">
                <option value="normal">Quiz Normal</option>
                <option value="batalha">⚔️ Batalha (Compare dois dinossauros)</option>
            </select>
        </div>
        <div id="quiz-conteudo"></div>
    `;

    // Evento para alternar modos
    document.getElementById('modo-quiz').addEventListener('change', function() {
        const modo = this.value;
        const conteudo = document.getElementById('quiz-conteudo');
        if (modo === 'normal') {
            conteudo.innerHTML = `
                <div class="mb-3">
                    <label>Nível:</label>
                    <select id="nivel-quiz" class="form-select">
                        <option value="Fácil">Fácil</option>
                        <option value="Médio">Médio</option>
                        <option value="Difícil">Difícil</option>
                    </select>
                    <button class="btn-paleo mt-2" onclick="iniciarQuiz()"><i class="bi bi-play-btn"></i> Iniciar Quiz</button>
                </div>
                <div id="quiz-perguntas"></div>
                <div id="quiz-resultado"></div>
            `;
        } else {
            // Modo Batalha
            const nomes = DINOSSAUROS_REAIS.map(d => d.Nome);
            const options = nomes.map(n => `<option value="${n}">${n}</option>`).join('');
            conteudo.innerHTML = `
                <div class="row g-3">
                    <div class="col-md-5">
                        <label class="form-label">Escolha o primeiro dinossauro:</label>
                        <select id="batalha-dino1" class="form-select">${options}</select>
                    </div>
                    <div class="col-md-5">
                        <label class="form-label">Escolha o segundo dinossauro:</label>
                        <select id="batalha-dino2" class="form-select">${options}</select>
                    </div>
                    <div class="col-md-2 d-flex align-items-end">
                        <button class="btn-paleo w-100" onclick="iniciarBatalha()"><i class="bi bi-sword"></i> Batalhar!</button>
                    </div>
                </div>
                <div id="batalha-perguntas" class="mt-3"></div>
            `;
        }
    });

    // Inicializa no modo normal (dispara o evento)
    document.getElementById('modo-quiz').dispatchEvent(new Event('change'));

    state.initialized.quiz = true;
}

window.iniciarQuiz = function() {
    try {
        const nivel = document.getElementById('nivel-quiz').value;
        const perguntas = QUIZ[nivel] || [];
        if (perguntas.length === 0) {
            alert('Nenhuma pergunta disponível para este nível.');
            return;
        }
        quizEstado = { nivel, indice: 0, pontuacao: 0, perguntas, respostas: [], concluido: false };
        mostrarPerguntaQuiz();
    } catch (e) {
        console.error('Erro ao iniciar quiz:', e);
        alert('Erro ao iniciar o quiz.');
    }
};

function mostrarPerguntaQuiz() {
    try {
        const area = document.getElementById('quiz-perguntas');
        const idx = quizEstado.indice;
        const total = quizEstado.perguntas.length;
        if (idx >= total) {
            quizEstado.concluido = true;
            mostrarResultadoQuiz();
            return;
        }
        const p = quizEstado.perguntas[idx];
        area.innerHTML = `
            <div class="card-paleo" style="border-left:4px solid var(--secondary);">
                <h6>Pergunta ${idx+1} de ${total} (${quizEstado.nivel})</h6>
                <p><strong>${p.pergunta}</strong></p>
                ${p.opcoes.map((op, i) => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="quiz-opcao" value="${i}" id="opcao${i}">
                        <label class="form-check-label" for="opcao${i}">${op}</label>
                    </div>
                `).join('')}
                <button class="btn-paleo mt-2" onclick="responderQuiz()"><i class="bi bi-check-circle"></i> Responder</button>
            </div>
        `;
    } catch (e) {
        console.error('Erro ao mostrar pergunta:', e);
    }
}

window.responderQuiz = function() {
    try {
        const selected = document.querySelector('input[name="quiz-opcao"]:checked');
        if (!selected) {
            alert('Selecione uma alternativa.');
            return;
        }
        const resposta = parseInt(selected.value);
        const idx = quizEstado.indice;
        const p = quizEstado.perguntas[idx];
        if (resposta === p.resposta) {
            quizEstado.pontuacao++;
        }
        quizEstado.respostas[idx] = resposta;
        quizEstado.indice++;
        mostrarPerguntaQuiz();
    } catch (e) {
        console.error('Erro ao responder:', e);
    }
};

function mostrarResultadoQuiz() {
    const area = document.getElementById('quiz-perguntas');
    const total = quizEstado.perguntas.length;
    const pontuacao = quizEstado.pontuacao;
    const respostas = quizEstado.respostas || [];

    let html = `
        <div class="alert alert-success">
            <h5>🏁 Quiz concluído!</h5>
            <p><strong>Pontuação:</strong> ${pontuacao}/${total}</p>
            <p><strong>Nível:</strong> ${quizEstado.nivel}</p>
        </div>
        <hr>
        <h6>📋 Revisão das perguntas:</h6>
        <div style="max-height:400px; overflow-y:auto; padding-right:8px;">
    `;

    quizEstado.perguntas.forEach((p, idx) => {
        const respostaUsuario = respostas[idx] !== undefined ? respostas[idx] : -1;
        const correta = p.resposta;
        const acertou = respostaUsuario === correta;
        const textoResposta = respostaUsuario !== -1 ? p.opcoes[respostaUsuario] : 'Não respondida';
        const textoCorreto = p.opcoes[correta];

        html += `
            <div style="border-left: 4px solid ${acertou ? '#28a745' : '#dc3545'}; padding: 10px 15px; margin-bottom: 12px; background: #f8f9fa; border-radius: 8px;">
                <p style="font-weight:600; margin:0 0 4px 0;">${idx+1}. ${p.pergunta}</p>
                <p style="margin:2px 0;">
                    <span style="color: ${acertou ? '#28a745' : '#dc3545'};">
                        <i class="bi ${acertou ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
                        Sua resposta: ${textoResposta}
                    </span>
                </p>
                <p style="margin:2px 0; color: #28a745;">
                    <i class="bi bi-check-circle-fill"></i> Resposta correta: ${textoCorreto}
                </p>
                ${p.explicacao ? `<p style="margin:4px 0 0 0; font-size:0.9rem; color:#495057;"><i class="bi bi-info-circle"></i> ${p.explicacao}</p>` : ''}
            </div>
        `;
    });

    html += `</div>`;

    area.innerHTML = html;

    // Desbloqueia conquistas se aplicável
    if (quizEstado.nivel === 'Fácil' && pontuacao === total) desbloquearConquista('quiz_facil');
    if (quizEstado.nivel === 'Médio' && pontuacao === total) desbloquearConquista('quiz_medio');
    if (quizEstado.nivel === 'Difícil' && pontuacao === total) desbloquearConquista('quiz_dificil');
}

// ============================================================
// 8. LINHA DO TEMPO
// ============================================================
function renderLinhaTempo() {
    if (state.initialized.tempo) return;
    console.log('🔧 renderLinhaTempo()');
    const container = document.getElementById('tab-tempo');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-clock-history"></i> Linha do Tempo Geológica</h4>
            <div class="mb-3">
                <label>Selecione uma idade (Ma):</label>
                <input type="range" id="slider-tempo" class="form-range" min="66" max="252" value="150">
                <span id="tempo-val" class="badge bg-primary">150 Ma</span>
            </div>
            <div id="tempo-info"></div>
            <canvas id="grafico-tempo" width="600" height="100"></canvas>
        </div>
    `;
    document.getElementById('slider-tempo').addEventListener('input', function() {
        document.getElementById('tempo-val').textContent = this.value + ' Ma';
        atualizarLinhaTempo(parseInt(this.value));
    });
    atualizarLinhaTempo(150);
    state.initialized.tempo = true;
}

function atualizarLinhaTempo(idade) {
    try {
        if (!verificarBiblioteca('Chart.js', Chart, 'tab-tempo')) {
            return;
        }
        const info = document.getElementById('tempo-info');
        let periodo = PERIODOS.find(p => p.inicio >= idade && p.fim <= idade);
        if (!periodo) {
            info.innerHTML = '<p>Período não encontrado.</p>';
            return;
        }
        info.innerHTML = `
            <h5>${periodo.nome} (${periodo.inicio} - ${periodo.fim} Ma)</h5>
            <p>Eventos: ${periodo.eventos.join(', ')}</p>
        `;

        const ctx = document.getElementById('grafico-tempo').getContext('2d');
        if (window.tempoChart) window.tempoChart.destroy();
        window.tempoChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: PERIODOS.map(p => p.nome),
                datasets: [{
                    label: 'Duração (Ma)',
                    data: PERIODOS.map(p => p.inicio - p.fim),
                    backgroundColor: PERIODOS.map(p => p.cor)
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { display: false } }
            }
        });
    } catch (e) {
        console.error('Erro na linha do tempo:', e);
        document.getElementById('tempo-info').innerHTML = `<div class="alert alert-danger">Erro ao carregar gráfico.</div>`;
    }
}

// ============================================================
// 9. CLIMA MESOZÓICO
// ============================================================
function renderClima() {
    if (state.initialized.clima) return;
    console.log('🔧 renderClima()');
    const container = document.getElementById('tab-clima');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-cloud-sun"></i> Simulação Climática do Mesozóico</h4>
            <div class="row g-3">
                <div class="col-md-4">
                    <select id="periodo-clima" class="form-select">
                        <option value="Triássico (252-201 Ma)">Triássico</option>
                        <option value="Jurássico (201-145 Ma)" selected>Jurássico</option>
                        <option value="Cretáceo (145-66 Ma)">Cretáceo</option>
                    </select>
                    <button class="btn-paleo mt-2" onclick="atualizarClima()"><i class="bi bi-arrow-repeat"></i> Atualizar</button>
                </div>
                <div class="col-md-8">
                    <div id="clima-info" class="mt-2"></div>
                </div>
            </div>
        </div>
    `;
    setTimeout(atualizarClima, 100);
    state.initialized.clima = true;
}

window.atualizarClima = function() {
    try {
        const periodo = document.getElementById('periodo-clima').value;
        const dados = DADOS_CLIMA[periodo];
        if (!dados) return;
        const div = document.getElementById('clima-info');
        div.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3"><strong>Temperatura:</strong> ${dados.temperatura} °C</div>
                <div class="col-md-3"><strong>CO₂:</strong> ${dados.co2} ppm</div>
                <div class="col-md-3"><strong>Vegetação:</strong> ${dados.vegetacao}</div>
                <div class="col-md-3"><strong>Nível do mar:</strong> ${dados.nivelMar}</div>
            </div>
            <p>${dados.descricao}</p>
        `;

        // Lógica para desbloquear conquista "climaturista"
        const nomePeriodo = periodo.split(' ')[0];
        let periodosVisitados = JSON.parse(localStorage.getItem('periodos_visitados')) || [];
        if (!periodosVisitados.includes(nomePeriodo)) {
            periodosVisitados.push(nomePeriodo);
            localStorage.setItem('periodos_visitados', JSON.stringify(periodosVisitados));
        }
        const todosPeriodos = ['Triássico', 'Jurássico', 'Cretáceo'];
        const visitouTodos = todosPeriodos.every(p => periodosVisitados.includes(p));
        if (visitouTodos) {
            desbloquearConquista('climaturista');
        }
    } catch (e) {
        console.error('Erro no clima:', e);
        document.getElementById('clima-info').innerHTML = `<div class="alert alert-danger">Erro ao carregar dados climáticos.</div>`;
    }
};

// ============================================================
// 10. CONQUISTAS
// ============================================================
function renderConquistas() {
    if (state.initialized.conquistas) return;
    console.log('🔧 renderConquistas()');
    const container = document.getElementById('tab-conquistas');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-trophy"></i> Suas Conquistas</h4>
            <div id="lista-conquistas"></div>
            <div class="progress mt-3">
                <div id="progresso-conquistas" class="progress-bar bg-success" role="progressbar" style="width:0%">0%</div>
            </div>
        </div>
    `;
    atualizarConquistas();
    state.initialized.conquistas = true;
}

function desbloquearConquista(id) {
    try {
        let conquistas = JSON.parse(localStorage.getItem('conquistas')) || {};
        if (!conquistas[id]) {
            conquistas[id] = true;
            localStorage.setItem('conquistas', JSON.stringify(conquistas));
            alert(`🏅 Conquista desbloqueada: ${id.replace('_', ' ').toUpperCase()}`);
            atualizarConquistas();
            atualizarBadgeConquistas();
        }
    } catch (e) {
        console.error('Erro ao desbloquear conquista:', e);
    }
}

function atualizarConquistas() {
    try {
        const conquistas = JSON.parse(localStorage.getItem('conquistas')) || {};
        const lista = document.getElementById('lista-conquistas');
        const nomes = ['quiz_facil', 'quiz_medio', 'quiz_dificil', 'explorador_escala', 'detetive_icno', 'climaturista', 'batalha_mestre'];
        lista.innerHTML = nomes.map(n => `
            <div class="conquista-item ${conquistas[n] ? '' : 'conquista-bloqueada'}">
                <i class="bi ${conquistas[n] ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}"></i>
                ${n.replace('_', ' ').toUpperCase()}
            </div>
        `).join('');
        const total = nomes.length;
        const obtidas = nomes.filter(n => conquistas[n]).length;
        const barra = document.getElementById('progresso-conquistas');
        const pct = Math.round(obtidas/total*100);
        barra.style.width = pct+'%';
        barra.textContent = `${obtidas}/${total}`;
        atualizarBadgeConquistas();
    } catch (e) {
        console.error('Erro ao atualizar conquistas:', e);
    }
}

function atualizarBadgeConquistas() {
    try {
        const conquistas = JSON.parse(localStorage.getItem('conquistas')) || {};
        const count = Object.values(conquistas).filter(v => v).length;
        document.getElementById('conquista-count').textContent = count;
    } catch (e) {
        console.error('Erro ao atualizar badge:', e);
    }
}

// ============================================================
// 11. EXPORTAR PDF
// ============================================================
function renderExportPDF() {
    if (state.initialized.pdf) return;
    console.log('🔧 renderExportPDF()');
    const container = document.getElementById('tab-pdf');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-file-pdf"></i> Exportar Relatório Científico (PDF)</h4>
            <button class="btn-paleo" onclick="gerarPDF()"><i class="bi bi-download"></i> Gerar PDF</button>
            <div id="pdf-status" class="mt-3"></div>
        </div>
    `;
    state.initialized.pdf = true;
}

window.gerarPDF = function() {
    if (!verificarBiblioteca('jsPDF', window.jspdf, 'tab-pdf')) {
        return;
    }
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const margin = 20;
        let y = 20;

        // ========================
        // 1. CABEÇALHO
        // ========================
        doc.setFontSize(18);
        doc.text('PaleoLab Científico - Relatório', margin, y);
        y += 8;
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleString()}`, margin, y);
        y += 10;

        // ========================
        // 2. CONQUISTAS
        // ========================
        const conquistas = JSON.parse(localStorage.getItem('conquistas')) || {};
        const lista = Object.entries(conquistas).filter(([k, v]) => v).map(([k]) => k.replace('_', ' ').toUpperCase());
        doc.setFontSize(14);
        doc.text('🏆 Conquistas desbloqueadas', margin, y);
        y += 6;
        doc.setFontSize(11);
        if (lista.length > 0) {
            lista.forEach((item, i) => {
                doc.text(`- ${item}`, margin + 5, y + i * 5);
            });
            y += lista.length * 5 + 4;
        } else {
            doc.text('Nenhuma conquista ainda.', margin + 5, y);
            y += 8;
        }

        // ========================
        // 3. QUIZ (se disponível)
        // ========================
        if (quizEstado && quizEstado.concluido && quizEstado.perguntas.length > 0) {
            doc.addPage();
            y = 20;
            doc.setFontSize(16);
            doc.text('📝 Quiz - Resultados', margin, y);
            y += 8;
            doc.setFontSize(12);
            doc.text(`Nível: ${quizEstado.nivel}  |  Pontuação: ${quizEstado.pontuacao}/${quizEstado.perguntas.length}`, margin, y);
            y += 6;

            doc.setFontSize(11);
            quizEstado.perguntas.forEach((p, idx) => {
                const respostaUsuario = quizEstado.respostas[idx] !== undefined ? quizEstado.respostas[idx] : -1;
                const correta = p.resposta;
                const acertou = respostaUsuario === correta;
                const textoResposta = respostaUsuario !== -1 ? p.opcoes[respostaUsuario] : 'Não respondida';
                const textoCorreto = p.opcoes[correta];

                // Quebra de página se necessário
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFontSize(10);
                doc.setTextColor(acertou ? 40 : 200, acertou ? 167 : 69, acertou ? 69 : 64);
                doc.text(`${idx+1}. ${p.pergunta}`, margin, y);
                y += 4;
                doc.setTextColor(50, 50, 50);
                doc.text(`   Sua resposta: ${textoResposta}`, margin + 2, y);
                y += 4;
                doc.setTextColor(40, 167, 69);
                doc.text(`   Correta: ${textoCorreto}`, margin + 2, y);
                y += 4;
                if (p.explicacao) {
                    doc.setTextColor(80, 80, 80);
                    doc.text(`   ℹ️ ${p.explicacao}`, margin + 2, y);
                    y += 4;
                }
                y += 3;
            });
        }

        // ========================
        // 4. GRÁFICO K-Pg (se disponível)
        // ========================
        const canvasExtincao = document.getElementById('grafico-extincao');
        if (canvasExtincao && typeof canvasExtincao.toDataURL === 'function') {
            try {
                const imgData = canvasExtincao.toDataURL('image/png');
                doc.addPage();
                y = 20;
                doc.setFontSize(16);
                doc.text('🌍 Simulação K‑Pg - Gráfico', margin, y);
                y += 8;
                doc.setFontSize(11);
                doc.text('Evolução das populações após o impacto do asteroide.', margin, y);
                y += 6;

                // Adiciona a imagem (largura ~170mm, altura proporcional)
                const imgWidth = 170;
                const imgHeight = (canvasExtincao.height / canvasExtincao.width) * imgWidth;
                doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
                // y += imgHeight + 6;
            } catch (e) {
                console.warn('Erro ao capturar gráfico K-Pg:', e);
            }
        }

        // ========================
        // 5. COMPARAÇÃO DE ESCALA (se disponível)
        // ========================
        const imgEscala = document.querySelector('#imagem-comparacao img');
        if (imgEscala && imgEscala.src && imgEscala.src.startsWith('data:image')) {
            try {
                doc.addPage();
                y = 20;
                doc.setFontSize(16);
                doc.text('📏 Comparação de Escala', margin, y);
                y += 8;

                // Captura a imagem da escala
                const imgData = imgEscala.src;
                // Calcula dimensões para caber na página (largura ~170mm)
                const imgWidth = 170;
                const imgHeight = (imgEscala.naturalHeight || 300) / (imgEscala.naturalWidth || 400) * imgWidth;
                doc.addImage(imgData, 'PNG', margin, y, imgWidth, imgHeight);
                // y += imgHeight + 6;
            } catch (e) {
                console.warn('Erro ao capturar imagem da escala:', e);
            }
        }

        // ========================
        // SALVAR PDF
        // ========================
        doc.save('relatorio_paleolab_completo.pdf');
        document.getElementById('pdf-status').innerHTML = `<div class="alert alert-success">✅ PDF completo gerado com sucesso!</div>`;

    } catch (e) {
        console.error('Erro ao gerar PDF:', e);
        document.getElementById('pdf-status').innerHTML = `<div class="alert alert-danger">Erro ao gerar PDF: ${e.message}</div>`;
    }
};

// ============================================================
// 12. ÁRVORE EVOLUTIVA – CORRIGIDA E FUNCIONAL
// ============================================================
function renderArvoreEvolutiva() {
    if (state.initialized.arvore) return;
    console.log('🔧 renderArvoreEvolutiva()');
    const container = document.getElementById('tab-arvore');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-diagram-3"></i> Árvore Evolutiva Interativa</h4>
            <div id="arvore-evolutiva"></div>
            <p class="mt-2 text-muted" style="font-size:0.9rem;">Relações filogenéticas entre os principais grupos de répteis.</p>
        </div>
    `;

    if (!verificarBiblioteca('vis.js', vis, 'tab-arvore')) {
        return;
    }

    try {
        const nodes = new vis.DataSet([
            {id: 'Reptilia', label: 'Reptilia', color: '#2c3e50'},
            {id: 'Archosauria', label: 'Archosauria', color: '#34495e'},
            {id: 'Dinosauria', label: 'Dinosauria', color: '#16a085'},
            {id: 'Pterosauria', label: 'Pterosauria', color: '#2980b9'},
            {id: 'Saurischia', label: 'Saurischia', color: '#27ae60'},
            {id: 'Ornithischia', label: 'Ornithischia', color: '#e67e22'},
            {id: 'Theropoda', label: 'Theropoda', color: '#c0392b'},
            {id: 'Sauropodomorpha', label: 'Sauropodomorpha', color: '#8e44ad'},
            {id: 'Tyrannosauridae', label: 'Tyrannosauridae', color: '#e74c3c'},
            {id: 'Dromaeosauridae', label: 'Dromaeosauridae', color: '#f39c12'},
            {id: 'Spinosauridae', label: 'Spinosauridae', color: '#d35400'},
            {id: 'Brachiosauridae', label: 'Brachiosauridae', color: '#2ecc71'},
            {id: 'Diplodocidae', label: 'Diplodocidae', color: '#1abc9c'},
            {id: 'Ceratopsia', label: 'Ceratopsia', color: '#3498db'},
            {id: 'Ornithopoda', label: 'Ornithopoda', color: '#9b59b6'},
            {id: 'Stegosauria', label: 'Stegosauria', color: '#f1c40f'},
            {id: 'Ankylosauria', label: 'Ankylosauria', color: '#e67e22'},
            {id: 'Sauropterygia', label: 'Sauropterygia', color: '#1abc9c'},
            {id: 'Plesiosauria', label: 'Plesiosauria', color: '#16a085'},
            {id: 'Ichthyosauria', label: 'Ichthyosauria', color: '#2980b9'}
        ]);
        const edges = new vis.DataSet(ARVORE_ARESTAS.map(([from, to]) => ({from, to})));
        const containerDiv = document.getElementById('arvore-evolutiva');
        const data = {nodes, edges};
        const options = {
            layout: {
                hierarchical: {
                    direction: 'LR',
                    sortMethod: 'directed',
                    nodeSpacing: 120,
                    levelSeparation: 80
                }
            },
            physics: { enabled: false },
            edges: { arrows: 'to', smooth: true },
            nodes: {
                shape: 'box',
                margin: 10,
                font: { size: 14, color: '#2c3e50' },
                borderWidth: 2,
                shadow: true
            }
        };
        new vis.Network(containerDiv, data, options);
    } catch (e) {
        console.error('Erro na árvore evolutiva:', e);
        document.getElementById('arvore-evolutiva').innerHTML = `
            <div class="alert alert-danger">Erro ao carregar a árvore: ${e.message}</div>
        `;
    }
    state.initialized.arvore = true;
}

// ============================================================
// 13. MODO BATALHA – QUIZ COMPARATIVO
// ============================================================

// Estado da batalha
const batalhaEstado = {
    ativo: false,
    perguntas: [],
    indice: 0,
    respostas: [],
    pontuacao: 0,
    dino1: null,
    dino2: null,
    concluido: false
};

// Função para gerar perguntas comparativas entre dois dinossauros
function gerarPerguntasBatalha(dino1, dino2, quantidade = 5) {
    const perguntas = [];
    const atributos = [
        { chave: 'Peso', label: 'peso (toneladas)', comparar: (a, b) => a > b ? 1 : (a < b ? -1 : 0) },
        { chave: 'Comprimento', label: 'comprimento (metros)', comparar: (a, b) => a > b ? 1 : (a < b ? -1 : 0) },
        { chave: 'Altura', label: 'altura (metros)', comparar: (a, b) => a > b ? 1 : (a < b ? -1 : 0) }
    ];

    // Mapeamento de período para ordem numérica (Triássico < Jurássico < Cretáceo)
    const ordemPeriodo = { 'Triássico': 1, 'Jurássico': 2, 'Cretáceo': 3 };
    function extrairPeriodo(nomePeriodo) {
        for (let p in ordemPeriodo) {
            if (nomePeriodo.includes(p)) return p;
        }
        return null;
    }

    // Conjunto de atributos já usados para evitar repetição (se possível)
    const usados = new Set();

    for (let i = 0; i < quantidade; i++) {
        // Escolhe um atributo aleatório não repetido (se houver)
        let atributoEscolhido = null;
        const disponiveis = atributos.filter(a => !usados.has(a.chave));
        if (disponiveis.length === 0) {
            // Se já usou todos, reinicia o conjunto
            usados.clear();
            atributoEscolhido = atributos[Math.floor(Math.random() * atributos.length)];
        } else {
            atributoEscolhido = disponiveis[Math.floor(Math.random() * disponiveis.length)];
        }
        usados.add(atributoEscolhido.chave);

        // Pode ser também pergunta sobre período (compara idade)
        const tipoPergunta = Math.random() < 0.2 ? 'periodo' : 'atributo'; // 20% de chance para período

        let perguntaObj = null;

        if (tipoPergunta === 'periodo') {
            // Pergunta sobre qual viveu primeiro (mais antigo)
            const p1 = extrairPeriodo(dino1.Periodo);
            const p2 = extrairPeriodo(dino2.Periodo);
            if (p1 && p2 && p1 !== p2) {
                const maisAntigo = ordemPeriodo[p1] < ordemPeriodo[p2] ? dino1 : dino2;
                const maisNovo = maisAntigo === dino1 ? dino2 : dino1;
                // Adiciona dois distratores aleatórios
                const distratores = obterDistratores(dino1.Nome, dino2.Nome, 2);
                const opcoes = embaralhar([maisAntigo.Nome, maisNovo.Nome, ...distratores]);
                const resposta = opcoes.indexOf(maisAntigo.Nome);
                perguntaObj = {
                    pergunta: `Qual dos dinossauros viveu no período mais antigo?`,
                    opcoes: opcoes,
                    resposta: resposta,
                    explicacao: `${maisAntigo.Nome} viveu no ${maisAntigo.Periodo}, enquanto ${maisNovo.Nome} viveu no ${maisNovo.Periodo}.`
                };
            } else {
                // Se não for possível comparar período, cai no atributo
                tipoPergunta = 'atributo';
            }
        }

        if (!perguntaObj) {
            // Pergunta sobre atributo numérico
            const chave = atributoEscolhido.chave;
            const val1 = dino1[chave];
            const val2 = dino2[chave];
            if (val1 === undefined || val2 === undefined || val1 === val2) {
                // Se algum valor não existe ou são iguais, tenta outro atributo
                i--; // tenta novamente
                continue;
            }
            const maior = val1 > val2 ? dino1 : dino2;
            const menor = maior === dino1 ? dino2 : dino1;
            const label = atributoEscolhido.label;

            // Distratores
            const distratores = obterDistratores(dino1.Nome, dino2.Nome, 2);
            const opcoes = embaralhar([maior.Nome, menor.Nome, ...distratores]);
            const resposta = opcoes.indexOf(maior.Nome);

            perguntaObj = {
                pergunta: `Qual dos dinossauros tem maior ${label}?`,
                opcoes: opcoes,
                resposta: resposta,
                explicacao: `${maior.Nome} tem ${chave} = ${maior[chave]} ${chave === 'Peso' ? 'ton' : 'm'}, enquanto ${menor.Nome} tem ${chave} = ${menor[chave]} ${chave === 'Peso' ? 'ton' : 'm'}.`
            };
        }

        if (perguntaObj) {
            perguntas.push(perguntaObj);
        } else {
            i--; // tenta novamente se falhou
        }
    }

    // Garante que temos exatamente 'quantidade' perguntas (pode ter menos se houver muitos empates)
    while (perguntas.length < quantidade) {
        // Adiciona uma pergunta genérica sobre comprimento (fallback)
        const val1 = dino1.Comprimento || 0;
        const val2 = dino2.Comprimento || 0;
        if (val1 !== val2) {
            const maior = val1 > val2 ? dino1 : dino2;
            const menor = maior === dino1 ? dino2 : dino1;
            const distratores = obterDistratores(dino1.Nome, dino2.Nome, 2);
            const opcoes = embaralhar([maior.Nome, menor.Nome, ...distratores]);
            const resposta = opcoes.indexOf(maior.Nome);
            perguntas.push({
                pergunta: `Qual dos dinossauros é mais comprido?`,
                opcoes: opcoes,
                resposta: resposta,
                explicacao: `${maior.Nome} tem ${maior.Comprimento} m, ${menor.Nome} tem ${menor.Comprimento} m.`
            });
        } else {
            // Se ainda houver empate, usa peso
            const val1p = dino1.Peso || 0;
            const val2p = dino2.Peso || 0;
            if (val1p !== val2p) {
                const maior = val1p > val2p ? dino1 : dino2;
                const menor = maior === dino1 ? dino2 : dino1;
                const distratores = obterDistratores(dino1.Nome, dino2.Nome, 2);
                const opcoes = embaralhar([maior.Nome, menor.Nome, ...distratores]);
                const resposta = opcoes.indexOf(maior.Nome);
                perguntas.push({
                    pergunta: `Qual dos dinossauros é mais pesado?`,
                    opcoes: opcoes,
                    resposta: resposta,
                    explicacao: `${maior.Nome} pesa ${maior.Peso} ton, ${menor.Nome} pesa ${menor.Peso} ton.`
                });
            } else {
                // Último recurso: compara período
                const p1 = extrairPeriodo(dino1.Periodo);
                const p2 = extrairPeriodo(dino2.Periodo);
                if (p1 && p2 && p1 !== p2) {
                    const maisAntigo = ordemPeriodo[p1] < ordemPeriodo[p2] ? dino1 : dino2;
                    const maisNovo = maisAntigo === dino1 ? dino2 : dino1;
                    const distratores = obterDistratores(dino1.Nome, dino2.Nome, 2);
                    const opcoes = embaralhar([maisAntigo.Nome, maisNovo.Nome, ...distratores]);
                    const resposta = opcoes.indexOf(maisAntigo.Nome);
                    perguntas.push({
                        pergunta: `Qual dos dinossauros viveu no período mais antigo?`,
                        opcoes: opcoes,
                        resposta: resposta,
                        explicacao: `${maisAntigo.Nome} viveu no ${maisAntigo.Periodo}, ${maisNovo.Nome} no ${maisNovo.Periodo}.`
                    });
                } else {
                    // Se tudo falhar, adiciona uma pergunta fixa (não deve acontecer)
                    perguntas.push({
                        pergunta: `Qual dinossauro você acha que é mais impressionante? (Escolha um)`,
                        opcoes: [dino1.Nome, dino2.Nome],
                        resposta: 0, // não importa
                        explicacao: 'Esta é uma pergunta subjetiva.'
                    });
                }
            }
        }
    }

    return perguntas.slice(0, quantidade);
}

// Função auxiliar: obter distratores aleatórios
function obterDistratores(nome1, nome2, quantidade) {
    const todos = DINOSSAUROS_REAIS.map(d => d.Nome);
    const filtrados = todos.filter(n => n !== nome1 && n !== nome2);
    const embaralhados = filtrados.sort(() => Math.random() - 0.5);
    return embaralhados.slice(0, quantidade);
}

// Função auxiliar: embaralhar array
function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para iniciar a batalha
window.iniciarBatalha = function() {
    const dino1Nome = document.getElementById('batalha-dino1').value;
    const dino2Nome = document.getElementById('batalha-dino2').value;
    if (dino1Nome === dino2Nome) {
        alert('Escolha dois dinossauros diferentes!');
        return;
    }
    const dino1 = DINOSSAUROS_REAIS.find(d => d.Nome === dino1Nome);
    const dino2 = DINOSSAUROS_REAIS.find(d => d.Nome === dino2Nome);
    if (!dino1 || !dino2) {
        alert('Dinossauro não encontrado.');
        return;
    }

    batalhaEstado.ativo = true;
    batalhaEstado.dino1 = dino1;
    batalhaEstado.dino2 = dino2;
    batalhaEstado.perguntas = gerarPerguntasBatalha(dino1, dino2, 5);
    batalhaEstado.indice = 0;
    batalhaEstado.respostas = [];
    batalhaEstado.pontuacao = 0;
    batalhaEstado.concluido = false;

    mostrarPerguntaBatalha();
};

function mostrarPerguntaBatalha() {
    const area = document.getElementById('batalha-perguntas');
    if (!area) return;
    const idx = batalhaEstado.indice;
    const total = batalhaEstado.perguntas.length;

    if (idx >= total) {
        batalhaEstado.concluido = true;
        mostrarResultadoBatalha();
        return;
    }

    const p = batalhaEstado.perguntas[idx];
    area.innerHTML = `
        <div class="card-paleo" style="border-left:4px solid var(--secondary);">
            <h6>Pergunta ${idx+1} de ${total}</h6>
            <p><strong>${p.pergunta}</strong></p>
            ${p.opcoes.map((op, i) => `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="batalha-opcao" value="${i}" id="bopcao${i}">
                    <label class="form-check-label" for="bopcao${i}">${op}</label>
                </div>
            `).join('')}
            <button class="btn-paleo mt-2" onclick="responderBatalha()"><i class="bi bi-check-circle"></i> Responder</button>
        </div>
    `;
}

window.responderBatalha = function() {
    const selected = document.querySelector('input[name="batalha-opcao"]:checked');
    if (!selected) {
        alert('Selecione uma alternativa.');
        return;
    }
    const resposta = parseInt(selected.value);
    const idx = batalhaEstado.indice;
    const p = batalhaEstado.perguntas[idx];
    if (resposta === p.resposta) {
        batalhaEstado.pontuacao++;
    }
    batalhaEstado.respostas[idx] = resposta;
    batalhaEstado.indice++;
    mostrarPerguntaBatalha();
};

function mostrarResultadoBatalha() {
    const area = document.getElementById('batalha-perguntas');
    const total = batalhaEstado.perguntas.length;
    const pontuacao = batalhaEstado.pontuacao;
    const respostas = batalhaEstado.respostas || [];

    let html = `
        <div class="alert alert-success">
            <h5>🏁 Batalha concluída!</h5>
            <p><strong>Pontuação:</strong> ${pontuacao}/${total}</p>
            <p><strong>Duelo:</strong> ${batalhaEstado.dino1.Nome} vs ${batalhaEstado.dino2.Nome}</p>
        </div>
        <hr>
        <h6>📋 Revisão das perguntas:</h6>
        <div style="max-height:400px; overflow-y:auto; padding-right:8px;">
    `;

    batalhaEstado.perguntas.forEach((p, idx) => {
        const respostaUsuario = respostas[idx] !== undefined ? respostas[idx] : -1;
        const correta = p.resposta;
        const acertou = respostaUsuario === correta;
        const textoResposta = respostaUsuario !== -1 ? p.opcoes[respostaUsuario] : 'Não respondida';
        const textoCorreto = p.opcoes[correta];

        html += `
            <div style="border-left: 4px solid ${acertou ? '#28a745' : '#dc3545'}; padding: 10px 15px; margin-bottom: 12px; background: #f8f9fa; border-radius: 8px;">
                <p style="font-weight:600; margin:0 0 4px 0;">${idx+1}. ${p.pergunta}</p>
                <p style="margin:2px 0;">
                    <span style="color: ${acertou ? '#28a745' : '#dc3545'};">
                        <i class="bi ${acertou ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i>
                        Sua resposta: ${textoResposta}
                    </span>
                </p>
                <p style="margin:2px 0; color: #28a745;">
                    <i class="bi bi-check-circle-fill"></i> Resposta correta: ${textoCorreto}
                </p>
                ${p.explicacao ? `<p style="margin:4px 0 0 0; font-size:0.9rem; color:#495057;"><i class="bi bi-info-circle"></i> ${p.explicacao}</p>` : ''}
            </div>
        `;
    });

    html += `</div>`;
    area.innerHTML = html;

    // Conquista especial para quem acertar todas
    if (pontuacao === total) {
        desbloquearConquista('batalha_mestre');
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded – inicializando PaleoLab (UI renovada)');
    renderizarAbas();
    atualizarBadgeConquistas();
    setTimeout(() => {
        try { atualizarEscala(); } catch(e) { console.error('Erro na escala inicial:', e); }
    }, 800);
});

// ============================================================
// FUNÇÕES PARA O GRÁFICO DE MASSA
// ============================================================

// Calcula a circunferência femoral (mm) a partir da massa (kg) e postura
function calcularCircunferenciaPorMassa(massaKg, postura) {
    const a = postura === 'bipede' ? 0.00016 : 0.00049;
    const b = postura === 'bipede' ? 2.73 : 2.75;
    if (massaKg <= 0) return 0;
    return Math.pow(massaKg / a, 1 / b);
}

// Retorna os dados dos 7 dinossauros clássicos com circunferência estimada
function obterDadosGraficoMassa() {
    return DINOSSAUROS_CLASSICOS.map(dino => {
        const postura = dino.Postura.toLowerCase() === 'bípede' ? 'bipede' : 'quadrupede';
        const massaKg = dino.Peso * 1000; // ton -> kg
        const circMm = calcularCircunferenciaPorMassa(massaKg, postura);
        return {
            nome: dino.Nome,
            massaTon: dino.Peso,
            circMm: circMm,
            postura: postura
        };
    });
}

// Variável global para o gráfico
let chartMassa = null;

// Função para atualizar o gráfico com os dados fixos e o ponto do usuário
function atualizarGraficoMassa(circUsuarioCm, massaUsuarioTon) {
    const canvas = document.getElementById('grafico-massa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Verifica se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        canvas.parentElement.innerHTML += '<p class="text-danger mt-2">Chart.js não disponível.</p>';
        return;
    }

    // Dados dos 7 dinossauros
    const dadosFixos = obterDadosGraficoMassa();

    // Prepara os datasets
    const pontosFixos = dadosFixos.map(d => ({
        x: d.circMm,
        y: d.massaTon
    }));

    const labelsFixos = dadosFixos.map(d => d.nome);

    // Destrói gráfico anterior se existir
    if (chartMassa) {
        chartMassa.destroy();
        chartMassa = null;
    }

    // Conjunto de dados para o gráfico
    const datasets = [
        {
            label: 'Dinossauros clássicos',
            data: pontosFixos,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointLabel: labelsFixos // para usar no tooltip customizado
        }
    ];

    // Se o usuário já calculou, adiciona o ponto destacado
    if (circUsuarioCm > 0 && massaUsuarioTon > 0) {
        const circUsuarioMm = circUsuarioCm * 10;
        datasets.push({
            label: 'Seu dinossauro',
            data: [{ x: circUsuarioMm, y: massaUsuarioTon }],
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointRadius: 10,
            pointHoverRadius: 12,
            pointStyle: 'rectRot'
        });
    }

    chartMassa = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const raw = context.raw;
                            if (context.datasetIndex === 0) {
                                // Para os pontos fixos, mostra o nome do dinossauro
                                const index = context.dataIndex;
                                const nome = labelsFixos[index] || '';
                                return `${nome}: ${raw.y.toFixed(1)} ton, ${raw.x.toFixed(0)} mm`;
                            } else {
                                return `${label}: ${raw.y.toFixed(2)} ton, ${raw.x.toFixed(0)} mm`;
                            }
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Circunferência do Fêmur (mm)'
                    },
                    beginAtZero: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Massa (toneladas)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}