// js/abas/icnofosseis.js – Jogo Paleo-Detetive (identificação de pegadas)

const icnoEstado = { desafio: null, respondido: false, acertos: 0, tentativas: 0, sequencia: 0 };

const PERGUNTAS_ICNO = {
    dedos: { titulo: 'Quantos dedos tocam o chão?', opcoes: [['3', '3 dedos'], ['4', '4 dedos']] },
    garras: { titulo: 'Há marcas de garras na ponta dos dedos?', opcoes: [['true', 'Sim, pontas afiadas'], ['false', 'Não, pontas arredondadas']] },
    tamanho: { titulo: 'Qual o tamanho da pegada?', opcoes: [['pequeno', 'Pequena (até 25 cm)'], ['grande', 'Grande (mais de 25 cm)']] },
    forma: { titulo: 'Qual o formato geral?', opcoes: [['alongada', 'Alongada e estreita'], ['larga', 'Larga e robusta']] },
    proporcao: { titulo: 'Qual a proporção da pegada?', opcoes: [['larga', 'Mais larga que comprida'], ['alongada', 'Mais comprida que larga']] }
};

function _htmlPerguntaIcno(chave, numero, valor) {
    const p = PERGUNTAS_ICNO[chave];
    return `
        <fieldset class="pergunta-icno" data-pergunta="${chave}">
            <legend><span class="numero">${numero}</span> ${p.titulo}</legend>
            <div class="opcoes-radio">
                ${p.opcoes.map(([v, rotulo], i) => `
                    <label class="opcao-radio">
                        <input type="radio" name="icno-${chave}" value="${v}" ${(valor ?? p.opcoes[0][0]) === v ? 'checked' : ''}>
                        <span>${rotulo}</span>
                    </label>`).join('')}
            </div>
        </fieldset>`;
}

registrarAba({
    id: 'icnofosseis',
    titulo: 'Icnofósseis',
    subtitulo: 'Paleo-Detetive: descubra quem deixou esta pegada',
    descricao: 'Identifique pegadas fósseis com uma chave dicotômica.',
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
                    <button type="button" class="btn btn-secundario" data-action="novo-desafio-icno"><i class="bi bi-shuffle" aria-hidden="true"></i> Outra pegada</button>
                </div>
                <form class="cartao icno-form" id="icno-form" novalidate>
                    <h3>Descreva a pegada</h3>
                    <div id="icno-perguntas"></div>
                    <button type="submit" class="btn btn-primario btn-lg btn-bloco"><i class="bi bi-search" aria-hidden="true"></i> Identificar</button>
                    <div id="icno-resultado" class="mt" aria-live="polite"></div>
                    <details class="detalhes">
                        <summary>Ver a chave dicotômica</summary>
                        <ul class="chave">
                            <li><strong>3 dedos com garras:</strong> pequena → <em>Grallator</em>; grande e alongada → <em>Eubrontes</em>; grande e larga → <em>Megalosauripus</em></li>
                            <li><strong>3 dedos sem garras:</strong> pequena → <em>Wintonopus</em>; grande → <em>Amblydactylus</em></li>
                            <li><strong>4 dedos com garras:</strong> <em>Anomoepus</em></li>
                            <li><strong>4 dedos sem garras:</strong> mais larga → <em>Brontopodus</em>; mais comprida → <em>Parabrontopodus</em></li>
                        </ul>
                    </details>
                </form>
            </div>
        `;
        const form = container.querySelector('#icno-form');
        form.addEventListener('change', e => {
            if (e.target.name === 'icno-dedos' || e.target.name === 'icno-garras') atualizarPerguntasExtras();
        });
        form.addEventListener('submit', e => { e.preventDefault(); identificarIcnofosseis(); });
        novoDesafioIcnofosseis();
    }
});

function _valorIcno(chave) {
    const el = document.querySelector(`input[name="icno-${chave}"]:checked`);
    return el ? el.value : null;
}

/** Recria as perguntas extras sempre que "dedos" ou "garras" mudam. */
function atualizarPerguntasExtras() {
    const div = document.getElementById('icno-perguntas');
    if (!div) return;
    const dedos = _valorIcno('dedos') || '3';
    const garras = (_valorIcno('garras') || 'true') === 'true';
    const anteriores = Object.fromEntries(Object.keys(PERGUNTAS_ICNO).map(k => [k, _valorIcno(k)]));
    const chaves = ['dedos', 'garras', ...perguntasExtrasIcno(dedos, garras)];
    div.innerHTML = chaves.map((k, i) => _htmlPerguntaIcno(k, i + 1, anteriores[k])).join('');
}

async function novoDesafioIcnofosseis() {
    const imgDiv = document.getElementById('icno-imagem');
    if (!imgDiv) return;
    imgDiv.innerHTML = htmlCarregando('Escavando uma pegada...');
    const nomes = Object.keys(ICNOFOSSEIS).filter(n => n !== icnoEstado.desafio);
    icnoEstado.desafio = nomes[Math.floor(Math.random() * nomes.length)];
    icnoEstado.respondido = false;
    const src = await carregarImagemIcnofossil(icnoEstado.desafio);
    imgDiv.innerHTML = `<img src="${src}" alt="Fotografia de uma pegada fóssil misteriosa para ser identificada">`;
    document.getElementById('icno-perguntas').innerHTML = '';
    atualizarPerguntasExtras();
    document.getElementById('icno-resultado').innerHTML = '';
}

function identificarIcnofosseis() {
    const resultadoDiv = document.getElementById('icno-resultado');
    const dedos = Number(_valorIcno('dedos'));
    const garras = _valorIcno('garras') === 'true';
    const palpite = identificarIcnogenus(dedos, garras, _valorIcno('tamanho'), _valorIcno('forma'), _valorIcno('proporcao'));
    const correto = icnoEstado.desafio;
    const acertou = palpite === correto;

    if (!icnoEstado.respondido) {
        icnoEstado.respondido = true;
        icnoEstado.tentativas++;
        if (acertou) { icnoEstado.acertos++; icnoEstado.sequencia++; } else { icnoEstado.sequencia = 0; }
        document.getElementById('icno-acertos').textContent = icnoEstado.acertos;
        document.getElementById('icno-tentativas').textContent = icnoEstado.tentativas;
        document.getElementById('icno-sequencia').textContent = icnoEstado.sequencia;
    }

    const info = ICNOFOSSEIS[correto];
    const ficha = `<p class="texto-suave"><em>${correto}</em>: ${info.dedos} dedos, ${info.garras ? 'com' : 'sem'} garras, tamanho ${info.tamanho === 'medio' ? 'médio' : info.tamanho}. Provável autor: ${escapeHtml(info.dieta)}.</p>`;
    resultadoDiv.innerHTML = acertou
        ? htmlAlerta('sucesso', `<strong>Isso mesmo!</strong> É uma pegada de <em>${correto}</em>.${ficha}<button type="button" class="btn btn-primario btn-sm" data-action="novo-desafio-icno">Próxima pegada <i class="bi bi-arrow-right" aria-hidden="true"></i></button>`)
        : htmlAlerta('erro', `<strong>Não foi desta vez.</strong> Sua descrição corresponde a <em>${palpite}</em>, mas a pegada é de <em>${correto}</em>.${ficha}<button type="button" class="btn btn-secundario btn-sm" data-action="novo-desafio-icno">Tentar outra <i class="bi bi-arrow-right" aria-hidden="true"></i></button>`);
    if (acertou) desbloquearConquista('detetive_icno');
}

registrarAcao('novo-desafio-icno', novoDesafioIcnofosseis);
