// js/abas/conquistas.js – Medalhas, progresso e backup (import/export JSON)

const DESTINO_CONQUISTA = {
    quiz_facil: 'quiz', quiz_medio: 'quiz', quiz_dificil: 'quiz', batalha_mestre: 'quiz',
    explorador_escala: 'escala', detetive_icno: 'icnofosseis', climaturista: 'clima'
};

registrarAba({
    id: 'conquistas',
    titulo: 'Conquistas',
    subtitulo: 'Seu progresso no laboratório',
    descricao: 'Medalhas, progresso e backup do seu avanço.',
    icone: 'bi-trophy',
    grupo: 'desafios',
    render(container) {
        container.innerHTML = `
            <div class="cartao conquistas-resumo">
                <div>
                    <span class="eyebrow">Progresso</span>
                    <p class="numero-grande"><span data-progresso="texto">0/${CONQUISTAS_LISTA.length}</span></p>
                    <p class="texto-suave">medalhas desbloqueadas</p>
                </div>
                <div class="progresso progresso-grande" role="progressbar" aria-label="Conquistas desbloqueadas" aria-valuemin="0" aria-valuemax="${CONQUISTAS_LISTA.length}" aria-valuenow="0">
                    <div class="progresso-barra" data-progresso="barra"></div>
                </div>
            </div>
            <div id="lista-conquistas" class="grade-conquistas"></div>
            <section class="cartao" aria-labelledby="backup-titulo">
                <h3 id="backup-titulo"><i class="bi bi-cloud-arrow-down" aria-hidden="true"></i> Backup do progresso</h3>
                <p class="texto-suave">O progresso fica salvo apenas neste navegador. Exporte um arquivo para não perdê-lo ou para continuar em outro computador.</p>
                <div class="acoes">
                    <button type="button" class="btn btn-primario" data-action="exportar-conquistas"><i class="bi bi-download" aria-hidden="true"></i> Exportar (.json)</button>
                    <button type="button" class="btn btn-secundario" data-action="importar-conquistas"><i class="bi bi-upload" aria-hidden="true"></i> Importar arquivo</button>
                    <input type="file" id="input-importar-conquistas" accept="application/json,.json" hidden>
                    <button type="button" class="btn btn-fantasma btn-perigo-texto" data-action="resetar-conquistas"><i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Apagar progresso</button>
                </div>
            </section>
        `;
        container.querySelector('#input-importar-conquistas').addEventListener('change', importarConquistasJSON);
        renderListaConquistas();
        atualizarIndicadoresProgresso();
    }
});

function renderListaConquistas() {
    const lista = document.getElementById('lista-conquistas');
    if (!lista) return;
    const obtidas = lerConquistas();
    lista.innerHTML = CONQUISTAS_LISTA.map(c => {
        const valor = obtidas[c.id];
        const data = typeof valor === 'string' ? new Date(valor) : null;
        const destino = DESTINO_CONQUISTA[c.id];
        return `
            <article class="conquista ${valor ? 'desbloqueada' : 'bloqueada'}">
                <div class="conquista-icone"><i class="bi ${valor ? c.icone : 'bi-lock'}" aria-hidden="true"></i></div>
                <div class="conquista-texto">
                    <h4>${escapeHtml(c.titulo)}</h4>
                    <p>${escapeHtml(c.descricao)}</p>
                    <span class="conquista-status">
                        ${valor
                            ? `<i class="bi bi-check-circle-fill" aria-hidden="true"></i> Desbloqueada${data && !Number.isNaN(data.getTime()) ? ` em ${data.toLocaleDateString('pt-BR')}` : ''}`
                            : `<span class="visualmente-oculto">Bloqueada.</span><button type="button" class="link-botao" data-action="ir" data-aba="${destino}">Ir para ${escapeHtml(obterAba(destino)?.titulo || '')} <i class="bi bi-arrow-right" aria-hidden="true"></i></button>`}
                    </span>
                </div>
            </article>`;
    }).join('');
}

async function exportarConquistasJSON() {
    const payload = criarPayloadExportacao(lerConquistas(), lerPeriodosVisitados());
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const ok = await baixarArquivo(blob, `paleolab_conquistas_${new Date().toISOString().slice(0, 10)}.json`);
    // No app Android, o próprio app avisa onde o arquivo foi salvo
    if (ok && !estaNoAppNativo()) toast('Arquivo de progresso salvo.', 'sucesso');
}

function importarConquistasJSON(event) {
    const input = event.target;
    const arquivo = input.files && input.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = () => {
        let dados;
        try {
            dados = JSON.parse(leitor.result);
        } catch (e) {
            toast('O arquivo não é um JSON válido.', 'erro');
            return;
        }
        const resultado = validarPayloadImportacao(dados, CONQUISTAS_LISTA.map(c => c.id));
        if (!resultado.ok) {
            toast(resultado.erro, 'erro');
            return;
        }
        aplicarImportacao(resultado);
        atualizarIndicadoresProgresso();
        const n = Object.keys(resultado.conquistas).length;
        toast(`${n} ${n === 1 ? 'conquista importada' : 'conquistas importadas'} e mescladas ao progresso atual.`, 'sucesso', { titulo: 'Importação concluída' });
    };
    leitor.onerror = () => toast('Não foi possível ler o arquivo.', 'erro');
    leitor.readAsText(arquivo);
    input.value = ''; // permite importar o mesmo arquivo novamente
}

registrarAcao('exportar-conquistas', exportarConquistasJSON);
registrarAcao('importar-conquistas', () => document.getElementById('input-importar-conquistas')?.click());
registrarAcao('resetar-conquistas', async () => {
    const ok = await confirmar('Todas as conquistas, recordes e períodos visitados serão apagados deste navegador. Esta ação não pode ser desfeita.', {
        titulo: 'Apagar todo o progresso?', textoOk: 'Apagar', perigo: true
    });
    if (!ok) return;
    resetarProgresso();
    atualizarIndicadoresProgresso();
    toast('Progresso apagado.', 'info');
});
