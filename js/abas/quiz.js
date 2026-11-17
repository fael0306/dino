// js/abas/quiz.js – Quiz (3 níveis) e modo Batalha

const NIVEIS_QUIZ = [
    { id: 'Fácil', icone: 'bi-emoji-smile', texto: 'Conceitos básicos sobre dinossauros.' },
    { id: 'Médio', icone: 'bi-emoji-neutral', texto: 'Períodos, icnofósseis e ecologia.' },
    { id: 'Difícil', icone: 'bi-emoji-dizzy', texto: 'Modelos matemáticos e detalhes científicos.' }
];
const LETRAS = ['A', 'B', 'C', 'D', 'E'];

const quizConfig = { modo: 'normal', nivel: 'Fácil', quantidade: 10, dino1: 'Tyrannosaurus rex', dino2: 'Spinosaurus aegyptiacus' };
let jogo = null; // partida em andamento

registrarAba({
    id: 'quiz',
    titulo: 'Quiz & Batalha',
    subtitulo: 'Teste seus conhecimentos de paleontologia',
    descricao: 'Perguntas em 3 níveis e duelos entre dinossauros.',
    icone: 'bi-patch-question',
    grupo: 'desafios',
    render(container) {
        if (state.batalhaDinoInicial) {
            quizConfig.modo = 'batalha';
            quizConfig.dino1 = state.batalhaDinoInicial;
            if (quizConfig.dino2 === quizConfig.dino1) quizConfig.dino2 = 'Tyrannosaurus rex';
            state.batalhaDinoInicial = null;
        }
        container.innerHTML = `
            <div class="quiz-modo">
                ${htmlSegmentado('modo-quiz', [
                    { valor: 'normal', rotulo: 'Quiz', icone: 'bi-patch-question' },
                    { valor: 'batalha', rotulo: 'Batalha', icone: 'bi-lightning-charge' }
                ], quizConfig.modo, 'Modo de jogo')}
            </div>
            <div id="quiz-conteudo"></div>
        `;
        ligarSegmentado(container, 'modo-quiz', modo => { quizConfig.modo = modo; jogo = null; renderMenuQuiz(); });
        renderMenuQuiz();
    }
});

/** Chamado pela ficha do museu ("Usar no modo Batalha"). */
function abrirModoBatalha(nome) {
    if (!state.initialized.quiz) return; // render() já usa state.batalhaDinoInicial
    quizConfig.modo = 'batalha';
    quizConfig.dino1 = nome;
    if (quizConfig.dino2 === nome) quizConfig.dino2 = nome === 'Tyrannosaurus rex' ? 'Spinosaurus aegyptiacus' : 'Tyrannosaurus rex';
    state.batalhaDinoInicial = null;
    jogo = null;
    document.querySelectorAll('[data-segmentado="modo-quiz"] .segmento').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.valor === 'batalha')));
    renderMenuQuiz();
}

// ------------------------------------------------------------
// Menus
// ------------------------------------------------------------
function renderMenuQuiz() {
    const area = document.getElementById('quiz-conteudo');
    if (!area) return;
    if (quizConfig.modo === 'batalha') { renderMenuBatalha(area); return; }
    const recordes = lerRecordes();
    area.innerHTML = `
        <div class="cartao">
            <h3>Escolha o nível</h3>
            <div class="niveis" role="radiogroup" aria-label="Nível do quiz">
                ${NIVEIS_QUIZ.map(n => {
                    const r = recordes[n.id];
                    return `<button type="button" class="nivel" role="radio" aria-checked="${n.id === quizConfig.nivel}" data-nivel="${n.id}">
                        <i class="bi ${n.icone}" aria-hidden="true"></i>
                        <strong>${n.id}</strong><span>${n.texto}</span>
                        <span class="nivel-recorde">${r ? `<i class="bi bi-trophy" aria-hidden="true"></i> Recorde: ${r.acertos}/${r.total}` : 'Sem recorde ainda'}</span>
                    </button>`;
                }).join('')}
            </div>
            <div class="quiz-opcoes-config">
                <div class="campo">
                    <span class="rotulo">Número de perguntas</span>
                    ${htmlSegmentado('quiz-qtd', [{ valor: '10', rotulo: '10 (rápido)' }, { valor: '20', rotulo: '20 (completo)' }], String(quizConfig.quantidade), 'Número de perguntas')}
                </div>
                <button type="button" class="btn btn-primario btn-lg" data-action="iniciar-quiz"><i class="bi bi-play-fill" aria-hidden="true"></i> Começar</button>
            </div>
            <p class="nota"><i class="bi bi-trophy" aria-hidden="true"></i> As conquistas do quiz exigem gabaritar a rodada completa de 20 perguntas. Dica: use as teclas <kbd>1</kbd>–<kbd>4</kbd> para responder.</p>
        </div>`;
    const grupo = area.querySelector('.niveis');
    grupo.addEventListener('click', e => {
        const btn = e.target.closest('.nivel');
        if (!btn) return;
        quizConfig.nivel = btn.dataset.nivel;
        grupo.querySelectorAll('.nivel').forEach(b => b.setAttribute('aria-checked', String(b === btn)));
    });
    grupo.addEventListener('keydown', e => {
        if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
        e.preventDefault();
        const botoes = [...grupo.querySelectorAll('.nivel')];
        const i = botoes.findIndex(b => b.getAttribute('aria-checked') === 'true');
        const prox = botoes[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + botoes.length) % botoes.length];
        prox.click();
        prox.focus();
    });
    ligarSegmentado(area, 'quiz-qtd', v => { quizConfig.quantidade = Number(v); });
}

function _htmlCartaoDuelo(nome, lado) {
    const d = DINOSSAUROS_REAIS.find(x => x.Nome === nome);
    if (!d) return '';
    return `
        <div class="duelista">
            <label for="batalha-${lado}" class="visualmente-oculto">${lado === 'dino1' ? 'Primeiro' : 'Segundo'} dinossauro</label>
            <select id="batalha-${lado}" class="select">${htmlOpcoes(DINOSSAUROS_REAIS.map(x => x.Nome).sort((a, b) => a.localeCompare(b, 'pt-BR')), nome)}</select>
            <img src="${caminhoImagemFossil(d.Nome)}" alt="Reconstituição de ${escapeHtml(d.Nome)}" data-fallback="${escapeHtml(d.Nome)}" data-fallback-tamanho="300x200">
            <div class="chips"><span class="chip chip-periodo" data-periodo="${extrairPeriodo(d.Periodo)}">${escapeHtml(d.Periodo)}</span><span class="chip">${escapeHtml(d.Dieta)}</span></div>
        </div>`;
}

function renderMenuBatalha(area) {
    area.innerHTML = `
        <div class="cartao">
            <h3>Monte o duelo</h3>
            <p class="texto-suave">Escolha dois dinossauros. Você responderá 5 perguntas comparando peso, tamanho, época, dieta e postura.</p>
            <div class="duelo" id="duelo">
                ${_htmlCartaoDuelo(quizConfig.dino1, 'dino1')}
                <div class="vs" aria-hidden="true">VS</div>
                ${_htmlCartaoDuelo(quizConfig.dino2, 'dino2')}
            </div>
            <div class="acoes-centro">
                <button type="button" class="btn btn-secundario" data-action="sortear-duelo"><i class="bi bi-dice-5" aria-hidden="true"></i> Sortear duelo</button>
                <button type="button" class="btn btn-primario btn-lg" data-action="iniciar-batalha"><i class="bi bi-lightning-charge-fill" aria-hidden="true"></i> Batalhar!</button>
            </div>
        </div>`;
    aplicarFallbackImagens(area);
    ['dino1', 'dino2'].forEach(lado => area.querySelector(`#batalha-${lado}`).addEventListener('change', e => {
        quizConfig[lado] = e.target.value;
        renderMenuBatalha(area);
        area.querySelector(`#batalha-${lado}`).focus();
    }));
}

registrarAcao('sortear-duelo', () => {
    const [a, b] = embaralhar(DINOSSAUROS_REAIS).slice(0, 2);
    quizConfig.dino1 = a.Nome;
    quizConfig.dino2 = b.Nome;
    renderMenuQuiz();
});

registrarAcao('iniciar-quiz', () => {
    const perguntas = prepararQuiz(QUIZ[quizConfig.nivel] || [], { quantidade: quizConfig.quantidade });
    iniciarPartida({ tipo: 'normal', titulo: `Quiz · ${quizConfig.nivel}`, perguntas, nivel: quizConfig.nivel });
});

registrarAcao('iniciar-batalha', () => {
    if (quizConfig.dino1 === quizConfig.dino2) {
        toast('Escolha dois dinossauros diferentes para o duelo.', 'aviso');
        return;
    }
    const d1 = DINOSSAUROS_REAIS.find(d => d.Nome === quizConfig.dino1);
    const d2 = DINOSSAUROS_REAIS.find(d => d.Nome === quizConfig.dino2);
    iniciarPartida({ tipo: 'batalha', titulo: `${d1.Nome} × ${d2.Nome}`, perguntas: gerarPerguntasBatalha(d1, d2, 5), dino1: d1, dino2: d2 });
});

// ------------------------------------------------------------
// Partida (compartilhada pelos dois modos)
// ------------------------------------------------------------
function iniciarPartida(config) {
    jogo = { ...config, indice: 0, respostas: [], pontuacao: 0, respondida: false };
    renderPergunta();
}

function renderPergunta() {
    const area = document.getElementById('quiz-conteudo');
    const p = jogo.perguntas[jogo.indice];
    const total = jogo.perguntas.length;
    area.innerHTML = `
        <div class="cartao quiz-jogo">
            <div class="quiz-topo">
                <span class="quiz-titulo">${escapeHtml(jogo.titulo)}</span>
                <span class="quiz-contador">Pergunta <strong>${jogo.indice + 1}</strong> de ${total} · <i class="bi bi-star-fill" aria-hidden="true"></i> ${jogo.pontuacao}</span>
                <button type="button" class="btn btn-fantasma btn-sm" data-action="sair-quiz"><i class="bi bi-x-lg" aria-hidden="true"></i> Sair</button>
            </div>
            <div class="progresso" role="progressbar" aria-label="Progresso da partida" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${jogo.indice}">
                <div class="progresso-barra" style="width:${(jogo.indice / total) * 100}%"></div>
            </div>
            <h3 class="quiz-pergunta" id="quiz-pergunta" tabindex="-1">${escapeHtml(p.pergunta)}</h3>
            <div class="quiz-opcoes" role="group" aria-labelledby="quiz-pergunta">
                ${p.opcoes.map((o, i) => `
                    <button type="button" class="quiz-opcao" data-indice="${i}">
                        <span class="letra" aria-hidden="true">${LETRAS[i]}</span><span class="quiz-opcao-texto">${escapeHtml(o)}</span>
                    </button>`).join('')}
            </div>
            <div id="quiz-feedback" aria-live="polite"></div>
        </div>`;
    area.querySelector('.quiz-opcoes').addEventListener('click', e => {
        const btn = e.target.closest('.quiz-opcao');
        if (btn) responderPergunta(Number(btn.dataset.indice));
    });
    area.querySelector('#quiz-pergunta').focus({ preventScroll: true });
}

function responderPergunta(indice) {
    if (!jogo || jogo.respondida) return;
    const p = jogo.perguntas[jogo.indice];
    jogo.respondida = true;
    jogo.respostas[jogo.indice] = indice;
    const acertou = indice === p.resposta;
    if (acertou) jogo.pontuacao++;

    document.querySelectorAll('.quiz-opcao').forEach(btn => {
        const i = Number(btn.dataset.indice);
        btn.disabled = true;
        if (i === p.resposta) btn.classList.add('correta');
        if (i === indice && !acertou) btn.classList.add('errada');
        if (i === indice) btn.setAttribute('aria-label', `${btn.textContent.trim()} – sua resposta, ${acertou ? 'correta' : 'incorreta'}`);
    });
    const ultima = jogo.indice === jogo.perguntas.length - 1;
    document.getElementById('quiz-feedback').innerHTML = `
        <div class="feedback ${acertou ? 'feedback-certo' : 'feedback-errado'}">
            <strong><i class="bi ${acertou ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}" aria-hidden="true"></i> ${acertou ? 'Resposta certa!' : `Resposta errada. A correta é: ${escapeHtml(p.opcoes[p.resposta])}`}</strong>
            ${p.explicacao ? `<p>${escapeHtml(p.explicacao)}</p>` : ''}
            <button type="button" class="btn btn-primario" data-action="quiz-proxima" id="btn-proxima">
                ${ultima ? 'Ver resultado <i class="bi bi-flag-fill" aria-hidden="true"></i>' : 'Próxima <i class="bi bi-arrow-right" aria-hidden="true"></i>'}
            </button>
        </div>`;
    document.getElementById('btn-proxima').focus({ preventScroll: true });
}

registrarAcao('quiz-proxima', () => {
    if (!jogo) return;
    jogo.indice++;
    jogo.respondida = false;
    if (jogo.indice >= jogo.perguntas.length) concluirPartida();
    else renderPergunta();
});

registrarAcao('sair-quiz', async () => {
    if (jogo && jogo.indice > 0 && !(await confirmar('O progresso desta partida será perdido.', { titulo: 'Sair da partida?', textoOk: 'Sair' }))) return;
    jogo = null;
    renderMenuQuiz();
});

registrarAcao('jogar-novamente', () => {
    if (!jogo) return;
    if (jogo.tipo === 'normal') executarAcao('iniciar-quiz');
    else executarAcao('iniciar-batalha');
});
registrarAcao('menu-quiz', () => { jogo = null; renderMenuQuiz(); });

function concluirPartida() {
    jogo.concluido = true;
    const total = jogo.perguntas.length;
    const pct = Math.round((jogo.pontuacao / total) * 100);
    const resumo = { ...jogo, total, concluido: true, data: new Date() };
    let recorde = false;

    if (jogo.tipo === 'normal') {
        state.quiz = resumo;
        recorde = registrarRecorde(jogo.nivel, jogo.pontuacao, total);
        const mapa = { 'Fácil': 'quiz_facil', 'Médio': 'quiz_medio', 'Difícil': 'quiz_dificil' };
        if (jogo.pontuacao === total && total >= (QUIZ[jogo.nivel] || []).length) desbloquearConquista(mapa[jogo.nivel]);
    } else {
        state.batalha = resumo;
        if (jogo.pontuacao === total) desbloquearConquista('batalha_mestre');
    }

    const mensagem = pct === 100 ? 'Perfeito! Você gabaritou.' : pct >= 70 ? 'Muito bem! Ótimo desempenho.' : pct >= 40 ? 'Bom começo! Revise as explicações abaixo.' : 'Continue praticando: cada erro é uma descoberta.';
    const area = document.getElementById('quiz-conteudo');
    area.innerHTML = `
        <div class="cartao quiz-resultado">
            <div class="anel" style="--pct:${pct}" role="img" aria-label="${jogo.pontuacao} de ${total} acertos, ${pct} por cento">
                <span><strong>${jogo.pontuacao}/${total}</strong><small>${pct}%</small></span>
            </div>
            <div class="quiz-resultado-texto">
                <span class="eyebrow">${escapeHtml(jogo.titulo)}</span>
                <h3 tabindex="-1" id="quiz-resultado-titulo">${mensagem}</h3>
                ${recorde ? '<p class="destaque-recorde"><i class="bi bi-trophy-fill" aria-hidden="true"></i> Novo recorde neste nível!</p>' : ''}
                <div class="acoes">
                    <button type="button" class="btn btn-primario" data-action="jogar-novamente"><i class="bi bi-arrow-repeat" aria-hidden="true"></i> Jogar novamente</button>
                    <button type="button" class="btn btn-secundario" data-action="menu-quiz"><i class="bi bi-grid" aria-hidden="true"></i> ${jogo.tipo === 'normal' ? 'Mudar nível' : 'Novo duelo'}</button>
                </div>
            </div>
        </div>
        <div class="cartao">
            <h3>Revisão das respostas</h3>
            <ol class="revisao">
                ${jogo.perguntas.map((p, i) => {
                    const r = jogo.respostas[i];
                    const ok = r === p.resposta;
                    return `<li class="${ok ? 'certo' : 'errado'}">
                        <p class="revisao-pergunta"><i class="bi ${ok ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}" aria-hidden="true"></i> ${escapeHtml(p.pergunta)}</p>
                        <p><span class="visualmente-oculto">${ok ? 'Acertou.' : 'Errou.'}</span>Sua resposta: <strong>${escapeHtml(p.opcoes[r] ?? 'Não respondida')}</strong>${ok ? '' : ` · Correta: <strong>${escapeHtml(p.opcoes[p.resposta])}</strong>`}</p>
                        ${p.explicacao ? `<p class="texto-suave">${escapeHtml(p.explicacao)}</p>` : ''}
                    </li>`;
                }).join('')}
            </ol>
        </div>`;
    document.getElementById('quiz-resultado-titulo').focus({ preventScroll: true });
    anunciar(`Partida concluída: ${jogo.pontuacao} de ${total} acertos.`);
}

// Atalhos de teclado: 1–5 ou A–E escolhem a alternativa
document.addEventListener('keydown', e => {
    if (state.abaAtiva !== 'quiz' || !jogo || jogo.respondida || jogo.concluido) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
    let i = '12345'.indexOf(e.key);
    if (i < 0) i = 'abcde'.indexOf(e.key.toLowerCase());
    const p = jogo.perguntas[jogo.indice];
    if (i >= 0 && i < p.opcoes.length) {
        e.preventDefault();
        responderPergunta(i);
    }
});
