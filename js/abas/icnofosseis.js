// js/abas/icnofosseis.js – Jogo Paleo-Detetive
// Mostra uma pegada fóssil e quatro dinossauros: a pessoa marca qual deles
// pode ter deixado a pegada. Cada alternativa é de um grupo diferente
// (terópode, ornitísquio bípede, saurópode, quadrúpede encouraçado).

/** "Terópodes do Jurássico" → "terópodes do Jurássico" (só a primeira letra). */
const minusculaInicial = t => t.charAt(0).toLowerCase() + t.slice(1);

const icnoEstado = { desafio: null, opcoes: [], respondido: false, acertos: 0, tentativas: 0, sequencia: 0, dicaVista: false };

registrarAba({
    id: 'icnofosseis',
    titulo: 'Icnofósseis',
    subtitulo: 'Paleo-Detetive: descubra quem deixou esta pegada',
    descricao: 'Observe a pegada fóssil e descubra qual dinossauro a deixou.',
    icone: 'bi-fingerprint',
    grupo: 'laboratorio',
    render(container) {
        container.innerHTML = `
            <div class="placar" aria-live="polite">
                <div><span class="placar-valor" id="icno-acertos">0</span><span class="placar-rotulo">acertos</span></div>
                <div><span class="placar-valor" id="icno-tentativas">0</span><span class="placar-rotulo">tentativas</span></div>
                <div><span class="placar-valor" id="icno-sequencia">0</span><span class="placar-rotulo">sequência</span></div>
            </div>
            <div class="icno-layout">
                <div class="cartao icno-fossil">
                    <span class="eyebrow"><i class="bi bi-question-diamond" aria-hidden="true"></i> Pegada misteriosa</span>
                    <div id="icno-imagem" class="icno-imagem"></div>
                    <div class="icno-acoes">
                        <button type="button" class="btn btn-secundario" data-action="dica-icno" id="btn-dica-icno"><i class="bi bi-lightbulb" aria-hidden="true"></i> Ver pistas</button>
                        <button type="button" class="btn btn-fantasma" data-action="novo-desafio-icno"><i class="bi bi-shuffle" aria-hidden="true"></i> Outra pegada</button>
                    </div>
                    <div id="icno-dica" aria-live="polite"></div>
                </div>
                <div class="cartao icno-escolha">
                    <h3 id="icno-pergunta">Qual destes dinossauros pode ter deixado esta pegada?</h3>
                    <div id="icno-opcoes" class="icno-opcoes" role="group" aria-labelledby="icno-pergunta"></div>
                    <div id="icno-resultado" aria-live="polite"></div>
                    <details class="detalhes">
                        <summary>Como reconhecer uma pegada?</summary>
                        <ul class="chave">
                            <li><strong>Terópodes</strong> (carnívoros bípedes): 3 dedos finos e pontudos, com marcas de garras.</li>
                            <li><strong>Ornitópodes</strong> (herbívoros bípedes): 3 dedos curtos, largos e arredondados, sem garras afiadas.</li>
                            <li><strong>Saurópodes</strong> (pescoçudos gigantes): pegadas enormes e arredondadas, parecidas com as de elefante.</li>
                            <li><strong>Estegossauros, anquilossauros e ceratopsianos</strong>: quadrúpedes com dedos curtos em forma de casco. Nenhuma das pegadas deste jogo é deles.</li>
                        </ul>
                        <p class="nota">Uma pegada fóssil (icnofóssil) quase nunca revela a espécie exata. Por isso os cientistas dão nomes próprios às pegadas, como <em>Grallator</em>, e indicam o grupo de dinossauros mais provável.</p>
                    </details>
                </div>
            </div>
        `;
        container.querySelector('#icno-opcoes').addEventListener('click', e => {
            const btn = e.target.closest('.icno-opcao');
            if (btn && !btn.disabled) responderIcno(btn.dataset.dino);
        });
        novoDesafioIcnofosseis();
    }
});

function _cartaoOpcaoIcno(nome) {
    const noMuseu = DINOSSAUROS_REAIS.find(d => d.Nome === nome);
    return `
        <button type="button" class="icno-opcao" data-dino="${escapeHtml(nome)}">
            <span class="icno-opcao-img">
                <img src="${caminhoImagemFossil(nome)}" alt="" loading="lazy" data-fallback="${escapeHtml(nome)}" data-fallback-tamanho="300x200">
            </span>
            <span class="icno-opcao-nome"><em>${escapeHtml(nome)}</em>${noMuseu ? `<small>${escapeHtml(noMuseu.Postura)} · ${escapeHtml(noMuseu.Dieta)}</small>` : ''}</span>
        </button>`;
}

async function novoDesafioIcnofosseis() {
    const imgDiv = document.getElementById('icno-imagem');
    if (!imgDiv) return;
    imgDiv.innerHTML = htmlCarregando('Escavando uma pegada...');
    const nomes = Object.keys(AUTORES_ICNOFOSSEIS).filter(n => n !== icnoEstado.desafio);
    icnoEstado.desafio = nomes[Math.floor(Math.random() * nomes.length)];
    icnoEstado.respondido = false;
    icnoEstado.dicaVista = false;
    const { opcoes } = gerarOpcoesIcno(icnoEstado.desafio, AUTORES_ICNOFOSSEIS, DISTRATORES_ICNOFOSSEIS);
    icnoEstado.opcoes = opcoes;

    document.getElementById('icno-dica').innerHTML = '';
    document.getElementById('btn-dica-icno').disabled = false;
    document.getElementById('icno-resultado').innerHTML = '';
    const divOpcoes = document.getElementById('icno-opcoes');
    divOpcoes.innerHTML = opcoes.map(_cartaoOpcaoIcno).join('');
    aplicarFallbackImagens(divOpcoes);

    const src = await carregarImagemIcnofossil(icnoEstado.desafio);
    imgDiv.innerHTML = `<img src="${src}" alt="Fotografia de uma pegada fóssil misteriosa">`;
}

function mostrarDicaIcno() {
    const autor = AUTORES_ICNOFOSSEIS[icnoEstado.desafio];
    if (!autor) return;
    icnoEstado.dicaVista = true;
    document.getElementById('btn-dica-icno').disabled = true;
    document.getElementById('icno-dica').innerHTML = htmlAlerta('info', `<strong>Pistas:</strong> ${escapeHtml(autor.pistas)}`, 'bi-search');
}

function responderIcno(escolhido) {
    if (icnoEstado.respondido) return;
    icnoEstado.respondido = true;
    const autor = AUTORES_ICNOFOSSEIS[icnoEstado.desafio];
    const acertou = escolhido === autor.exemplo;

    icnoEstado.tentativas++;
    if (acertou) { icnoEstado.acertos++; icnoEstado.sequencia++; } else { icnoEstado.sequencia = 0; }
    document.getElementById('icno-acertos').textContent = icnoEstado.acertos;
    document.getElementById('icno-tentativas').textContent = icnoEstado.tentativas;
    document.getElementById('icno-sequencia').textContent = icnoEstado.sequencia;

    document.querySelectorAll('.icno-opcao').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.dino === autor.exemplo) btn.classList.add('correta');
        else if (btn.dataset.dino === escolhido) btn.classList.add('errada');
    });

    const grupoEscolhido = Object.values(AUTORES_ICNOFOSSEIS).find(a => a.exemplo === escolhido)?.grupo
        || (DISTRATORES_ICNOFOSSEIS.includes(escolhido) ? 'encouracado' : null);
    const explicacaoErro = !acertou && grupoEscolhido
        ? `<p>O <em>${escapeHtml(escolhido)}</em> é um ${escapeHtml(minusculaInicial(GRUPOS_PEGADAS[grupoEscolhido]))}, e suas pegadas teriam outro formato.</p>`
        : '';
    const corpo = `
        <p>Esta pegada é do icnogênero <strong><em>${escapeHtml(icnoEstado.desafio)}</em></strong>, atribuído a <strong>${escapeHtml(minusculaInicial(autor.autor))}</strong>, como o <em>${escapeHtml(autor.exemplo)}</em>.</p>
        ${explicacaoErro}
        <p><strong>Como reconhecer:</strong> ${escapeHtml(autor.pistas)}</p>
        <p class="texto-suave"><i class="bi bi-stars" aria-hidden="true"></i> ${escapeHtml(autor.curiosidade)}</p>
        <button type="button" class="btn ${acertou ? 'btn-primario' : 'btn-secundario'} btn-sm" data-action="novo-desafio-icno">Próxima pegada <i class="bi bi-arrow-right" aria-hidden="true"></i></button>`;
    document.getElementById('icno-resultado').innerHTML = acertou
        ? htmlAlerta('sucesso', `<strong>Isso mesmo!</strong>${corpo}`)
        : htmlAlerta('erro', `<strong>Não foi desta vez.</strong>${corpo}`);
    document.getElementById('icno-resultado').querySelector('.btn')?.focus({ preventScroll: true });
    if (acertou) desbloquearConquista('detetive_icno');
}

registrarAcao('novo-desafio-icno', novoDesafioIcnofosseis);
registrarAcao('dica-icno', mostrarDicaIcno);
