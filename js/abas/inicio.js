// js/abas/inicio.js – Painel inicial

function dinossauroDoDia(data = new Date()) {
    const chave = `${data.getFullYear()}-${data.getMonth()}-${data.getDate()}`;
    return DINOSSAUROS_REAIS[hashString(chave) % DINOSSAUROS_REAIS.length];
}

registrarAba({
    id: 'inicio',
    titulo: 'Início',
    subtitulo: 'Laboratório virtual de paleontologia',
    icone: 'bi-house',
    grupo: 'inicio',
    render(container) {
        const dino = dinossauroDoDia();
        const modulos = ABAS.filter(a => a.id !== 'inicio');
        const porGrupo = GRUPOS_ABAS.filter(g => g.titulo).map(g => ({
            ...g,
            abas: modulos.filter(a => a.grupo === g.id)
        }));

        container.innerHTML = `
            <section class="hero" aria-labelledby="hero-titulo">
                <div class="hero-texto">
                    <span class="eyebrow"><i class="bi bi-stars" aria-hidden="true"></i> Ciência de verdade, direto no navegador</span>
                    <h2 id="hero-titulo">Explore 165 milhões de anos de dinossauros</h2>
                    <p>Compare tamanhos, simule a extinção do Cretáceo, identifique pegadas fósseis e teste o que você aprendeu. Tudo com dados científicos reais.</p>
                    <div class="hero-acoes">
                        <button type="button" class="btn btn-primario btn-lg" data-action="ir" data-aba="escala"><i class="bi bi-rulers" aria-hidden="true"></i> Começar a explorar</button>
                        <button type="button" class="btn btn-secundario btn-lg" data-action="ir" data-aba="quiz"><i class="bi bi-patch-question" aria-hidden="true"></i> Fazer o quiz</button>
                    </div>
                </div>
                <div class="hero-arte" aria-hidden="true">
                    <img src="assets/trex.png" alt="" data-fallback="Tyrannosaurus rex" data-fallback-tamanho="400x200">
                </div>
            </section>

            <section class="stats" aria-label="Números do laboratório">
                <div class="stat"><span class="stat-valor">${DINOSSAUROS_REAIS.length}</span><span class="stat-rotulo">espécies reais</span></div>
                <div class="stat"><span class="stat-valor">${modulos.length}</span><span class="stat-rotulo">módulos interativos</span></div>
                <div class="stat"><span class="stat-valor">${Object.values(QUIZ).reduce((s, l) => s + l.length, 0)}</span><span class="stat-rotulo">perguntas no quiz</span></div>
                <div class="stat"><span class="stat-valor" data-progresso="texto">0/${CONQUISTAS_LISTA.length}</span><span class="stat-rotulo">conquistas</span></div>
            </section>

            <div class="inicio-grid">
                <div class="inicio-modulos">
                    ${porGrupo.map(g => `
                        <section aria-labelledby="grupo-${g.id}">
                            <h3 class="titulo-secao" id="grupo-${g.id}">${g.titulo}</h3>
                            <div class="grade-modulos">
                                ${g.abas.map(a => `
                                    <button type="button" class="cartao-modulo" data-action="ir" data-aba="${a.id}">
                                        <span class="cartao-modulo-icone"><i class="bi ${a.icone}" aria-hidden="true"></i></span>
                                        <span class="cartao-modulo-texto">
                                            <strong>${escapeHtml(a.titulo)}</strong>
                                            <span>${escapeHtml(a.descricao || a.subtitulo)}</span>
                                        </span>
                                        <i class="bi bi-arrow-right cartao-modulo-seta" aria-hidden="true"></i>
                                    </button>`).join('')}
                            </div>
                        </section>`).join('')}
                </div>

                <aside class="cartao destaque-dia" aria-labelledby="dino-dia-titulo">
                    <span class="eyebrow"><i class="bi bi-calendar-heart" aria-hidden="true"></i> Dinossauro do dia</span>
                    <img src="${caminhoImagemFossil(dino.Nome)}" alt="Reconstituição de ${escapeHtml(dino.Nome)}" loading="lazy"
                         data-fallback="${escapeHtml(dino.Nome)}" data-fallback-tamanho="300x200">
                    <h3 id="dino-dia-titulo"><em>${escapeHtml(dino.Nome)}</em></h3>
                    <div class="chips">
                        <span class="chip chip-periodo" data-periodo="${extrairPeriodo(dino.Periodo)}">${escapeHtml(dino.Periodo)}</span>
                        <span class="chip">${escapeHtml(dino.Dieta)}</span>
                    </div>
                    <p>${escapeHtml(dino.Curiosidade)}</p>
                    <button type="button" class="btn btn-secundario" data-action="abrir-ficha" data-dino="${escapeHtml(dino.Nome)}">
                        <i class="bi bi-journal-text" aria-hidden="true"></i> Ver ficha completa
                    </button>
                </aside>
            </div>
        `;
        aplicarFallbackImagens(container);
        atualizarIndicadoresProgresso();
    }
});
