// js/abas/pdf.js – Relatório científico em PDF (jsPDF carregado sob demanda)

const SECOES_PDF = [
    { id: 'conquistas', titulo: 'Conquistas desbloqueadas', disponivel: () => true },
    { id: 'quiz', titulo: 'Resultado do último quiz', disponivel: () => !!state.quiz, dica: 'Conclua um quiz', aba: 'quiz' },
    { id: 'batalha', titulo: 'Resultado da última batalha', disponivel: () => !!state.batalha, dica: 'Conclua uma batalha', aba: 'quiz' },
    { id: 'kpg', titulo: 'Simulação da extinção K‑Pg (com gráfico)', disponivel: () => !!state.simulacao, dica: 'Abra o simulador', aba: 'extincao' },
    { id: 'escala', titulo: 'Comparação de escala (com imagem)', disponivel: () => !!state.escala, dica: 'Abra a Escala Real', aba: 'escala' },
    { id: 'massa', titulo: 'Estimativa de massa corporal', disponivel: () => !!state.massa, dica: 'Use a calculadora', aba: 'massa' }
];

registrarAba({
    id: 'pdf',
    titulo: 'Relatório PDF',
    subtitulo: 'Gere um relatório com tudo o que você fez',
    descricao: 'Exporte seus resultados para portfólio ou avaliação.',
    icone: 'bi-file-earmark-pdf',
    grupo: 'desafios',
    render(container) {
        container.innerHTML = `
            <div class="pdf-layout">
                <form class="cartao" id="form-pdf" novalidate>
                    <h3><i class="bi bi-person-badge" aria-hidden="true"></i> Identificação (opcional)</h3>
                    <div class="grade-campos grade-2">
                        <div class="campo"><label for="pdf-nome">Nome do estudante</label><input id="pdf-nome" class="input" type="text" maxlength="60" autocomplete="name"></div>
                        <div class="campo"><label for="pdf-turma">Turma / escola</label><input id="pdf-turma" class="input" type="text" maxlength="60"></div>
                    </div>
                    <fieldset class="secoes-pdf">
                        <legend><h3><i class="bi bi-list-check" aria-hidden="true"></i> O que incluir</h3></legend>
                        <div id="pdf-secoes"></div>
                    </fieldset>
                    <button type="submit" class="btn btn-primario btn-lg btn-bloco" id="btn-gerar-pdf"><i class="bi bi-download" aria-hidden="true"></i> Gerar PDF</button>
                    <div id="pdf-status" class="mt" aria-live="polite"></div>
                </form>
                <aside class="cartao pdf-dica">
                    <i class="bi bi-lightbulb" aria-hidden="true"></i>
                    <h3>Como deixar o relatório completo</h3>
                    <p>As seções ficam disponíveis conforme você usa o laboratório nesta visita: conclua um quiz ou uma batalha, rode o simulador K‑Pg, faça uma comparação de escala e estime uma massa.</p>
                    <p class="texto-suave">As conquistas ficam salvas no navegador e sempre aparecem no relatório.</p>
                </aside>
            </div>
        `;
        container.querySelector('#form-pdf').addEventListener('submit', e => { e.preventDefault(); gerarPDF(); });
        renderSecoesPdf();
    },
    aoAtivar: () => renderSecoesPdf()
});

function renderSecoesPdf() {
    const div = document.getElementById('pdf-secoes');
    if (!div) return;
    const marcadas = new Set([...div.querySelectorAll('input:checked')].map(i => i.value));
    const antesIndisponiveis = new Set([...div.querySelectorAll('input:disabled')].map(i => i.value));
    const primeira = div.childElementCount === 0;
    div.innerHTML = SECOES_PDF.map(s => {
        const ok = s.disponivel();
        const checked = ok && (primeira || marcadas.has(s.id) || antesIndisponiveis.has(s.id));
        return `
            <label class="secao-pdf ${ok ? '' : 'indisponivel'}">
                <input type="checkbox" value="${s.id}" ${checked ? 'checked' : ''} ${ok ? '' : 'disabled'}>
                <span class="secao-pdf-texto">${s.titulo}</span>
                ${ok ? '<span class="chip chip-ok"><i class="bi bi-check2" aria-hidden="true"></i> Pronto</span>'
                     : `<button type="button" class="link-botao" data-action="ir" data-aba="${s.aba}">${s.dica} <i class="bi bi-arrow-right" aria-hidden="true"></i></button>`}
            </label>`;
    }).join('');
}

/** Converte texto para os caracteres suportados pela fonte padrão do jsPDF. */
function textoPdf(texto) {
    const mapa = { '≈': '~', '–': '-', '—': '-', '‑': '-', '−': '-', '“': '"', '”': '"', '‘': "'", '’': "'", '…': '...', '₂': '2', '→': '->', '•': '-' };
    return String(texto ?? '')
        .replace(/[≈–—‑−“”‘’…₂→•]/g, c => mapa[c])
        .replace(/[^\u0000-ÿ]/g, '');
}

async function _imagemGraficoKpg() {
    if (!state.simulacao || !(await carregarBiblioteca('chart'))) return null;
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 450;
    const d = state.simulacao.dados;
    const serie = (k, nome) => ({ label: nome, data: d[k], borderColor: CORES_POPULACOES[k], backgroundColor: CORES_POPULACOES[k] + '22', fill: true, pointRadius: 0, borderWidth: 3, tension: 0.3 });
    const grafico = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: { labels: d.t.map(t => formatarNumero(t, 1)), datasets: [serie('P', 'Plantas'), serie('H', 'Herbívoros'), serie('C', 'Carnívoros')] },
        options: {
            responsive: false, animation: false, devicePixelRatio: 2,
            plugins: { legend: { labels: { color: '#333', font: { size: 16 } } } },
            scales: {
                x: { title: { display: true, text: 'Anos após o impacto', color: '#333' }, ticks: { color: '#555', maxTicksLimit: 10 } },
                y: { beginAtZero: true, title: { display: true, text: 'População relativa', color: '#333' }, ticks: { color: '#555' } }
            }
        },
        plugins: [{ id: 'fundo', beforeDraw: c => { const ctx = c.ctx; ctx.save(); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height); ctx.restore(); } }]
    });
    const img = grafico.toBase64Image('image/png');
    grafico.destroy();
    return img;
}

async function _imagemEscala() {
    if (!state.escala) return null;
    const imagens = await Promise.all(state.escala.nomes.map(carregarImagemOriginal));
    if (imagens.some(i => !i)) return null;
    return comporImagensLadoALado(imagens, calcularAlturasEscala(state.escala.alturas, 360));
}

async function gerarPDF() {
    const status = document.getElementById('pdf-status');
    const botao = document.getElementById('btn-gerar-pdf');
    const secoes = new Set([...document.querySelectorAll('#pdf-secoes input:checked')].map(i => i.value));
    botao.disabled = true;
    status.innerHTML = htmlCarregando('Preparando o relatório...');

    try {
        if (!(await carregarBiblioteca('jspdf'))) {
            status.innerHTML = htmlBibliotecaIndisponivel('jsPDF (gerador de PDF)', null);
            return;
        }
        const avisos = [];
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const M = 18, LARG = 210 - 2 * M, ALT_PAG = 297, LIMITE = ALT_PAG - 20;
        let y = 0;

        const novaPagina = () => { doc.addPage(); y = 20; };
        const garantir = altura => { if (y + altura > LIMITE) novaPagina(); };
        const texto = (conteudo, { tamanho = 10.5, cor = [40, 40, 40], estilo = 'normal', recuo = 0, espaco = 1.5 } = {}) => {
            doc.setFont('helvetica', estilo);
            doc.setFontSize(tamanho);
            doc.setTextColor(...cor);
            const linhas = doc.splitTextToSize(textoPdf(conteudo), LARG - recuo);
            const alturaLinha = tamanho * 0.42;
            linhas.forEach(l => { garantir(alturaLinha); doc.text(l, M + recuo, y); y += alturaLinha; });
            y += espaco;
        };
        const secao = titulo => {
            garantir(18);
            y += 4;
            doc.setFillColor(192, 98, 45);
            doc.rect(M, y - 4.5, 1.6, 6.5, 'F');
            texto(titulo, { tamanho: 14, estilo: 'bold', cor: [26, 42, 58], recuo: 4, espaco: 3 });
        };
        const imagem = (dataUrl, larguraMm, proporcao) => {
            const h = larguraMm * proporcao;
            garantir(h + 4);
            doc.addImage(dataUrl, 'PNG', M + (LARG - larguraMm) / 2, y, larguraMm, h);
            y += h + 4;
        };

        // Cabeçalho
        doc.setFillColor(26, 42, 58);
        doc.rect(0, 0, 210, 38, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text('PaleoLab Científico', M, 17);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(240, 213, 176);
        doc.text(textoPdf('Relatório de atividades'), M, 25);
        doc.setTextColor(220, 220, 220);
        doc.text(textoPdf(new Date().toLocaleString('pt-BR')), M, 31);
        y = 48;
        const nome = document.getElementById('pdf-nome').value.trim();
        const turma = document.getElementById('pdf-turma').value.trim();
        if (nome || turma) {
            texto([nome && `Estudante: ${nome}`, turma && `Turma: ${turma}`].filter(Boolean).join('   ·   '), { tamanho: 11, estilo: 'bold' });
        }

        if (secoes.has('conquistas')) {
            secao('Conquistas');
            const obtidas = lerConquistas();
            const total = CONQUISTAS_LISTA.length;
            const n = CONQUISTAS_LISTA.filter(c => obtidas[c.id]).length;
            texto(`${n} de ${total} medalhas desbloqueadas.`, { estilo: 'bold' });
            CONQUISTAS_LISTA.forEach(c => {
                const v = obtidas[c.id];
                const data = typeof v === 'string' ? ` (em ${new Date(v).toLocaleDateString('pt-BR')})` : '';
                texto(`${v ? '[X]' : '[  ]'} ${c.titulo}${v ? data : ''} - ${c.descricao}`, { recuo: 3, cor: v ? [40, 40, 40] : [140, 140, 140], espaco: 0.8 });
            });
        }

        const secaoPartida = (titulo, partida, extra) => {
            secao(titulo);
            texto(`${extra}Pontuação: ${partida.pontuacao}/${partida.total} (${Math.round(partida.pontuacao / partida.total * 100)}%)`, { estilo: 'bold' });
            partida.perguntas.forEach((p, i) => {
                const r = partida.respostas[i];
                const ok = r === p.resposta;
                garantir(16);
                texto(`${i + 1}. ${p.pergunta}`, { estilo: 'bold', cor: ok ? [30, 110, 60] : [170, 50, 40], espaco: 0.5 });
                texto(`Sua resposta: ${p.opcoes[r] ?? 'Não respondida'} ${ok ? '(correta)' : `- Correta: ${p.opcoes[p.resposta]}`}`, { recuo: 4, espaco: 0.5 });
                if (p.explicacao) texto(p.explicacao, { recuo: 4, tamanho: 9.5, cor: [100, 100, 100], espaco: 2 });
            });
        };
        if (secoes.has('quiz') && state.quiz) secaoPartida('Quiz', state.quiz, `Nível: ${state.quiz.nivel}   ·   `);
        if (secoes.has('batalha') && state.batalha) secaoPartida('Modo Batalha', state.batalha, `Duelo: ${state.batalha.dino1.Nome} x ${state.batalha.dino2.Nome}   ·   `);

        if (secoes.has('kpg') && state.simulacao) {
            secao('Simulação da extinção K-Pg');
            const s = state.simulacao;
            const fim = k => formatarNumero(s.dados[k][s.dados[k].length - 1], 1);
            texto(`Parâmetros: bloqueio solar ${s.bloqueio}%, chuva ácida ${s.chuva}%, ${s.anos} anos simulados.`);
            texto(`Resultado: ${s.resultado.titulo}. ${s.resultado.texto}`, { estilo: 'bold' });
            texto(`Populações finais - plantas: ${fim('P')} · herbívoros: ${fim('H')} · carnívoros: ${fim('C')} (iniciais: 100 · 50 · 20).`);
            try {
                const img = await _imagemGraficoKpg();
                if (img) imagem(img, LARG, 0.5); else avisos.push('gráfico K-Pg (Chart.js indisponível)');
            } catch (e) { avisos.push('gráfico K-Pg'); }
        }

        if (secoes.has('escala') && state.escala) {
            secao('Comparação de escala');
            texto(state.escala.nomes.map((n, i) => `${n}: ${formatarNumero(state.escala.alturas[i], 1)} m de altura`).join('   ·   '));
            try {
                const img = await _imagemEscala();
                if (img) {
                    const tmp = await carregarImagem(img);
                    imagem(img, LARG, tmp.height / tmp.width);
                }
            } catch (e) {
                // Em file:// o navegador pode bloquear a leitura do canvas (SecurityError).
                avisos.push('imagem da escala (abra o site por um servidor local para incluí-la)');
            }
        }

        if (secoes.has('massa') && state.massa) {
            secao('Estimativa de massa corporal');
            const m = state.massa;
            texto(`Fêmur de ${formatarNumero(m.circCm, 1)} cm, animal ${m.postura === 'bipede' ? 'bípede' : 'quadrúpede'}: massa estimada de ${formatarMassa(m.toneladas)} (${formatarNumero(m.toneladas * 1000, 0)} kg).`);
            texto('Equação de Campione & Evans (2012): Massa = a x (circunferência em mm)^b.', { cor: [100, 100, 100], tamanho: 9.5 });
        }

        // Rodapé com numeração
        const paginas = doc.getNumberOfPages();
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(140, 140, 140);
            doc.text(textoPdf(`PaleoLab Científico v${VERSAO_APP}`), M, ALT_PAG - 10);
            doc.text(textoPdf(`Página ${i} de ${paginas}`), 210 - M, ALT_PAG - 10, { align: 'right' });
        }

        const arquivo = `relatorio_paleolab${nome ? '_' + slugNome(nome).replace(/[^a-z0-9_]/g, '') : ''}.pdf`;
        doc.save(arquivo);
        status.innerHTML = htmlAlerta(avisos.length ? 'aviso' : 'sucesso',
            `<strong>Relatório gerado!</strong> O download de <em>${escapeHtml(arquivo)}</em> deve começar automaticamente.${avisos.length ? `<br>Não foi possível incluir: ${escapeHtml(avisos.join('; '))}.` : ''}`);
    } catch (e) {
        console.error('Erro ao gerar PDF:', e);
        status.innerHTML = htmlAlerta('erro', `Erro ao gerar o PDF: ${escapeHtml(e.message)}`);
    } finally {
        botao.disabled = false;
    }
}
