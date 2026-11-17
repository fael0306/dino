/**
 * Testes de integridade dos dados (js/data.js).
 */
const d = require('../js/data.js');

describe('quiz', () => {
    test.each(Object.keys(d.QUIZ))('nível %s tem 20 perguntas bem formadas', nivel => {
        const lista = d.QUIZ[nivel];
        expect(lista).toHaveLength(20);
        lista.forEach(p => {
            expect(typeof p.pergunta).toBe('string');
            expect(p.opcoes.length).toBeGreaterThanOrEqual(2);
            expect(p.resposta).toBeGreaterThanOrEqual(0);
            expect(p.resposta).toBeLessThan(p.opcoes.length);
            expect(new Set(p.opcoes).size).toBe(p.opcoes.length);
            expect(p.explicacao).toBeTruthy();
        });
    });
});

describe('dinossauros', () => {
    test('há 50 espécies reais com nomes únicos e medidas positivas', () => {
        expect(d.DINOSSAUROS_REAIS).toHaveLength(50);
        expect(new Set(d.DINOSSAUROS_REAIS.map(x => x.Nome)).size).toBe(50);
        d.DINOSSAUROS_REAIS.forEach(x => {
            ['Comprimento', 'Altura', 'Peso'].forEach(k => expect(x[k]).toBeGreaterThan(0));
            expect(x.Periodo).toMatch(/Triássico|Jurássico|Cretáceo/);
        });
    });
    test('toda espécie tem coordenadas no mapa', () => {
        d.DINOSSAUROS_REAIS.forEach(x => expect(d.COORDENADAS_DINOSSAUROS[x.Nome]?.length).toBeGreaterThan(0));
    });
});

describe('árvore evolutiva e conquistas', () => {
    test('todo nó da árvore tem descrição', () => {
        const nos = new Set(d.ARVORE_ARESTAS.flat());
        nos.forEach(n => expect(d.CLADOS_INFO[n]).toBeTruthy());
    });
    test('ids de conquistas são únicos', () => {
        const ids = d.CONQUISTAS_LISTA.map(c => c.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
    test('cenários K-Pg estão entre 0 e 100%', () => {
        d.CENARIOS_KPG.forEach(c => {
            [c.bloqueio, c.chuva].forEach(v => { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(100); });
        });
    });
});
