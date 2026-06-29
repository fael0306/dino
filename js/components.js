// js/components.js

console.log('🔄 components.js carregado (versão UI renovada)');

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
// 1. ESCALA REAL
// ============================================================
function renderEscalaReal() {
    console.log('🔧 renderEscalaReal()');
    const container = document.getElementById('tab-escala');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-rulers"></i> Compare a Escala</h4>
            <div class="row g-3 align-items-end">
                <div class="col-md-4">
                    <label class="form-label">Dinossauro</label>
                    <select id="dino-escala" class="form-select">
                        ${DINOSSAUROS_CLASSICOS.map(d => `<option value="${d.Nome}">${d.Nome}</option>`).join('')}
                    </select>
                </div>
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
                <div class="col-12">
                    <button class="btn-paleo" onclick="atualizarEscala()"><i class="bi bi-arrow-repeat"></i> Atualizar</button>
                </div>
            </div>
            <div id="imagem-comparacao" class="mt-3 text-center" style="background:#f8f9fa; padding:1.5rem; border-radius:12px;">
                <p class="text-muted">Selecione um dinossauro e clique em Atualizar.</p>
            </div>
        </div>
    `;

    const outroSelect = document.getElementById('outro-dino-escala');
    const nomes = DINOSSAUROS_CLASSICOS.map(d => d.Nome);
    outroSelect.innerHTML = nomes.map(n => `<option value="${n}">${n}</option>`).join('');

    document.getElementById('ref-escala').addEventListener('change', function() {
        document.getElementById('outro-dino-container').style.display = this.value === 'Outro' ? 'block' : 'none';
    });

    console.log('✅ renderEscalaReal() concluído');
}

// (atualizarEscala permanece inalterado, mas vou manter como referência)
window.atualizarEscala = async function() {
    try {
        const dinoSel = document.getElementById('dino-escala').value;
        const refSel  = document.getElementById('ref-escala').value;
        let refNome, refAltura;

        if (refSel === 'Outro') {
            refNome   = document.getElementById('outro-dino-escala').value;
            refAltura = DINOSSAUROS_CLASSICOS.find(d => d.Nome === refNome).Altura;
        } else if (refSel === 'Humano') {
            refNome = 'Humano'; refAltura = 1.7;
        } else {
            refNome = 'Elefante'; refAltura = 3.3;
        }

        const dino  = DINOSSAUROS_CLASSICOS.find(d => d.Nome === dinoSel);
        const razao = (dino.Altura / refAltura).toFixed(1);

        const alturaMax = 300;
        let alturaDinoPx, alturaRefPx;
        if (dino.Altura >= refAltura) {
            alturaDinoPx = alturaMax;
            alturaRefPx  = Math.round(alturaMax * (refAltura / dino.Altura));
        } else {
            alturaRefPx  = alturaMax;
            alturaDinoPx = Math.round(alturaMax * (dino.Altura / refAltura));
        }

        const imgDino = await carregarImagemOriginal(dinoSel);
        const imgRef  = await carregarImagemOriginal(refNome);

        function imgParaDataUrl(img, altura) {
            const ratio  = altura / img.height;
            const canvas = document.createElement('canvas');
            canvas.width  = Math.round(img.width * ratio);
            canvas.height = altura;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            return canvas.toDataURL('image/png');
        }

        const dataUrlDinoRedim = imgParaDataUrl(imgDino, alturaDinoPx);
        const dataUrlRefRedim  = imgParaDataUrl(imgRef,  alturaRefPx);

        const dataUrlFinal = await combinarLadoALado(dataUrlRefRedim, dataUrlDinoRedim);

        const container = document.getElementById('imagem-comparacao');
        container.innerHTML = `
            <img src="${dataUrlFinal}" style="max-width:100%; display:block; margin:0 auto; border-radius:8px;">
            <p style="text-align:center; margin-top:12px; font-weight:500;">
                <strong>${refNome}</strong> (${refAltura}m) &nbsp;×&nbsp;
                <strong>${dinoSel}</strong> (${dino.Altura}m) —
                proporção <strong>${razao}x</strong>
            </p>
        `;
    } catch (e) {
        console.error('Erro em atualizarEscala:', e);
        document.getElementById('imagem-comparacao').innerHTML = `
            <div class="alert alert-danger">Erro ao carregar a comparação.<br><small>${e.message}</small></div>
        `;
    }
};

// ============================================================
// 2. DERIVA CONTINENTAL
// ============================================================
function renderDerivaContinental() {
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

    document.getElementById('era-globo').addEventListener('change', function() {
        const url = `https://dinosaurpictures.org/ancient-earth?_t=${this.value}#${this.value}`;
        document.getElementById('iframe-globo').src = url;
    });

    if (typeof L === 'undefined') {
        console.warn('⚠️ Leaflet não carregado.');
        document.getElementById('mapa-fosseis').innerHTML = '<p class="text-warning">Biblioteca Leaflet não carregada.</p>';
        return;
    }
    setTimeout(() => {
        try { atualizarMapa(); } catch(e) { console.error('Erro no mapa:', e); }
    }, 500);
}

let mapaLeaflet = null;
window.atualizarMapa = function() {
    try {
        const dino = document.getElementById('dino-mapa')?.value;
        if (!dino) return;
        const coords = COORDENADAS_DINOSSAUROS[dino] || [];
        const container = document.getElementById('mapa-fosseis');
        if (!container) return;

        if (!mapaLeaflet) {
            mapaLeaflet = L.map(container).setView([0, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(mapaLeaflet);
        }
        mapaLeaflet.eachLayer(layer => {
            if (layer instanceof L.Marker) mapaLeaflet.removeLayer(layer);
        });
        if (coords.length > 0) {
            const bounds = [];
            coords.forEach(c => {
                L.marker([c.lat, c.lon]).addTo(mapaLeaflet);
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
                    <canvas id="grafico-extincao" width="400" height="300"></canvas>
                    <div id="status-extincao" class="mt-3"></div>
                </div>
            </div>
        </div>
    `;
    document.getElementById('bloqueio').addEventListener('input', function() {
        document.getElementById('bloqueio-val').textContent = this.value;
    });
    document.getElementById('chuva').addEventListener('input', function() {
        document.getElementById('chuva-val').textContent = this.value;
    });
}

let chartExtincao = null;
window.executarSimulacao = function() {
    try {
        if (typeof Chart === 'undefined') {
            alert('Chart.js não carregado.');
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

        const status = document.getElementById('status-extincao');
        const P_final = dados.P[dados.P.length - 1];
        const H_final = dados.H[dados.H.length - 1];
        if (P_final < 1) {
            status.innerHTML = `<div class="alert alert-danger">🔥 COLAPSO TOTAL: extinção das plantas.</div>`;
        } else if (H_final < 5) {
            status.innerHTML = `<div class="alert alert-warning">⚠️ ECOSSISTEMA DEVASTADO.</div>`;
        } else {
            status.innerHTML = `<div class="alert alert-success">🌿 ECOSSISTEMA ESTÁVEL.</div>`;
        }
    } catch (e) {
        console.error('Erro na simulação:', e);
        document.getElementById('status-extincao').innerHTML = `<div class="alert alert-danger">Erro na simulação.</div>`;
    }
};

// ============================================================
// 4. ICNOFÓSSEIS
// ============================================================
function renderIcnofosseis() {
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
}

let icnoDesafioAtual = null;

window.novoDesafioIcnofosseis = async function() {
    try {
        const nomes = Object.keys(ICNOFOSSEIS);
        icnoDesafioAtual = nomes[Math.floor(Math.random() * nomes.length)];
        const imgDiv = document.getElementById('icno-imagem');

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

        const extra = document.getElementById('icno-perguntas-extra');
        extra.innerHTML = '';
        const dedos = parseInt(document.getElementById('icno-dedos').value);
        const garras = document.getElementById('icno-garras').value === 'true';

        if (dedos === 3) {
            extra.innerHTML += `
                <div class="mb-2">
                    <label>3. Tamanho:</label>
                    <select id="icno-tamanho" class="form-select">
                        <option value="pequeno">Pequeno (<25cm)</option>
                        <option value="grande">Grande (>25cm)</option>
                    </select>
                </div>
            `;
            if (garras) {
                extra.innerHTML += `
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
                extra.innerHTML += `
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
        document.getElementById('icno-resultado').innerHTML = '';
    } catch (e) {
        console.error('Erro no novo desafio:', e);
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
                </div>
            </div>
        </div>
    `;
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
    console.log('🔧 renderQuiz()');
    const container = document.getElementById('tab-quiz');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-question-circle"></i> Quiz Paleontológico</h4>
            <div id="quiz-area"></div>
        </div>
    `;
    const area = document.getElementById('quiz-area');
    area.innerHTML = `
        <div class="mb-3">
            <label>Escolha o nível:</label>
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
    area.innerHTML = `
        <div class="alert alert-success">
            <h5>Quiz concluído!</h5>
            <p>Pontuação: ${pontuacao}/${total}</p>
        </div>
    `;
    if (quizEstado.nivel === 'Fácil' && pontuacao === total) desbloquearConquista('quiz_facil');
    if (quizEstado.nivel === 'Médio' && pontuacao === total) desbloquearConquista('quiz_medio');
    if (quizEstado.nivel === 'Difícil' && pontuacao === total) desbloquearConquista('quiz_dificil');
}

// ============================================================
// 8. LINHA DO TEMPO
// ============================================================
function renderLinhaTempo() {
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
}

function atualizarLinhaTempo(idade) {
    try {
        if (typeof Chart === 'undefined') {
            document.getElementById('tempo-info').innerHTML = '<p class="text-warning">Chart.js não carregado.</p>';
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
    } catch (e) {
        console.error('Erro no clima:', e);
        document.getElementById('clima-info').innerHTML = `<div class="alert alert-danger">Erro ao carregar dados climáticos.</div>`;
    }
};

// ============================================================
// 10. CONQUISTAS
// ============================================================
function renderConquistas() {
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
        const nomes = ['quiz_facil', 'quiz_medio', 'quiz_dificil', 'explorador_escala', 'detetive_icno', 'climaturista'];
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
    console.log('🔧 renderExportPDF()');
    const container = document.getElementById('tab-pdf');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-file-pdf"></i> Exportar Relatório Científico (PDF)</h4>
            <button class="btn-paleo" onclick="gerarPDF()"><i class="bi bi-download"></i> Gerar PDF</button>
            <div id="pdf-status" class="mt-3"></div>
        </div>
    `;
}

window.gerarPDF = function() {
    try {
        if (typeof window.jspdf === 'undefined') {
            alert('jsPDF não carregado.');
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('PaleoLab Científico - Relatório', 20, 20);
        doc.setFontSize(12);
        doc.text(`Data: ${new Date().toLocaleString()}`, 20, 30);
        const conquistas = JSON.parse(localStorage.getItem('conquistas')) || {};
        const lista = Object.entries(conquistas).filter(([k,v]) => v).map(([k]) => k.replace('_', ' ').toUpperCase());
        if (lista.length > 0) {
            doc.text('Conquistas desbloqueadas:', 20, 45);
            lista.forEach((item, i) => {
                doc.text(`- ${item}`, 25, 55 + i*6);
            });
        } else {
            doc.text('Nenhuma conquista ainda.', 20, 45);
        }
        doc.save('relatorio_paleolab.pdf');
        document.getElementById('pdf-status').innerHTML = `<div class="alert alert-success">PDF gerado com sucesso!</div>`;
    } catch (e) {
        console.error('Erro ao gerar PDF:', e);
        document.getElementById('pdf-status').innerHTML = `<div class="alert alert-danger">Erro ao gerar PDF.</div>`;
    }
};

// ============================================================
// 12. ÁRVORE EVOLUTIVA – CORRIGIDA E FUNCIONAL
// ============================================================
function renderArvoreEvolutiva() {
    console.log('🔧 renderArvoreEvolutiva()');
    const container = document.getElementById('tab-arvore');
    container.innerHTML = `
        <div class="card-paleo">
            <h4><i class="bi bi-diagram-3"></i> Árvore Evolutiva Interativa</h4>
            <div id="arvore-evolutiva"></div>
            <p class="mt-2 text-muted" style="font-size:0.9rem;">Relações filogenéticas entre os principais grupos de répteis.</p>
        </div>
    `;
    try {
        if (typeof vis === 'undefined') {
            document.getElementById('arvore-evolutiva').innerHTML = `
                <div class="alert alert-warning">Biblioteca vis.js não carregada. Verifique sua conexão.</div>
            `;
            return;
        }
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