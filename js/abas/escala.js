// js/abas/escala.js – Comparação de escala entre até três animais

function _obterAnimalEscala(nome) {
    if (!nome || nome === 'Nenhum') return null;
    return REFERENCIAS_ESCALA[nome] || DINOSSAUROS_CLASSICOS.find(d => d.Nome === nome) || null;
}

function _htmlSelectEscala(id, rotulo, selecionado, permitirNenhum) {
    const refs = Object.values(REFERENCIAS_ESCALA)
        .map(r => `<option value="${r.Nome}"${r.Nome === selecionado ? ' selected' : ''}>${r.Nome} (${formatarNumero(r.Altura, 1)} m)</option>`).join('');
    const dinos = DINOSSAUROS_CLASSICOS
        .map(d => `<option value="${escapeHtml(d.Nome)}"${d.Nome === selecionado ? ' selected' : ''}>${escapeHtml(d.Nome)} (${formatarNumero(d.Altura, 1)} m)</option>`).join('');
    return `
        <div class="campo">
            <label for="${id}">${rotulo}</label>
            <select id="${id}" class="select" data-escala-slot>
                ${permitirNenhum ? `<option value="Nenhum"${selecionado === 'Nenhum' ? ' selected' : ''}>Nenhum</option>` : ''}
                <optgroup label="Referências atuais">${refs}</optgroup>
                <optgroup label="Dinossauros">${dinos}</optgroup>
            </select>
        </div>`;
}

registrarAba({
    id: 'escala',
    titulo: 'Escala Real',
    subtitulo: 'Compare o tamanho de dinossauros com animais de hoje',
    descricao: 'Até três animais lado a lado, em proporção real.',
    icone: 'bi-rulers',
    grupo: 'explorar',
    render(container) {
        container.innerHTML = `
            <div class="cartao">
                <div class="grade-campos grade-3">
                    ${_htmlSelectEscala('escala-1', 'Animal 1', 'Tyrannosaurus rex', false)}
                    ${_htmlSelectEscala('escala-2', 'Animal 2', 'Humano', false)}
                    ${_htmlSelectEscala('escala-3', 'Animal 3 (opcional)', 'Nenhum', true)}
                </div>
                <div class="escala-palco-wrapper">
                    <div id="escala-palco" class="escala-palco" role="img" aria-label="Comparação de escala"></div>
                </div>
                <div id="escala-fatos" class="fatos" aria-live="polite"></div>
            </div>
            <p class="nota"><i class="bi bi-info-circle" aria-hidden="true"></i> As silhuetas são desenhadas com a altura real de cada animal. As linhas horizontais marcam a altura em metros. Em telas pequenas, deslize a área de comparação para o lado.</p>
        `;
        container.querySelectorAll('[data-escala-slot]').forEach(sel => sel.addEventListener('change', atualizarEscala));
        window.addEventListener('resize', debounce(ajustarAlturaPalco, 150));
        atualizarEscala();
    },
    aoAtivar: () => requestAnimationFrame(ajustarAlturaPalco)
});

function atualizarEscala() {
    const palco = document.getElementById('escala-palco');
    const fatos = document.getElementById('escala-fatos');
    if (!palco) return;

    const nomes = ['escala-1', 'escala-2', 'escala-3'].map(id => document.getElementById(id)?.value);
    const animais = nomes.map(_obterAnimalEscala).filter(Boolean);
    if (animais.length < 2) return;

    const alturaMax = Math.max(...animais.map(a => a.Altura));
    // o mais alto ocupa 82% da altura útil, deixando espaço para o rótulo acima dele
    const FATOR = 82;
    const percentuais = animais.map(a => (a.Altura / alturaMax) * FATOR);
    const passo = passoGradeMetros(alturaMax);
    const linhas = [];
    for (let m = passo; m <= alturaMax + 1e-9; m += passo) linhas.push(m);

    palco.innerHTML = `
        ${linhas.map(m => `<div class="escala-linha" style="bottom:calc(18px + (100% - 18px) * ${((m / alturaMax) * FATOR / 100).toFixed(4)})"><span>${formatarNumero(m, m % 1 ? 1 : 0)} m</span></div>`).join('')}
        <div class="escala-figuras">
            ${animais.map((a, i) => ({ a, i })).sort((x, y) => x.a.Altura - y.a.Altura).map(({ a, i }) => `
                <figure class="escala-figura" style="--altura:${percentuais[i]}%">
                    <img src="${caminhoSilhueta(a.Nome)}" alt="Silhueta de ${escapeHtml(a.Nome)}, ${formatarNumero(a.Altura, 1)} metros de altura"
                         data-fallback="${escapeHtml(a.Nome)}" data-fallback-tamanho="${(PROPORCOES_SILHUETA[a.Nome] || [1, 1]).map(v => v * 200).join('x')}">
                    <figcaption><strong>${escapeHtml(a.Nome)}</strong><span>${formatarNumero(a.Altura, 1)} m</span></figcaption>
                </figure>`).join('')}
        </div>`;
    palco.setAttribute('aria-label', `Comparação de escala: ${animais.map(a => `${a.Nome} com ${formatarNumero(a.Altura, 1)} metros`).join(', ')}.`);
    aplicarFallbackImagens(palco);
    const imgs = [...palco.querySelectorAll('img')];
    Promise.all(imgs.map(img => img.complete ? null : new Promise(r => { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); })))
        .then(() => requestAnimationFrame(ajustarAlturaPalco));

    // Fatos comparativos
    const [base, ...outros] = animais;
    fatos.innerHTML = outros.map(o => {
        const razaoAlt = base.Altura / o.Altura;
        const maior = razaoAlt >= 1 ? base : o;
        const menor = maior === base ? o : base;
        const r = maior.Altura / menor.Altura;
        const texto = Math.abs(r - 1) < 0.05
            ? `<strong>${escapeHtml(base.Nome)}</strong> e <strong>${escapeHtml(o.Nome)}</strong> têm praticamente a mesma altura.`
            : `<strong>${escapeHtml(maior.Nome)}</strong> é <strong>${formatarNumero(r, 1)}×</strong> mais alto que <strong>${escapeHtml(menor.Nome)}</strong>.`;
        return `<div class="fato"><i class="bi bi-arrow-down-up" aria-hidden="true"></i><p>${texto}</p></div>`;
    }).join('') + (base.Comprimento ? `<div class="fato"><i class="bi bi-arrow-left-right" aria-hidden="true"></i><p>Do focinho à cauda, <strong>${escapeHtml(base.Nome)}</strong> media cerca de <strong>${formatarNumero(base.Comprimento, 1)} m</strong>.</p></div>` : '');

    state.escala = { nomes: animais.map(a => a.Nome), alturas: animais.map(a => a.Altura) };
    if (animais.length === 3) desbloquearConquista('explorador_escala');
}

/**
 * Em telas estreitas, reduz a altura do palco para que todos os animais
 * caibam na largura disponível (mantendo as proporções entre eles).
 */
function ajustarAlturaPalco() {
    const palco = document.getElementById('escala-palco');
    if (!palco || !palco.offsetParent) return;
    const wrapper = palco.parentElement;
    const alturaBase = window.matchMedia('(max-width: 720px)').matches ? 300 : 380;
    palco.style.height = `${alturaBase}px`;
    const disponivel = wrapper.clientWidth;
    const necessario = palco.scrollWidth;
    if (necessario > disponivel) {
        const fixo = 120; // paddings, rótulos e espaçamentos que não escalam
        const fator = Math.max(240 / alturaBase, (disponivel - fixo) / (necessario - fixo));
        palco.style.height = `${Math.round(alturaBase * fator)}px`;
    }
    // Com pouca altura, mostra só metade dos rótulos da grade para não sobrepor
    const linhas = palco.querySelectorAll('.escala-linha');
    const espaco = linhas.length ? (palco.clientHeight * 0.82) / linhas.length : 99;
    palco.classList.toggle('grade-densa', espaco < 26);
}
