// js/components.js

// ============================================================
// RENDERIZAÇÃO DAS ABAS (com isolamento de erros)
// ============================================================

function renderizarAbas() {
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
            fn();
        } catch (e) {
            console.error(`Erro ao renderizar aba "${id}":`, e);
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-warning">
                        <strong>⚠️ Erro ao carregar esta aba.</strong><br>
                        Detalhe: ${e.message || 'Verifique o console para mais informações.'}
                    </div>
                `;
            }
        }
    });
}

// 1. Escala Real – IMAGEM EMBAIXO
function renderEscalaReal() {
    const container = document.getElementById('escala');
    container.innerHTML = `
        <div class="row">
            <div class="col-md-12">
                <h4>📏 Compare a Escala</h4>
                <div class="row">
                    <div class="col-md-4">
                        <div class="mb-3">
                            <label class="form-label">Escolha um dinossauro:</label>
                            <select id="dino-escala" class="form-select">
                                ${DINOSSAUROS_CLASSICOS.map(d => `<option value="${d.Nome}">${d.Nome}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Comparar com:</label>
                            <select id="ref-escala" class="form-select">
                                <option value="Humano">Humano (1.7m)</option>
                                <option value="Elefante">Elefante (3.3m)</option>
                                <option value="Outro">Outro dinossauro...</option>
                            </select>
                        </div>
                        <div id="outro-dino-container" style="display:none;">
                            <label class="form-label">Selecione o outro dinossauro:</label>
                            <select id="outro-dino-escala" class="form-select"></select>
                        </div>
                        <button class="btn btn-primary" onclick="atualizarEscala()">Atualizar</button>
                    </div>
                    <div class="col-md-8">
                        <div id="resultado-escala" class="mt-2"></div>
                    </div>
                </div>
                <!-- IMAGEM AQUI EMBAIXO -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div id="imagem-comparacao">
                            <p>Selecione um dinossauro e clique em Atualizar.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    const outroSelect = document.getElementById('outro-dino-escala');
    const nomes = DINOSSAUROS_CLASSICOS.map(d => d.Nome);
    outroSelect.innerHTML = nomes.map(n => `<option value="${n}">${n}</option>`).join('');

    document.getElementById('ref-escala').addEventListener('change', function() {
        document.getElementById('outro-dino-container').style.display = this.value === 'Outro' ? 'block' : 'none';
    });
}

// ===== FUNÇÃO CORRIGIDA – IMAGEM EMBAIXO, SEM DISTORÇÃO =====
window.atualizarEscala = async function() {
    try {
        const dinoSel = document.getElementById('dino-escala').value;
        const refSel = document.getElementById('ref-escala').value;
        let refNome, refAltura;

        if (refSel === 'Outro') {
            refNome = document.getElementById('outro-dino-escala').value;
            const dinoRef = DINOSSAUROS_CLASSICOS.find(d => d.Nome === refNome);
            refAltura = dinoRef.Altura;
        } else if (refSel === 'Humano') {
            refNome = 'Humano';
            refAltura = 1.7;
        } else if (refSel === 'Elefante') {
            refNome = 'Elefante';
            refAltura = 3.3;
        }

        const dino = DINOSSAUROS_CLASSICOS.find(d => d.Nome === dinoSel);
        const razao = (dino.Altura / refAltura).toFixed(1);

        // Carregar imagens (tamanho base 200x200)
        const imgDino = await carregarImagemOuPlaceholder(dinoSel, 200, 200);
        const imgRef = await carregarImagemOuPlaceholder(refNome, 200, 200);

        // Definir altura máxima (400px) para a imagem maior
        const alturaMax = 400;
        let alturaDino, alturaRef;
        if (dino.Altura >= refAltura) {
            alturaDino = alturaMax;
            alturaRef = Math.round(alturaMax * (refAltura / dino.Altura));
        } else {
            alturaRef = alturaMax;
            alturaDino = Math.round(alturaMax * (dino.Altura / refAltura));
        }

        // Redimensionar mantendo a proporção
        const imgDinoRedim = await redimensionarParaAltura(imgDino, alturaDino);
        const imgRefRedim = await redimensionarParaAltura(imgRef, alturaRef);

        // Combinar lado a lado (canvas)
        const combinada = await combinarLadoALado(imgRefRedim, imgDinoRedim);

        // EXIBIR A IMAGEM COMBINADA EMBAIXO, SEM DISTORÇÃO
        const container = document.getElementById('imagem-comparacao');
        container.innerHTML = `
            <div style="display: inline-block; max-width: 100%;">
                <img src="${combinada}" alt="Comparação" style="display: block; width: auto; height: auto; max-width: 100%;">
            </div>
            <p style="margin-top: 10px; font-size: 1.1rem;">
                <strong>${refNome}</strong> (${refAltura}m) | <strong>${dinoSel}</strong> (${dino.Altura}m) — Proporção: ${razao}x
            </p>
        `;
    } catch (e) {
        console.error('Erro ao atualizar escala:', e);
        document.getElementById('imagem-comparacao').innerHTML = `<div class="alert alert-danger">Erro ao carregar a comparação. Verifique o console.</div>`;
    }
};

// 2. Deriva Continental
function renderDerivaContinental() {
    const container = document.getElementById('deriva');
    container.innerHTML = `
        <h4>🗺️ Globo Interativo da Terra Antiga</h4>
        <div class="mb-3">
            <label class="form-label">Selecione a era:</label>
            <select id="era-globo" class="form-select">
                <option value="0">Mundo Atual (0 Ma)</option>
                <option value="66" selected>Cretáceo Superior (66 Ma)</option>
                <option value="150">Jurássico Superior (150 Ma)</option>
                <option value="240">Triássico Médio (240 Ma)</option>
            </select>
        </div>
        <iframe id="iframe-globo" src="https://dinosaurpictures.org/ancient-earth?_t=66#66" width="100%" height="500" style="border:none;"></iframe>
        <div class="mt-3">
            <h5>📍 Localização dos Fósseis</h5>
            <div class="row">
                <div class="col-md-4">
                    <select id="dino-mapa" class="form-select">
                        ${Object.keys(COORDENADAS_DINOSSAUROS).map(n => `<option value="${n}">${n}</option>`).join('')}
                    </select>
                    <button class="btn btn-sm btn-secondary mt-2" onclick="atualizarMapa()">Mostrar no mapa</button>
                </div>
                <div class="col-md-8">
                    <div id="mapa-fosseis" style="height:300px;"></div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('era-globo').addEventListener('change', function() {
        const url = `https://dinosaurpictures.org/ancient-earth?_t=${this.value}#${this.value}`;
        document.getElementById('iframe-globo').src = url;
    });

    if (typeof L === 'undefined') {
        console.warn('Leaflet não carregado.');
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

// 3. Extinção K-Pg
function renderExtincaoKpg() {
    const container = document.getElementById('extincao');
    container.innerHTML = `
        <h4>🦠 Simulador do Fim do Cretáceo</h4>
        <div class="row">
            <div class="col-md-4">
                <label class="form-label">🌑 Bloqueio Solar (%)</label>
                <input type="range" id="bloqueio" class="form-range" min="0" max="100" value="15">
                <span id="bloqueio-val">15</span>
                <label class="form-label">☔ Chuva Ácida (%)</label>
                <input type="range" id="chuva" class="form-range" min="0" max="100" value="40">
                <span id="chuva-val">40</span>
                <label class="form-label">📅 Anos após impacto</label>
                <input type="number" id="anos-sim" class="form-control" value="30" min="1" max="50">
                <button class="btn btn-primary mt-2" onclick="executarSimulacao()">Simular</button>
            </div>
            <div class="col-md-8">
                <canvas id="grafico-extincao" width="400" height="300"></canvas>
                <div id="status-extincao" class="mt-2"></div>
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
                    { label: 'Plantas', data: dados.P, borderColor: 'green', fill: false },
                    { label: 'Herbívoros', data: dados.H, borderColor: 'blue', fill: false },
                    { label: 'Carnívoros', data: dados.C, borderColor: 'red', fill: false }
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

// 4. Icnofósseis (jogo)
function renderIcnofosseis() {
    const container = document.getElementById('icnofosseis');
    container.innerHTML = `
        <h4>👣 Paleo-Detetive: Identifique a Pegada</h4>
        <div class="row">
            <div class="col-md-5">
                <div id="icno-imagem" class="icno-imagem text-center">
                    <p>Clique em "Novo Desafio"</p>
                </div>
                <button class="btn btn-primary mt-2" onclick="novoDesafioIcnofosseis()">🎲 Novo Desafio</button>
            </div>
            <div class="col-md-7">
                <div id="icno-perguntas"></div>
                <button class="btn btn-success mt-2" onclick="identificarIcnofosseis()">🔍 Identificar</button>
                <div id="icno-resultado" class="mt-3"></div>
            </div>
        </div>
    `;
    if (!window.icnoEstado) {
        window.icnoEstado = { desafio: null, respostas: {} };
    }
    setTimeout(novoDesafioIcnofosseis, 100);
}

let icnoDesafioAtual = null;
window.novoDesafioIcnofosseis = function() {
    try {
        const nomes = Object.keys(ICNOFOSSEIS);
        icnoDesafioAtual = nomes[Math.floor(Math.random() * nomes.length)];
        const imgDiv = document.getElementById('icno-imagem');
        imgDiv.innerHTML = `<img src="${gerarSilhuetaPlaceholder('pegada', 200, 200)}" class="img-fluid" alt="Pegada"><p>Fóssil misterioso</p>`;

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
            div.innerHTML = `<div class="alert alert-success">✅ Parabéns! Você acertou! O fóssil é *${resultado}*.</div>`;
            desbloquearConquista('detetive_icno');
        } else {
            div.innerHTML = `<div class="alert alert-danger">❌ Você descreveu *${resultado}*, mas o fóssil é *${icnoDesafioAtual}*.</div>`;
        }
    } catch (e) {
        console.error('Erro na identificação:', e);
        document.getElementById('icno-resultado').innerHTML = `<div class="alert alert-danger">Erro ao identificar.</div>`;
    }
};

// 5. Fósseis Reais
function renderFosseisReais() {
    const container = document.getElementById('fosseis');
    container.innerHTML = `
        <h4>🦴 Museu de Fósseis Reais</h4>
        <button class="btn btn-primary mb-3" onclick="sortearFossil()">🎲 Sortear Dinossauro Real</button>
        <div id="fossil-detalhe"></div>
    `;
    setTimeout(sortearFossil, 100);
}

window.sortearFossil = function() {
    try {
        const dino = DINOSSAUROS_REAIS[Math.floor(Math.random() * DINOSSAUROS_REAIS.length)];
        const div = document.getElementById('fossil-detalhe');
        div.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${dino.Nome}</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Período:</strong> ${dino.Periodo}</p>
                            <p><strong>Dieta:</strong> ${dino.Dieta}</p>
                            <p><strong>Comprimento:</strong> ${dino.Comprimento} m</p>
                            <p><strong>Peso:</strong> ${dino.Peso} ton</p>
                        </div>
                        <div class="col-md-6">
                            <img src="${gerarSilhuetaPlaceholder(dino.Nome, 200, 200)}" class="img-fluid" alt="${dino.Nome}">
                        </div>
                    </div>
                    <p><strong>Curiosidade:</strong> ${dino.Curiosidade}</p>
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Erro ao sortear fóssil:', e);
        document.getElementById('fossil-detalhe').innerHTML = `<div class="alert alert-danger">Erro ao carregar fóssil.</div>`;
    }
};

// 6. Massa Corporal
function renderMassaCorporal() {
    const container = document.getElementById('massa');
    container.innerHTML = `
        <h4>⚖️ Estimativa de Massa Corporal</h4>
        <div class="row">
            <div class="col-md-5">
                <label class="form-label">Tipo de Locomoção:</label>
                <select id="tipo-postura" class="form-select">
                    <option value="bipede">Bípede (ex: T-Rex)</option>
                    <option value="quadrupede">Quadrúpede (ex: Braquiossauro)</option>
                </select>
                <label class="form-label">Circunferência do Fêmur (cm):</label>
                <input type="number" id="femur-cm" class="form-control" value="50" min="0.5" max="300">
                <button class="btn btn-primary mt-2" onclick="calcularMassa()">Calcular</button>
                <div id="resultado-massa" class="mt-3"></div>
            </div>
            <div class="col-md-7">
                <p><strong>Fórmula:</strong> Massa = a × (Circunferência_mm)^b</p>
                <p><strong>Referência:</strong> Campione & Evans (2012)</p>
                <div id="comparacao-massa"></div>
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
            <ul>
                <li>${(massaTon / elefante).toFixed(1)} elefantes</li>
                <li>${(massaTon / trex).toFixed(1)} T-Rex</li>
                <li>${(massaTon / patago).toFixed(2)} Patagotitan</li>
            </ul>
        `;
    } catch (e) {
        console.error('Erro no cálculo de massa:', e);
        document.getElementById('resultado-massa').innerHTML = `<div class="alert alert-danger">Erro no cálculo.</div>`;
    }
};

// 7. Quiz
let quizEstado = { nivel: null, indice: 0, pontuacao: 0, perguntas: [], respostas: [], concluido: false };

function renderQuiz() {
    const container = document.getElementById('quiz');
    container.innerHTML = `
        <h4>📝 Quiz Paleontológico</h4>
        <div id="quiz-area"></div>
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
            <button class="btn btn-primary mt-2" onclick="iniciarQuiz()">Iniciar Quiz</button>
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
            <div class="card">
                <div class="card-body">
                    <h6>Pergunta ${idx+1} de ${total} (${quizEstado.nivel})</h6>
                    <p><strong>${p.pergunta}</strong></p>
                    ${p.opcoes.map((op, i) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="quiz-opcao" value="${i}" id="opcao${i}">
                            <label class="form-check-label" for="opcao${i}">${op}</label>
                        </div>
                    `).join('')}
                    <button class="btn btn-success mt-2" onclick="responderQuiz()">Responder</button>
                </div>
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

// 8. Linha do Tempo
function renderLinhaTempo() {
    const container = document.getElementById('tempo');
    container.innerHTML = `
        <h4>⏳ Linha do Tempo Geológica</h4>
        <div class="mb-3">
            <label>Selecione uma idade (Ma):</label>
            <input type="range" id="slider-tempo" class="form-range" min="66" max="252" value="150">
            <span id="tempo-val">150 Ma</span>
        </div>
        <div id="tempo-info"></div>
        <canvas id="grafico-tempo" width="600" height="100"></canvas>
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

// 9. Clima Mesozóico
function renderClima() {
    const container = document.getElementById('clima');
    container.innerHTML = `
        <h4>🌍 Simulação Climática do Mesozóico</h4>
        <select id="periodo-clima" class="form-select">
            <option value="Triássico (252-201 Ma)">Triássico</option>
            <option value="Jurássico (201-145 Ma)" selected>Jurássico</option>
            <option value="Cretáceo (145-66 Ma)">Cretáceo</option>
        </select>
        <button class="btn btn-primary mt-2" onclick="atualizarClima()">Atualizar</button>
        <div id="clima-info" class="mt-3"></div>
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
            <div class="row">
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

// 10. Conquistas
function renderConquistas() {
    const container = document.getElementById('conquistas');
    container.innerHTML = `
        <h4>🏆 Suas Conquistas</h4>
        <div id="lista-conquistas"></div>
        <div class="progress mt-3">
            <div id="progresso-conquistas" class="progress-bar" role="progressbar" style="width:0%"></div>
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
                ${conquistas[n] ? '✅' : '❌'} ${n.replace('_', ' ').toUpperCase()}
            </div>
        `).join('');
        const total = nomes.length;
        const obtidas = nomes.filter(n => conquistas[n]).length;
        const barra = document.getElementById('progresso-conquistas');
        barra.style.width = (obtidas/total*100)+'%';
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

// 11. Exportar PDF
function renderExportPDF() {
    const container = document.getElementById('pdf');
    container.innerHTML = `
        <h4>📄 Exportar Relatório Científico (PDF)</h4>
        <button class="btn btn-primary" onclick="gerarPDF()">Gerar PDF</button>
        <div id="pdf-status" class="mt-3"></div>
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

// 12. Árvore Evolutiva
function renderArvoreEvolutiva() {
    const container = document.getElementById('arvore');
    container.innerHTML = `
        <h4>🌳 Árvore Evolutiva Interativa</h4>
        <div id="arvore-evolutiva"></div>
        <p class="mt-2">Relações filogenéticas entre os principais grupos.</p>
    `;
    try {
        if (typeof vis === 'undefined') {
            document.getElementById('arvore-evolutiva').innerHTML = '<p class="text-warning">vis.js não carregado.</p>';
            return;
        }
        const nodes = new vis.DataSet([
            {id: 'Reptilia', label: 'Reptilia'},
            {id: 'Archosauria', label: 'Archosauria'},
            {id: 'Dinosauria', label: 'Dinosauria'},
            {id: 'Pterosauria', label: 'Pterosauria'},
            {id: 'Saurischia', label: 'Saurischia'},
            {id: 'Ornithischia', label: 'Ornithischia'},
            {id: 'Theropoda', label: 'Theropoda'},
            {id: 'Sauropodomorpha', label: 'Sauropodomorpha'},
            {id: 'Tyrannosauridae', label: 'Tyrannosauridae'},
            {id: 'Dromaeosauridae', label: 'Dromaeosauridae'},
            {id: 'Spinosauridae', label: 'Spinosauridae'},
            {id: 'Brachiosauridae', label: 'Brachiosauridae'},
            {id: 'Diplodocidae', label: 'Diplodocidae'},
            {id: 'Ceratopsia', label: 'Ceratopsia'},
            {id: 'Ornithopoda', label: 'Ornithopoda'},
            {id: 'Stegosauria', label: 'Stegosauria'},
            {id: 'Ankylosauria', label: 'Ankylosauria'},
            {id: 'Sauropterygia', label: 'Sauropterygia'},
            {id: 'Plesiosauria', label: 'Plesiosauria'},
            {id: 'Ichthyosauria', label: 'Ichthyosauria'}
        ]);
        const edges = new vis.DataSet(ARVORE_ARESTAS.map(([from, to]) => ({from, to})));
        const containerDiv = document.getElementById('arvore-evolutiva');
        const data = {nodes, edges};
        const options = {
            layout: { hierarchical: { direction: 'LR', sortMethod: 'directed' } },
            physics: { enabled: false },
            edges: { arrows: 'to' }
        };
        new vis.Network(containerDiv, data, options);
    } catch (e) {
        console.error('Erro na árvore evolutiva:', e);
        document.getElementById('arvore-evolutiva').innerHTML = `<div class="alert alert-danger">Erro ao carregar árvore.</div>`;
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    renderizarAbas();
    atualizarBadgeConquistas();
    setTimeout(() => {
        try { atualizarEscala(); } catch(e) { console.error('Erro na escala inicial:', e); }
    }, 800);
});