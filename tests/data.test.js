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

describe('dados da v2.1', () => {
    test('as épocas cobrem o Mesozoico sem buracos e batem com os períodos', () => {
        expect(d.EPOCAS[0].inicio).toBe(252);
        expect(d.EPOCAS[d.EPOCAS.length - 1].fim).toBe(66);
        for (let i = 1; i < d.EPOCAS.length; i++) expect(d.EPOCAS[i].inicio).toBe(d.EPOCAS[i - 1].fim);
        d.EPOCAS.forEach(e => {
            const p = d.PERIODOS.find(x => x.nome === e.periodo);
            expect(e.inicio).toBeLessThanOrEqual(p.inicio);
            expect(e.fim).toBeGreaterThanOrEqual(p.fim);
        });
    });
    test('o campo Periodo de cada espécie é uma época existente', () => {
        const nomes = d.EPOCAS.map(e => e.nome);
        d.DINOSSAUROS_REAIS.forEach(x => expect(nomes).toContain(x.Periodo));
    });
    test('toda pegada tem autor, e todo autor tem uma imagem de pegada', () => {
        expect(Object.keys(d.AUTORES_ICNOFOSSEIS).sort()).toEqual(Object.keys(d.ICNOFOSSEIS).sort());
        Object.values(d.AUTORES_ICNOFOSSEIS).forEach(a => {
            expect(Object.keys(d.GRUPOS_PEGADAS)).toContain(a.grupo);
            ['autor', 'exemplo', 'pistas', 'curiosidade'].forEach(k => expect(a[k]).toBeTruthy());
        });
    });
    test('os distratores do jogo são espécies do museu', () => {
        const nomes = d.DINOSSAUROS_REAIS.map(x => x.Nome);
        d.DISTRATORES_ICNOFOSSEIS.forEach(n => expect(nomes).toContain(n));
    });
    test('toda espécie do museu está em um clado da árvore', () => {
        d.DINOSSAUROS_REAIS.forEach(x => expect(d.CLADOS_INFO[d.CLADO_DINOSSAURO[x.Nome]]).toBeTruthy());
    });
    test('cada período tem paisagem, ao menos 5 plantas e curiosidades', () => {
        ['Triássico', 'Jurássico', 'Cretáceo'].forEach(p => {
            expect(d.PLANTAS_PERIODO[p].paisagem).toBeTruthy();
            expect(d.PLANTAS_PERIODO[p].plantas.length).toBeGreaterThanOrEqual(5);
            d.PLANTAS_PERIODO[p].plantas.forEach(pl => expect(typeof pl.existeHoje).toBe('boolean'));
            expect(d.MUNDO_PERDIDO[p].length).toBeGreaterThanOrEqual(3);
        });
    });
    test('as eras do globo estão dentro do Mesozoico e em ordem', () => {
        d.ERAS_GLOBO.forEach(e => { expect(e).toBeLessThanOrEqual(252); expect(e).toBeGreaterThanOrEqual(65); });
        expect([...d.ERAS_GLOBO].sort((a, b) => b - a)).toEqual(d.ERAS_GLOBO);
    });
});
