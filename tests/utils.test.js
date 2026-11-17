/**
 * Testes das funções puras de js/utils.js
 */
const u = require('../js/utils.js');
const { DINOSSAUROS_REAIS, QUIZ, PERIODOS, ICNOFOSSEIS } = require('../js/data.js');

describe('identificarIcnogenus', () => {
    test.each([
        [3, true, 'pequeno', null, null, 'Grallator'],
        [3, true, 'grande', 'alongada', null, 'Eubrontes'],
        [3, true, 'grande', 'larga', null, 'Megalosauripus'],
        [3, false, 'pequeno', null, null, 'Wintonopus'],
        [3, false, 'grande', null, null, 'Amblydactylus'],
        [4, true, null, null, null, 'Anomoepus'],
        [4, false, null, null, 'larga', 'Brontopodus'],
        [4, false, null, null, 'alongada', 'Parabrontopodus']
    ])('dedos=%s garras=%s tamanho=%s forma=%s proporcao=%s → %s', (dedos, garras, tamanho, forma, proporcao, esperado) => {
        expect(u.identificarIcnogenus(dedos, garras, tamanho, forma, proporcao)).toBe(esperado);
    });

    test('aceita o número de dedos como string (valor vindo do formulário)', () => {
        expect(u.identificarIcnogenus('3', true, 'pequeno')).toBe('Grallator');
    });

    test('todos os icnogêneros do banco de dados são alcançáveis pela chave', () => {
        const alcancaveis = new Set();
        [3, 4].forEach(d => [true, false].forEach(g => ['pequeno', 'grande'].forEach(t =>
            ['alongada', 'larga'].forEach(f => ['larga', 'alongada'].forEach(p =>
                alcancaveis.add(u.identificarIcnogenus(d, g, t, f, p)))))));
        expect([...alcancaveis].sort()).toEqual(Object.keys(ICNOFOSSEIS).sort());
    });
});

describe('perguntasExtrasIcno', () => {
    test('3 dedos com garras pergunta tamanho e forma', () => {
        expect(u.perguntasExtrasIcno(3, true)).toEqual(['tamanho', 'forma']);
    });
    test('3 dedos sem garras pergunta só o tamanho', () => {
        expect(u.perguntasExtrasIcno('3', false)).toEqual(['tamanho']);
    });
    test('4 dedos sem garras pergunta a proporção', () => {
        expect(u.perguntasExtrasIcno(4, false)).toEqual(['proporcao']);
    });
    test('4 dedos com garras não precisa de perguntas extras', () => {
        expect(u.perguntasExtrasIcno(4, true)).toEqual([]);
    });
});

describe('simularExtincao (Lotka–Volterra + RK4)', () => {
    test('começa com as populações iniciais 100/50/20 em t = 0', () => {
        const r = u.simularExtincao(15, 40, 30);
        expect([r.P[0], r.H[0], r.C[0], r.t[0]]).toEqual([100, 50, 20, 0]);
    });

    test('gera um ponto a cada 0,5 ano (dt = 0,5)', () => {
        const r = u.simularExtincao(15, 40, 30);
        expect(r.P).toHaveLength(61);
        expect(r.t[1]).toBeCloseTo(0.5);
        expect(r.t[60]).toBeCloseTo(30);
    });

    test.each([
        [15, 40, 30, 244.1621, 44.0401, 46.5335],
        [60, 50, 30, 23.4995, 8.6338, 6.9912],
        [95, 90, 50, 34.6784, 1.6299, 0.0155],
        [0, 0, 10, 175.6443, 47.2474, 35.0848]
    ])('valores de referência: bloqueio=%s%% chuva=%s%% anos=%s', (b, c, a, P, H, C) => {
        const r = u.simularExtincao(b, c, a);
        const fim = k => r[k][r[k].length - 1];
        expect(fim('P')).toBeCloseTo(P, 3);
        expect(fim('H')).toBeCloseTo(H, 3);
        expect(fim('C')).toBeCloseTo(C, 3);
    });

    test('nenhuma população fica negativa, mesmo em cenários extremos', () => {
        const r = u.simularExtincao(100, 100, 50);
        ['P', 'H', 'C'].forEach(k => r[k].forEach(v => expect(v).toBeGreaterThanOrEqual(0)));
    });

    test('limita entradas fora do intervalo', () => {
        expect(u.simularExtincao(150, -10, 10)).toEqual(u.simularExtincao(100, 0, 10));
    });

    test('lotkaVolterra calcula as derivadas corretamente', () => {
        const [dP, dH, dC] = u.lotkaVolterra([100, 50, 20], 0.4, 0.01, 0.6, 0.1, 0.02, 0.3, 0.15);
        expect(dP).toBeCloseTo(0.4 * 100 - 0.01 * 100 * 50);
        expect(dH).toBeCloseTo(0.6 * 0.01 * 100 * 50 - 0.1 * 50 - 0.02 * 50 * 20);
        expect(dC).toBeCloseTo(0.3 * 0.02 * 50 * 20 - 0.15 * 20);
    });
});

describe('classificarEcossistema', () => {
    const serie = (P, H, C) => ({ P: [100, P], H: [50, H], C: [20, C] });
    test.each([
        [serie(0.5, 10, 5), 'colapso'],
        [serie(10, 2, 5), 'devastado'],
        [serie(10, 10, 0.5), 'instavel'],
        [serie(10, 10, 5), 'estavel']
    ])('%#: classifica corretamente', (dados, nivel) => {
        expect(u.classificarEcossistema(dados).nivel).toBe(nivel);
    });
});

describe('massa corporal (Campione & Evans, 2012)', () => {
    test('bípede: a = 0,00016, b = 2,73', () => {
        const { kg } = u.calcularMassaFemur(50, 'bipede');
        expect(kg).toBeCloseTo(0.00016 * Math.pow(500, 2.73), 6);
    });
    test('quadrúpede: a = 0,00049, b = 2,75', () => {
        const { kg, toneladas } = u.calcularMassaFemur(50, 'quadrupede');
        expect(kg).toBeCloseTo(0.00049 * Math.pow(500, 2.75), 6);
        expect(toneladas).toBeCloseTo(kg / 1000, 9);
    });
    test('aceita "Bípede"/"Quadrúpede" com acento', () => {
        expect(u.calcularMassaFemur(40, 'Bípede')).toEqual(u.calcularMassaFemur(40, 'bipede'));
        expect(u.calcularMassaFemur(40, 'Quadrúpede')).toEqual(u.calcularMassaFemur(40, 'quadrupede'));
    });
    test('valores inválidos retornam zero', () => {
        expect(u.calcularMassaFemur(-5, 'bipede')).toEqual({ kg: 0, toneladas: 0 });
        expect(u.calcularMassaFemur('abc', 'bipede')).toEqual({ kg: 0, toneladas: 0 });
        expect(u.calcularCircunferenciaPorMassa(0, 'bipede')).toBe(0);
    });
    test('a equação inversa desfaz a direta', () => {
        ['bipede', 'quadrupede'].forEach(p => {
            const { kg } = u.calcularMassaFemur(63.2, p);
            expect(u.calcularCircunferenciaPorMassa(kg, p)).toBeCloseTo(632, 6);
        });
    });
});

describe('escala real', () => {
    test('o mais alto recebe a altura máxima e os demais ficam proporcionais', () => {
        expect(u.calcularAlturasEscala([4, 1.7], 300)).toEqual([300, 128]);
        expect(u.calcularAlturasEscala([1.7, 3.3, 12], 400)).toEqual([57, 110, 400]);
    });
    test('valores inválidos viram 0 e lista vazia retorna []', () => {
        expect(u.calcularAlturasEscala([2, 0, 'x'], 100)).toEqual([100, 0, 0]);
        expect(u.calcularAlturasEscala([], 100)).toEqual([]);
    });
    test('passo da grade gera no máximo 8 linhas', () => {
        [0.5, 1.7, 4, 12, 18, 40].forEach(h => expect(h / u.passoGradeMetros(h)).toBeLessThanOrEqual(8));
        expect(u.passoGradeMetros(4)).toBe(0.5);
        expect(u.passoGradeMetros(12)).toBe(2);
    });
});

describe('aleatoriedade', () => {
    test('embaralhar devolve uma permutação sem alterar o original', () => {
        const original = [1, 2, 3, 4, 5, 6];
        const copia = [...original];
        const r = u.embaralhar(original, u.criarRng(42));
        expect(original).toEqual(copia);
        expect([...r].sort()).toEqual(copia);
    });
    test('criarRng é determinístico para a mesma semente', () => {
        const a = u.criarRng(7), b = u.criarRng(7);
        const sa = Array.from({ length: 5 }, a), sb = Array.from({ length: 5 }, b);
        expect(sa).toEqual(sb);
        sa.forEach(v => { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); });
    });
});

describe('prepararQuiz', () => {
    test('embaralha alternativas mantendo a resposta correta', () => {
        Object.values(QUIZ).forEach(lista => {
            const rodada = u.prepararQuiz(lista, { rng: u.criarRng(3) });
            expect(rodada).toHaveLength(lista.length);
            rodada.forEach(q => {
                const orig = lista.find(o => o.pergunta === q.pergunta);
                expect(q.opcoes[q.resposta]).toBe(orig.opcoes[orig.resposta]);
                expect([...q.opcoes].sort()).toEqual([...orig.opcoes].sort());
            });
        });
    });
    test('respeita a quantidade pedida e não repete perguntas', () => {
        const r = u.prepararQuiz(QUIZ['Médio'], { quantidade: 10, rng: u.criarRng(1) });
        expect(r).toHaveLength(10);
        expect(new Set(r.map(q => q.pergunta)).size).toBe(10);
    });
    test('não altera a ordem de alternativas do tipo "Nenhuma das anteriores"', () => {
        const q = { pergunta: 'x', opcoes: ['A', 'B', 'Nenhuma das anteriores'], resposta: 2 };
        expect(u.prepararQuiz([q], { rng: u.criarRng(9) })[0].opcoes).toEqual(q.opcoes);
    });
});

describe('gerarPerguntasBatalha', () => {
    test('gera 5 perguntas válidas para todos os pares de dinossauros', () => {
        for (const a of DINOSSAUROS_REAIS) {
            for (const b of DINOSSAUROS_REAIS) {
                if (a === b) continue;
                const perguntas = u.gerarPerguntasBatalha(a, b, 5, u.criarRng(11));
                expect(perguntas).toHaveLength(5);
                perguntas.forEach(p => {
                    expect(p.resposta).toBeGreaterThanOrEqual(0);
                    expect(p.resposta).toBeLessThan(p.opcoes.length);
                    expect(new Set(p.opcoes).size).toBe(p.opcoes.length);
                });
            }
        }
    });

    test('a resposta de "mais pesado" confere com os dados', () => {
        const trex = DINOSSAUROS_REAIS.find(d => d.Nome === 'Tyrannosaurus rex');
        const velo = DINOSSAUROS_REAIS.find(d => d.Nome === 'Velociraptor mongoliensis');
        const ps = u.gerarPerguntasBatalha(trex, velo, 10, u.criarRng(5));
        const p = ps.find(q => q.tipo === 'Peso-maior');
        expect(p.opcoes[p.resposta]).toBe('Tyrannosaurus rex');
        const leve = ps.find(q => q.tipo === 'Peso-menor');
        expect(leve.opcoes[leve.resposta]).toBe('Velociraptor mongoliensis');
    });

    test('reconhece empates como resposta correta', () => {
        const a = { Nome: 'A', Peso: 1, Comprimento: 5, Altura: 2, Periodo: 'Cretáceo Superior', Dieta: 'Herbívoro', Postura: 'Bípede' };
        const b = { ...a, Nome: 'B' };
        const ps = u.gerarPerguntasBatalha(a, b, 5, u.criarRng(2));
        ps.forEach(p => expect([u.EMPATE, 'Viveram na mesma época']).toContain(p.opcoes[p.resposta]));
    });

    test('retorna lista vazia sem os dois dinossauros', () => {
        expect(u.gerarPerguntasBatalha(null, DINOSSAUROS_REAIS[0])).toEqual([]);
    });
});

describe('períodos', () => {
    test('periodoPorIdade', () => {
        expect(u.periodoPorIdade(230, PERIODOS).nome).toBe('Triássico');
        expect(u.periodoPorIdade(150, PERIODOS).nome).toBe('Jurássico');
        expect(u.periodoPorIdade(66, PERIODOS).nome).toBe('Cretáceo');
        expect(u.periodoPorIdade(20, PERIODOS)).toBeNull();
    });
    test('rankPeriodo ordena cronologicamente', () => {
        const r = u.rankPeriodo;
        expect(r('Triássico Superior')).toBeLessThan(r('Jurássico Inferior'));
        expect(r('Jurássico Superior')).toBeLessThan(r('Cretáceo Inferior'));
        expect(r('Cretáceo Inferior')).toBeLessThan(r('Cretáceo Superior'));
        expect(r('Paleógeno')).toBeNull();
    });
    test('dinossaurosDoPeriodo filtra pelo período principal', () => {
        const tri = u.dinossaurosDoPeriodo('Triássico', DINOSSAUROS_REAIS);
        expect(tri.length).toBeGreaterThan(0);
        tri.forEach(d => expect(d.Periodo).toContain('Triássico'));
    });
});

describe('texto e caminhos', () => {
    test('escapeHtml neutraliza caracteres especiais', () => {
        expect(u.escapeHtml('<img src=x onerror="a">&\'')).toBe('&lt;img src=x onerror=&quot;a&quot;&gt;&amp;&#39;');
        expect(u.escapeHtml(null)).toBe('');
    });
    test('formatarNumero usa vírgula decimal', () => {
        expect(u.formatarNumero(1.5, 1)).toBe('1,5');
        expect(u.formatarNumero(NaN)).toBe('–');
    });
    test('formatarMassa escolhe a unidade', () => {
        expect(u.formatarMassa(0.015)).toBe('15 kg');
        expect(u.formatarMassa(8.4)).toBe('8,4 t');
        expect(u.formatarMassa(70)).toBe('70 t');
    });
    test('caminhos de imagens', () => {
        expect(u.caminhoImagemFossil('Tyrannosaurus rex')).toBe('assets/real_tyrannosaurus_rex.png');
        expect(u.caminhoSilhueta('Humano')).toBe('assets/human.png');
        expect(u.caminhoSilhueta('Novo Dino')).toBe('assets/novo_dino.png');
        expect(u.caminhoImagemIcnofossil('Grallator')).toBe('assets/grallator.jpg');
        expect(u.caminhoImagemIcnofossil('Inexistente')).toBeNull();
    });
});
