// js/utils.js
// Funções utilitárias do PaleoLab.
// A maioria é PURA (não depende do DOM) para poder ser testada com Jest.
// As que usam DOM (imagens / canvas) recebem os objetos globais de forma
// tardia, o que permite simulá-los nos testes.

// ============================================================
// CAMINHOS DE IMAGENS
// ============================================================
const MAPA_ICNOFOSSEIS = {
    "Grallator": "grallator.jpg",
    "Eubrontes": "eubrontes.jpg",
    "Megalosauripus": "megalosauripus.jpg",
    "Wintonopus": "wintonopus.jpg",
    "Amblydactylus": "amblydactylus.jpg",
    "Anomoepus": "anomoepus.jpg",
    "Brontopodus": "brontopodus.jpg",
    "Parabrontopodus": "parabrontopodus.jpg"
};

/** Silhuetas usadas na Escala Real (dinossauros clássicos + referências). */
const MAPA_SILHUETAS = {
    "Tyrannosaurus rex": "trex.png",
    "Triceratops": "triceratops.png",
    "Velociraptor": "velociraptor.png",
    "Brachiosaurus": "brachiosaurus.png",
    "Stegosaurus": "stegosaurus.png",
    "Spinosaurus": "spinosaurus.png",
    "Patagotitan": "patagotitan.png",
    "Humano": "human.png",
    "Elefante": "elephant.png"
};

/** Proporções naturais (largura x altura) usadas quando falta a imagem. */
const PROPORCOES_SILHUETA = {
    "Tyrannosaurus rex": [2, 1],
    "Triceratops": [2, 1],
    "Velociraptor": [2, 1],
    "Brachiosaurus": [2, 1],
    "Stegosaurus": [2, 1],
    "Spinosaurus": [2, 1],
    "Patagotitan": [3, 1],
    "Humano": [1, 2],
    "Elefante": [2, 1]
};

/** "Tyrannosaurus rex" → "tyrannosaurus_rex" */
function slugNome(nome) {
    return String(nome || '').trim().toLowerCase().replace(/\s+/g, '_');
}

function caminhoSilhueta(nome) {
    return `assets/${MAPA_SILHUETAS[nome] || slugNome(nome) + '.png'}`;
}

function caminhoImagemFossil(nome) {
    return `assets/real_${slugNome(nome)}.png`;
}

function caminhoImagemIcnofossil(nome) {
    const arquivo = MAPA_ICNOFOSSEIS[nome];
    return arquivo ? `assets/${arquivo}` : null;
}

// ============================================================
// TEXTO E NÚMEROS
// ============================================================
function escapeHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Hash simples e determinístico (djb2) – usado para cores estáveis. */
function hashString(str) {
    let h = 5381;
    const s = String(str || '');
    for (let i = 0; i < s.length; i++) {
        h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    }
    return h;
}

/** Formata número no padrão brasileiro (vírgula decimal). */
function formatarNumero(valor, casas = 1) {
    const n = Number(valor);
    if (!Number.isFinite(n)) return '–';
    return n.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
}

/** Formata massa em toneladas escolhendo a unidade mais legível. */
function formatarMassa(toneladas) {
    const t = Number(toneladas);
    if (!Number.isFinite(t)) return '–';
    if (t < 1) return `${formatarNumero(t * 1000, 0)} kg`;
    return `${formatarNumero(t, t < 10 ? 1 : 0)} t`;
}

function debounce(fn, espera = 200) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), espera);
    };
}

// ============================================================
// ALEATORIEDADE (com gerador injetável para testes)
// ============================================================
/** Embaralha uma CÓPIA do array (Fisher–Yates). Não altera o original. */
function embaralhar(array, rng = Math.random) {
    const copia = Array.from(array || []);
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

/** Gerador pseudoaleatório com semente (mulberry32) – útil em testes. */
function criarRng(semente = 1) {
    let a = semente >>> 0;
    return function () {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// ============================================================
// ESCALA REAL
// ============================================================
/**
 * Converte alturas reais (m) em alturas em pixels, mantendo a proporção.
 * O mais alto recebe `alturaMaxPx`.
 */
function calcularAlturasEscala(alturasReais, alturaMaxPx = 300) {
    const validas = (alturasReais || []).map(Number).filter(v => Number.isFinite(v) && v > 0);
    if (validas.length === 0) return [];
    const max = Math.max(...validas);
    return alturasReais.map(a => {
        const v = Number(a);
        return Number.isFinite(v) && v > 0 ? Math.max(1, Math.round(alturaMaxPx * (v / max))) : 0;
    });
}

/** Escolhe um intervalo "redondo" para as linhas de grade da escala. */
function passoGradeMetros(alturaMaxM) {
    const passos = [0.25, 0.5, 1, 2, 5, 10, 20];
    return passos.find(p => alturaMaxM / p <= 8) || 50;
}

// ============================================================
// MASSA CORPORAL (Campione & Evans, 2012)
// ============================================================
const COEFICIENTES_MASSA = {
    bipede: { a: 0.00016, b: 2.73 },
    quadrupede: { a: 0.00049, b: 2.75 }
};

function normalizarPostura(postura) {
    const p = String(postura || '').toLowerCase();
    return p.startsWith('b') ? 'bipede' : 'quadrupede';
}

/** Massa estimada a partir da circunferência do fêmur (em cm). */
function calcularMassaFemur(circunferenciaCm, postura) {
    const c = Number(circunferenciaCm);
    if (!Number.isFinite(c) || c <= 0) return { kg: 0, toneladas: 0 };
    const { a, b } = COEFICIENTES_MASSA[normalizarPostura(postura)];
    const kg = a * Math.pow(c * 10, b);
    return { kg, toneladas: kg / 1000 };
}

/** Equação inversa: circunferência do fêmur (mm) a partir da massa (kg). */
function calcularCircunferenciaPorMassa(massaKg, postura) {
    const m = Number(massaKg);
    if (!Number.isFinite(m) || m <= 0) return 0;
    const { a, b } = COEFICIENTES_MASSA[normalizarPostura(postura)];
    return Math.pow(m / a, 1 / b);
}

// ============================================================
// SIMULAÇÃO K-Pg (Lotka–Volterra com Runge–Kutta 4)
// ============================================================
function lotkaVolterra(estado, r, a, b, d, e, f, g) {
    const [P, H, C] = estado;
    return [
        r * P - a * P * H,
        b * a * P * H - d * H - e * H * C,
        f * e * H * C - g * C
    ];
}

/**
 * @param {number} bloqueioSolar 0–100 (%)
 * @param {number} chuvaAcida 0–100 (%)
 * @param {number} anos duração simulada
 * @returns {{P:number[],H:number[],C:number[],t:number[]}}
 */
function simularExtincao(bloqueioSolar, chuvaAcida, anos) {
    const limitar = (v, min, max) => Math.min(max, Math.max(min, Number(v) || 0));
    bloqueioSolar = limitar(bloqueioSolar, 0, 100);
    chuvaAcida = limitar(chuvaAcida, 0, 100);
    anos = limitar(anos, 0, 500);

    const P0 = 100, H0 = 50, C0 = 20;
    const r = 0.4 * (1 - bloqueioSolar / 100);
    const a = 0.01;
    const b = 0.6;
    const d = 0.1 + (chuvaAcida / 100) * 0.05;
    const e = 0.02;
    const f = 0.3;
    const g = 0.15 + (chuvaAcida / 100) * 0.02;

    const dt = 0.5;
    const n = Math.floor(anos / dt);
    const resultados = { P: [P0], H: [H0], C: [C0], t: [0] };
    const s = [P0, H0, C0];
    const passo = (k, fator) => [s[0] + fator * k[0], s[1] + fator * k[1], s[2] + fator * k[2]];

    for (let i = 0; i < n; i++) {
        const k1 = lotkaVolterra(s, r, a, b, d, e, f, g);
        const k2 = lotkaVolterra(passo(k1, dt / 2), r, a, b, d, e, f, g);
        const k3 = lotkaVolterra(passo(k2, dt / 2), r, a, b, d, e, f, g);
        const k4 = lotkaVolterra(passo(k3, dt), r, a, b, d, e, f, g);
        for (let j = 0; j < 3; j++) {
            s[j] = Math.max(0, s[j] + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
        }
        resultados.P.push(s[0]);
        resultados.H.push(s[1]);
        resultados.C.push(s[2]);
        resultados.t.push((i + 1) * dt);
    }
    return resultados;
}

/** Classifica o estado final do ecossistema simulado. */
function classificarEcossistema(dados) {
    const ultimo = arr => arr[arr.length - 1];
    const P = ultimo(dados.P), H = ultimo(dados.H), C = ultimo(dados.C);
    if (P < 1) return { nivel: 'colapso', titulo: 'Colapso total', texto: 'As plantas desapareceram e toda a cadeia alimentar entrou em colapso.' };
    if (H < 5) return { nivel: 'devastado', titulo: 'Ecossistema devastado', texto: 'As plantas resistem, mas os herbívoros quase desapareceram.' };
    if (C < 1) return { nivel: 'instavel', titulo: 'Ecossistema instável', texto: 'Os predadores de topo foram extintos; os herbívoros ficam sem controle.' };
    return { nivel: 'estavel', titulo: 'Ecossistema estável', texto: 'As três populações sobreviveram ao impacto.' };
}

// ============================================================
// ICNOFÓSSEIS
// ============================================================
function identificarIcnogenus(dedos, garras, tamanho, forma, proporcao) {
    if (Number(dedos) === 3) {
        if (garras) {
            if (tamanho === "pequeno") return "Grallator";
            return forma === "alongada" ? "Eubrontes" : "Megalosauripus";
        }
        return tamanho === "pequeno" ? "Wintonopus" : "Amblydactylus";
    }
    if (garras) return "Anomoepus";
    return proporcao === "larga" ? "Brontopodus" : "Parabrontopodus";
}

/** Quais perguntas extras fazem sentido para a combinação dedos/garras. */
function perguntasExtrasIcno(dedos, garras) {
    const extras = [];
    if (Number(dedos) === 3) {
        extras.push('tamanho');
        if (garras) extras.push('forma');
    } else if (!garras) {
        extras.push('proporcao');
    }
    return extras;
}

// ============================================================
// LINHA DO TEMPO
// ============================================================
function periodoPorIdade(idadeMa, periodos) {
    const idade = Number(idadeMa);
    return (periodos || []).find(p => idade <= p.inicio && idade >= p.fim) || null;
}

const ORDEM_PERIODOS = { 'Triássico': 0, 'Jurássico': 1, 'Cretáceo': 2 };
const ORDEM_SUBPERIODOS = { 'Inferior': 0, 'Médio': 1, 'Superior': 2 };

function extrairPeriodo(texto) {
    return Object.keys(ORDEM_PERIODOS).find(p => String(texto || '').includes(p)) || null;
}

/** Posição cronológica (menor = mais antigo). */
function rankPeriodo(texto) {
    const p = extrairPeriodo(texto);
    if (p === null) return null;
    const sub = Object.keys(ORDEM_SUBPERIODOS).find(s => String(texto).includes(s));
    return ORDEM_PERIODOS[p] * 3 + (sub ? ORDEM_SUBPERIODOS[sub] : 1);
}

function dinossaurosDoPeriodo(nomePeriodo, lista) {
    return (lista || []).filter(d => extrairPeriodo(d.Periodo) === nomePeriodo);
}

// ============================================================
// QUIZ
// ============================================================
/**
 * Prepara uma rodada: embaralha as perguntas e as alternativas,
 * remapeando o índice da resposta correta.
 */
function prepararQuiz(perguntas, { quantidade = null, rng = Math.random, embaralharOpcoes = true } = {}) {
    let lista = embaralhar(perguntas, rng);
    if (quantidade && quantidade < lista.length) lista = lista.slice(0, quantidade);
    return lista.map(p => {
        // Alternativas do tipo "Nenhuma das anteriores" dependem da ordem.
        const dependeDaOrdem = p.opcoes.some(o => /anteriores|todas/i.test(o));
        if (!embaralharOpcoes || dependeDaOrdem) return { ...p, opcoes: [...p.opcoes] };
        const indices = embaralhar(p.opcoes.map((_, i) => i), rng);
        return {
            ...p,
            opcoes: indices.map(i => p.opcoes[i]),
            resposta: indices.indexOf(p.resposta)
        };
    });
}

// ============================================================
// MODO BATALHA – perguntas comparativas geradas dinamicamente
// ============================================================
const EMPATE = 'Empate (valores iguais)';
const MESMA_EPOCA = 'Viveram na mesma época';
const _ehEmpate = p => [EMPATE, MESMA_EPOCA].includes(p.opcoes[p.resposta]);

function _perguntaAtributo(d1, d2, chave, rotulo, unidade, sentido, rng) {
    const v1 = Number(d1[chave]), v2 = Number(d2[chave]);
    if (!Number.isFinite(v1) || !Number.isFinite(v2)) return null;
    let correta;
    if (v1 === v2) correta = EMPATE;
    else if (sentido === 'maior') correta = v1 > v2 ? d1.Nome : d2.Nome;
    else correta = v1 < v2 ? d1.Nome : d2.Nome;
    const opcoes = [...embaralhar([d1.Nome, d2.Nome], rng), EMPATE];
    const fmt = v => (chave === 'Peso' ? formatarMassa(v) : `${formatarNumero(v, 1)} ${unidade}`);
    return {
        tipo: `${chave}-${sentido}`,
        pergunta: `Qual dos dois ${rotulo}?`,
        opcoes,
        resposta: opcoes.indexOf(correta),
        explicacao: `${d1.Nome}: ${fmt(v1)} · ${d2.Nome}: ${fmt(v2)}.`
    };
}

/**
 * Gera `quantidade` perguntas comparando dois dinossauros.
 * Sempre há perguntas suficientes, pois comparações com empate
 * também são válidas ("Empate").
 */
function gerarPerguntasBatalha(dino1, dino2, quantidade = 5, rng = Math.random) {
    if (!dino1 || !dino2) return [];
    const candidatas = [
        _perguntaAtributo(dino1, dino2, 'Peso', 'era mais pesado', 't', 'maior', rng),
        _perguntaAtributo(dino1, dino2, 'Peso', 'era mais leve', 't', 'menor', rng),
        _perguntaAtributo(dino1, dino2, 'Comprimento', 'era mais comprido', 'm', 'maior', rng),
        _perguntaAtributo(dino1, dino2, 'Altura', 'era mais alto', 'm', 'maior', rng)
    ];

    // Período (mais antigo)
    const r1 = rankPeriodo(dino1.Periodo), r2 = rankPeriodo(dino2.Periodo);
    if (r1 !== null && r2 !== null) {
        const mesma = MESMA_EPOCA;
        const correta = r1 === r2 ? mesma : (r1 < r2 ? dino1.Nome : dino2.Nome);
        const opcoes = [...embaralhar([dino1.Nome, dino2.Nome], rng), mesma];
        candidatas.push({
            tipo: 'periodo',
            pergunta: 'Qual dos dois viveu primeiro (é mais antigo)?',
            opcoes,
            resposta: opcoes.indexOf(correta),
            explicacao: `${dino1.Nome}: ${dino1.Periodo} · ${dino2.Nome}: ${dino2.Periodo}.`
        });
    }

    // Dieta (só quando são diferentes)
    if (dino1.Dieta && dino2.Dieta && dino1.Dieta !== dino2.Dieta) {
        const alvo = rng() < 0.5 ? dino1 : dino2;
        const opcoes = embaralhar([dino1.Nome, dino2.Nome], rng);
        candidatas.push({
            tipo: 'dieta',
            pergunta: `Qual dos dois era ${alvo.Dieta.toLowerCase()}?`,
            opcoes,
            resposta: opcoes.indexOf(alvo.Nome),
            explicacao: `${dino1.Nome} era ${dino1.Dieta.toLowerCase()}; ${dino2.Nome} era ${dino2.Dieta.toLowerCase()}.`
        });
    }

    // Postura (bípede x quadrúpede)
    if (dino1.Postura !== dino2.Postura && [dino1.Postura, dino2.Postura].includes('Bípede')) {
        const bipede = dino1.Postura === 'Bípede' ? dino1 : dino2;
        const opcoes = embaralhar([dino1.Nome, dino2.Nome], rng);
        candidatas.push({
            tipo: 'postura',
            pergunta: 'Qual dos dois andava apenas sobre duas patas?',
            opcoes,
            resposta: opcoes.indexOf(bipede.Nome),
            explicacao: `${dino1.Nome}: ${dino1.Postura} · ${dino2.Nome}: ${dino2.Postura}.`
        });
    }

    // Razão de massas (com distratores numéricos)
    const maiorP = Math.max(dino1.Peso, dino2.Peso), menorP = Math.min(dino1.Peso, dino2.Peso);
    if (menorP > 0 && maiorP / menorP >= 2) {
        const razao = maiorP / menorP;
        const arred = v => (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10);
        const correta = arred(razao);
        const valores = new Set([correta]);
        [0.25, 0.5, 2, 4, 3].forEach(m => { if (valores.size < 4) valores.add(arred(Math.max(1.1, razao * m))); });
        const pesado = dino1.Peso >= dino2.Peso ? dino1 : dino2;
        const leve = pesado === dino1 ? dino2 : dino1;
        const opcoes = embaralhar([...valores].map(v => `≈ ${formatarNumero(v, v >= 10 ? 0 : 1)} vezes`), rng);
        candidatas.push({
            tipo: 'razao',
            pergunta: `Aproximadamente quantas vezes ${pesado.Nome} era mais pesado que ${leve.Nome}?`,
            opcoes,
            resposta: opcoes.indexOf(`≈ ${formatarNumero(correta, correta >= 10 ? 0 : 1)} vezes`),
            explicacao: `${formatarMassa(pesado.Peso)} ÷ ${formatarMassa(leve.Peso)} ≈ ${formatarNumero(razao, 1)}.`
        });
    }

    const validas = candidatas.filter(p => p && p.resposta >= 0);
    // Prioriza perguntas sem empate (mais interessantes) e completa com as demais.
    const semEmpate = embaralhar(validas.filter(p => !_ehEmpate(p)), rng);
    const comEmpate = embaralhar(validas.filter(_ehEmpate), rng);
    return [...semEmpate, ...comEmpate].slice(0, quantidade);
}

// ============================================================
// VIAGEM NO TEMPO (épocas e globo)
// ============================================================
/** Época (ex.: "Jurássico Superior") que contém a idade, em milhões de anos. */
function epocaPorIdade(idadeMa, epocas) {
    const idade = Number(idadeMa);
    return (epocas || []).find(e => idade <= e.inicio && idade >= e.fim) || null;
}

/** Era disponível no globo mais próxima da idade escolhida (empate: a mais antiga). */
function eraGloboMaisProxima(idadeMa, eras) {
    const idade = Number(idadeMa);
    if (!eras || !eras.length || !Number.isFinite(idade)) return null;
    return eras.reduce((melhor, era) => {
        const d = Math.abs(era - idade), dm = Math.abs(melhor - idade);
        return d < dm || (d === dm && era > melhor) ? era : melhor;
    });
}

/** Espécies cujo campo Periodo é exatamente a época (ex.: "Cretáceo Superior"). */
function dinossaurosDaEpoca(nomeEpoca, lista) {
    return (lista || []).filter(d => d.Periodo === nomeEpoca);
}

// ============================================================
// PALEO-DETETIVE (escolher o provável autor da pegada)
// ============================================================
/**
 * Monta as alternativas de uma rodada: o autor correto e um dinossauro de cada
 * um dos outros grupos (assim nunca há duas respostas plausíveis).
 * @returns {{opcoes: string[], correta: string}}
 */
function gerarOpcoesIcno(icnogenero, autores, distratoresExtras, rng = Math.random) {
    const certo = autores[icnogenero];
    if (!certo) return { opcoes: [], correta: null };
    const porGrupo = {};
    Object.values(autores).forEach(a => { (porGrupo[a.grupo] = porGrupo[a.grupo] || []).push(a.exemplo); });
    const sortear = lista => lista[Math.floor(rng() * lista.length)];
    const erradas = Object.keys(porGrupo)
        .filter(g => g !== certo.grupo)
        .map(g => sortear([...new Set(porGrupo[g])]));
    if (distratoresExtras && distratoresExtras.length) erradas.push(sortear(distratoresExtras));
    return { opcoes: embaralhar([certo.exemplo, ...erradas], rng), correta: certo.exemplo };
}

// ============================================================
// ÁRVORE EVOLUTIVA
// ============================================================
/** Estrutura hierárquica { nome, filhos[] } a partir das arestas [pai, filho]. */
function construirArvore(arestas, raiz = 'Reptilia') {
    const filhos = {};
    (arestas || []).forEach(([pai, filho]) => { (filhos[pai] = filhos[pai] || []).push(filho); });
    const montar = nome => ({ nome, filhos: (filhos[nome] || []).map(montar) });
    return montar(raiz);
}

/** O próprio clado e todos os seus descendentes. */
function cladoEDescendentes(clado, arestas) {
    const resultado = [clado];
    for (let i = 0; i < resultado.length; i++) {
        (arestas || []).forEach(([pai, filho]) => { if (pai === resultado[i]) resultado.push(filho); });
    }
    return resultado;
}

/** Espécies do museu que pertencem ao clado (direta ou indiretamente). */
function exemplosDoClado(clado, arestas, mapaClados, lista) {
    const grupos = new Set(cladoEDescendentes(clado, arestas));
    return (lista || []).filter(d => grupos.has(mapaClados[d.Nome]));
}

// ============================================================
// IMAGENS (dependem do DOM)
// ============================================================
/** Carrega uma imagem; resolve com o elemento ou `null` em caso de erro. */
function carregarImagem(src) {
    return new Promise(resolve => {
        if (!src) { resolve(null); return; }
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

/**
 * Carrega a silhueta de um animal da Escala Real.
 * Se o arquivo não existir, gera um placeholder com a proporção correta.
 * @returns {Promise<HTMLImageElement>}
 */
async function carregarImagemOriginal(nome) {
    const img = await carregarImagem(caminhoSilhueta(nome));
    if (img) return img;
    const [pw, ph] = PROPORCOES_SILHUETA[nome] || [1, 1];
    const fallback = await carregarImagem(gerarSilhuetaPlaceholder(nome, 200 * pw, 200 * ph));
    return fallback;
}

/** Resolve com o caminho da foto do fóssil ou com um placeholder (data URL). */
async function carregarImagemFossilReal(nome) {
    const caminho = caminhoImagemFossil(nome);
    const img = await carregarImagem(caminho);
    return img ? caminho : gerarSilhuetaPlaceholder(nome, 300, 200);
}

/** Resolve com o caminho da pegada ou com um placeholder (data URL). */
async function carregarImagemIcnofossil(nome) {
    const caminho = caminhoImagemIcnofossil(nome);
    const img = caminho ? await carregarImagem(caminho) : null;
    return img ? caminho : gerarSilhuetaPlaceholder('pegada', 200, 200);
}

/**
 * Desenha várias imagens lado a lado, alinhadas pela base, num canvas.
 * Usado na exportação do PDF. Pode lançar SecurityError em file:// (canvas "contaminado").
 */
function comporImagensLadoALado(imagens, alturasPx, { espaco = 24, fundo = '#ffffff' } = {}) {
    const larguras = imagens.map((img, i) => Math.round(img.width * (alturasPx[i] / img.height)));
    const altura = Math.max(...alturasPx);
    const canvas = document.createElement('canvas');
    canvas.width = larguras.reduce((s, w) => s + w, 0) + espaco * (imagens.length + 1);
    canvas.height = altura + espaco * 2;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let x = espaco;
    imagens.forEach((img, i) => {
        ctx.drawImage(img, x, espaco + altura - alturasPx[i], larguras[i], alturasPx[i]);
        x += larguras[i] + espaco;
    });
    return canvas.toDataURL('image/png');
}

// ============================================================
// SILHUETA PLACEHOLDER (desenho estilizado em canvas)
// ============================================================
/**
 * Silhueta de um dinossauro bípede genérico (corpo, cauda, pescoço e cabeça
 * num só contorno), usada quando falta a foto de uma espécie.
 */
function desenharDinossauroGenerico(ctx, largura, altura, cor) {
    // Desenha numa área de 200 x 120 centralizada e proporcional
    const e = Math.min(largura / 200, altura / 130);
    const ox = (largura - 200 * e) / 2;
    const oy = (altura - 120 * e) / 2;
    const p = (x, y) => [ox + x * e, oy + y * e];

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(...p(100, 113), 60 * e, 5 * e, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = cor;
    // Pernas (atrás do corpo)
    const perna = (x1, x2, joelhoX) => {
        ctx.beginPath();
        ctx.moveTo(...p(x1, 62));
        ctx.quadraticCurveTo(...p(joelhoX, 82), ...p(x1 + 2, 108));
        ctx.lineTo(...p(x1 + 12, 110));
        ctx.lineTo(...p(x1 + 10, 104));
        ctx.quadraticCurveTo(...p(joelhoX + 12, 84), ...p(x2, 64));
        ctx.closePath();
        ctx.fill();
    };
    perna(88, 108, 84);
    ctx.globalAlpha = 0.75;
    perna(102, 120, 98);
    ctx.globalAlpha = 1;

    // Corpo + cauda + pescoço + cabeça
    ctx.beginPath();
    ctx.moveTo(...p(8, 52));                                  // ponta da cauda
    ctx.quadraticCurveTo(...p(50, 40), ...p(82, 42));        // dorso da cauda
    ctx.quadraticCurveTo(...p(112, 30), ...p(136, 40));      // costas
    ctx.quadraticCurveTo(...p(150, 30), ...p(156, 18));      // pescoço
    ctx.quadraticCurveTo(...p(162, 8), ...p(176, 10));       // topo da cabeça
    ctx.quadraticCurveTo(...p(194, 12), ...p(194, 20));      // focinho
    ctx.quadraticCurveTo(...p(184, 26), ...p(170, 26));      // mandíbula
    ctx.quadraticCurveTo(...p(162, 36), ...p(150, 52));      // garganta
    ctx.quadraticCurveTo(...p(140, 70), ...p(112, 70));      // peito e barriga
    ctx.quadraticCurveTo(...p(86, 70), ...p(70, 58));        // quadril
    ctx.quadraticCurveTo(...p(40, 58), ...p(8, 52));         // base da cauda
    ctx.closePath();
    ctx.fill();

    // Braço
    ctx.lineWidth = 4 * e;
    ctx.lineCap = 'round';
    ctx.strokeStyle = cor;
    ctx.beginPath();
    ctx.moveTo(...p(140, 54));
    ctx.quadraticCurveTo(...p(148, 64), ...p(156, 62));
    ctx.stroke();

    // Olho
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(...p(178, 16), 2.2 * e, 0, 2 * Math.PI);
    ctx.fill();
}

function gerarSilhuetaPlaceholder(nome, largura = 200, altura = 200) {
    nome = String(nome || '');
    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, largura, altura);

    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, largura, altura);

    // ============================================================
    // PEGADA (icnofóssil)
    // ============================================================
    if (nome.toLowerCase().includes('pegada')) {
        const cx = largura / 2;
        const cy = altura / 2;
        const escala = Math.min(largura, altura) / 200;

        ctx.fillStyle = '#495057';
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 2;

        // Palma
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10 * escala, 25 * escala, 15 * escala, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Dedo 1 (esquerdo)
        ctx.beginPath();
        ctx.moveTo(cx - 20 * escala, cy + 5 * escala);
        ctx.lineTo(cx - 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx - 25 * escala, cy - 35 * escala);
        ctx.lineTo(cx - 10 * escala, cy - 5 * escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx - 40 * escala, cy - 40 * escala);
        ctx.lineTo(cx - 30 * escala, cy - 35 * escala);
        ctx.closePath();
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#212529';
        ctx.fillStyle = '#495057';

        // Dedo 2 (central)
        ctx.beginPath();
        ctx.moveTo(cx, cy + 5 * escala);
        ctx.lineTo(cx, cy - 40 * escala);
        ctx.lineTo(cx + 10 * escala, cy - 45 * escala);
        ctx.lineTo(cx + 10 * escala, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 40 * escala);
        ctx.lineTo(cx - 5 * escala, cy - 50 * escala);
        ctx.lineTo(cx + 5 * escala, cy - 45 * escala);
        ctx.closePath();
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#212529';
        ctx.fillStyle = '#495057';

        // Dedo 3 (direito)
        ctx.beginPath();
        ctx.moveTo(cx + 20 * escala, cy + 5 * escala);
        ctx.lineTo(cx + 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx + 25 * escala, cy - 35 * escala);
        ctx.lineTo(cx + 10 * escala, cy - 5 * escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx + 40 * escala, cy - 40 * escala);
        ctx.lineTo(cx + 30 * escala, cy - 35 * escala);
        ctx.closePath();
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#212529';

        ctx.fillStyle = '#6c757d';
        ctx.font = `${14 * escala}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('👣', cx, cy + 60 * escala);

        return canvas.toDataURL('image/png');
    }

    // ============================================================
    // CORES E ESTILOS PARA OUTROS
    // ============================================================
    const cores = ['#6c757d', '#495057', '#343a40', '#5a6268', '#4e555b'];
    // Cor determinística (mesmo nome → mesma cor), o que permite testes reprodutíveis
    let cor = cores[hashString(nome) % cores.length];
    if (nome.toLowerCase().includes('humano')) cor = '#f8c291';
    if (nome.toLowerCase().includes('elefante')) cor = '#6b5b4f';

    ctx.fillStyle = cor;
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 2;

    const cx = largura / 2;
    const cy = altura / 2;
    const escala = Math.min(largura, altura) / 200;

    const nomeMin = nome.toLowerCase();
    if (!nomeMin.includes('humano') && !nomeMin.includes('elefante')) {
        desenharDinossauroGenerico(ctx, largura, altura, cor);
        return canvas.toDataURL('image/png');
    }

    // Base do corpo (humano e elefante)
    ctx.beginPath();
    ctx.moveTo(cx - 60*escala, cy + 40*escala);
    ctx.quadraticCurveTo(cx - 80*escala, cy - 10*escala, cx - 50*escala, cy - 40*escala);
    ctx.quadraticCurveTo(cx - 20*escala, cy - 70*escala, cx + 20*escala, cy - 60*escala);
    ctx.quadraticCurveTo(cx + 60*escala, cy - 50*escala, cx + 80*escala, cy - 10*escala);
    ctx.quadraticCurveTo(cx + 90*escala, cy + 20*escala, cx + 70*escala, cy + 40*escala);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (!nome.toLowerCase().includes('humano') && !nome.toLowerCase().includes('elefante')) {
        // desenho de cabeça e detalhes de dinossauro
        ctx.beginPath();
        ctx.moveTo(cx - 10*escala, cy - 40*escala);
        ctx.quadraticCurveTo(cx - 20*escala, cy - 70*escala, cx + 10*escala, cy - 90*escala);
        ctx.quadraticCurveTo(cx + 40*escala, cy - 100*escala, cx + 50*escala, cy - 80*escala);
        ctx.quadraticCurveTo(cx + 30*escala, cy - 60*escala, cx + 20*escala, cy - 50*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(cx + 30*escala, cy - 85*escala, 6*escala, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#212529';
        ctx.beginPath();
        ctx.arc(cx + 32*escala, cy - 85*escala, 3*escala, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = cor;
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 40*escala, cy + 40*escala);
        ctx.lineTo(cx - 50*escala, cy + 70*escala);
        ctx.lineTo(cx - 30*escala, cy + 70*escala);
        ctx.lineTo(cx - 20*escala, cy + 40*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 40*escala, cy + 40*escala);
        ctx.lineTo(cx + 50*escala, cy + 70*escala);
        ctx.lineTo(cx + 70*escala, cy + 70*escala);
        ctx.lineTo(cx + 60*escala, cy + 40*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 60*escala, cy + 20*escala);
        ctx.quadraticCurveTo(cx - 90*escala, cy + 30*escala, cx - 100*escala, cy + 10*escala);
        ctx.quadraticCurveTo(cx - 80*escala, cy - 10*escala, cx - 50*escala, cy + 10*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (nome.toLowerCase().includes('humano')) {
        // Desenho humano
        ctx.fillStyle = cor;
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy - 50*escala, 25*escala, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 20*escala, cy - 30*escala);
        ctx.lineTo(cx - 15*escala, cy + 30*escala);
        ctx.lineTo(cx + 15*escala, cy + 30*escala);
        ctx.lineTo(cx + 20*escala, cy - 30*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 15*escala, cy - 10*escala);
        ctx.lineTo(cx - 40*escala, cy + 10*escala);
        ctx.lineTo(cx - 30*escala, cy + 20*escala);
        ctx.lineTo(cx - 10*escala, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 15*escala, cy - 10*escala);
        ctx.lineTo(cx + 40*escala, cy + 10*escala);
        ctx.lineTo(cx + 30*escala, cy + 20*escala);
        ctx.lineTo(cx + 10*escala, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 10*escala, cy + 30*escala);
        ctx.lineTo(cx - 15*escala, cy + 70*escala);
        ctx.lineTo(cx + 5*escala, cy + 70*escala);
        ctx.lineTo(cx + 5*escala, cy + 30*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 10*escala, cy + 30*escala);
        ctx.lineTo(cx + 15*escala, cy + 70*escala);
        ctx.lineTo(cx + 30*escala, cy + 70*escala);
        ctx.lineTo(cx + 20*escala, cy + 30*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    } else if (nome.toLowerCase().includes('elefante')) {
        // Desenho elefante
        ctx.fillStyle = cor;
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10*escala, 50*escala, 35*escala, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx + 50*escala, cy - 20*escala, 30*escala, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 70*escala, cy - 10*escala);
        ctx.quadraticCurveTo(cx + 90*escala, cy + 20*escala, cx + 80*escala, cy + 40*escala);
        ctx.lineTo(cx + 70*escala, cy + 30*escala);
        ctx.quadraticCurveTo(cx + 75*escala, cy + 10*escala, cx + 65*escala, cy - 5*escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(cx + 60*escala, cy - 25*escala, 6*escala, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#212529';
        ctx.beginPath();
        ctx.arc(cx + 62*escala, cy - 25*escala, 3*escala, 0, 2 * Math.PI);
        ctx.fill();
        const pernas = [[-30, 40, -25, 70], [30, 40, 25, 70], [-20, 40, -15, 70], [20, 40, 15, 70]];
        pernas.forEach(([x1, y1, x2, y2]) => {
            ctx.beginPath();
            ctx.moveTo(cx + x1*escala, cy + y1*escala);
            ctx.lineTo(cx + x2*escala, cy + y2*escala);
            ctx.lineTo(cx + (x2+10)*escala, cy + y2*escala);
            ctx.lineTo(cx + (x1+10)*escala, cy + y1*escala);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });
        ctx.beginPath();
        ctx.ellipse(cx + 40*escala, cy - 20*escala, 15*escala, 25*escala, -0.3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    return canvas.toDataURL('image/png');
}

// ============================================================
// Export para ambiente Node/Jest
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MAPA_ICNOFOSSEIS,
        MAPA_SILHUETAS,
        slugNome,
        caminhoSilhueta,
        caminhoImagemFossil,
        caminhoImagemIcnofossil,
        escapeHtml,
        hashString,
        formatarNumero,
        formatarMassa,
        debounce,
        embaralhar,
        criarRng,
        calcularAlturasEscala,
        passoGradeMetros,
        COEFICIENTES_MASSA,
        normalizarPostura,
        calcularMassaFemur,
        calcularCircunferenciaPorMassa,
        lotkaVolterra,
        simularExtincao,
        classificarEcossistema,
        identificarIcnogenus,
        perguntasExtrasIcno,
        periodoPorIdade,
        extrairPeriodo,
        rankPeriodo,
        dinossaurosDoPeriodo,
        prepararQuiz,
        EMPATE,
        gerarPerguntasBatalha,
        epocaPorIdade,
        eraGloboMaisProxima,
        dinossaurosDaEpoca,
        gerarOpcoesIcno,
        construirArvore,
        cladoEDescendentes,
        exemplosDoClado,
        carregarImagem,
        carregarImagemOriginal,
        carregarImagemFossilReal,
        carregarImagemIcnofossil,
        comporImagensLadoALado,
        gerarSilhuetaPlaceholder
    };
}
