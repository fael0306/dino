/**
 * Testes da persistência de conquistas (js/store.js).
 */
const { instalarLocalStorageFalso } = require('./helpers.js');
const s = require('../js/store.js');
const { CONQUISTAS_LISTA } = require('../js/data.js');

const IDS = CONQUISTAS_LISTA.map(c => c.id);

beforeEach(() => instalarLocalStorageFalso());

describe('conquistas', () => {
    test('registrarConquista salva a data e só conta na primeira vez', () => {
        const data = new Date('2026-03-01T12:00:00Z');
        expect(s.registrarConquista('quiz_facil', data)).toBe(true);
        expect(s.registrarConquista('quiz_facil')).toBe(false);
        expect(s.lerConquistas()).toEqual({ quiz_facil: '2026-03-01T12:00:00.000Z' });
        expect(s.conquistaObtida('quiz_facil')).toBe(true);
    });

    test('aceita o formato antigo { id: true } da v1.x', () => {
        instalarLocalStorageFalso({ conquistas: JSON.stringify({ climaturista: true }) });
        expect(s.conquistaObtida('climaturista')).toBe(true);
        expect(s.contarConquistas(IDS)).toBe(1);
    });

    test('tolera JSON corrompido no localStorage', () => {
        instalarLocalStorageFalso({ conquistas: '{quebrado', periodos_visitados: '"texto"' });
        expect(s.lerConquistas()).toEqual({});
        expect(s.lerPeriodosVisitados()).toEqual([]);
    });

    test('contarConquistas ignora ids desconhecidos quando a lista é passada', () => {
        s.registrarConquista('quiz_facil');
        s.registrarConquista('id_antigo');
        expect(s.contarConquistas(IDS)).toBe(1);
    });

    test('registrarPeriodoVisitado não duplica', () => {
        s.registrarPeriodoVisitado('Jurássico');
        s.registrarPeriodoVisitado('Jurássico');
        expect(s.registrarPeriodoVisitado('Cretáceo')).toEqual(['Jurássico', 'Cretáceo']);
    });

    test('resetarProgresso apaga tudo', () => {
        s.registrarConquista('quiz_facil');
        s.registrarPeriodoVisitado('Triássico');
        s.registrarRecorde('Fácil', 5, 10);
        s.resetarProgresso();
        expect(s.lerConquistas()).toEqual({});
        expect(s.lerPeriodosVisitados()).toEqual([]);
        expect(s.lerRecordes()).toEqual({});
    });
});

describe('recordes do quiz', () => {
    test('só substitui quando o aproveitamento é maior', () => {
        expect(s.registrarRecorde('Fácil', 6, 10)).toBe(true);
        expect(s.registrarRecorde('Fácil', 5, 10)).toBe(false);
        expect(s.registrarRecorde('Fácil', 15, 20)).toBe(true);
        expect(s.lerRecordes()['Fácil']).toEqual({ acertos: 15, total: 20 });
    });
    test('ignora total zero', () => {
        expect(s.registrarRecorde('Médio', 0, 0)).toBe(false);
    });
});

describe('exportação e importação', () => {
    test('criarPayloadExportacao inclui versão, data e dados', () => {
        const p = s.criarPayloadExportacao({ quiz_facil: true }, ['Jurássico'], new Date('2026-01-02T00:00:00Z'));
        expect(p).toEqual({
            app: 'PaleoLab Científico',
            versao: '2.0.0',
            dataExportacao: '2026-01-02T00:00:00.000Z',
            conquistas: { quiz_facil: true },
            periodosVisitados: ['Jurássico']
        });
    });

    test.each([
        [null, 'objeto'],
        [[], 'objeto'],
        [{}, 'conquistas'],
        [{ conquistas: [] }, 'conquistas']
    ])('rejeita arquivos inválidos (%#)', (dados, trecho) => {
        const r = s.validarPayloadImportacao(dados, IDS);
        expect(r.ok).toBe(false);
        expect(r.erro).toMatch(trecho);
    });

    test('filtra ids desconhecidos, valores inválidos e períodos inexistentes', () => {
        const r = s.validarPayloadImportacao({
            conquistas: { quiz_facil: true, climaturista: '2026-01-01T00:00:00Z', hack: true, quiz_medio: 'ontem', quiz_dificil: 1 },
            periodosVisitados: ['Jurássico', 'Permiano']
        }, IDS);
        expect(r).toEqual({
            ok: true,
            conquistas: { quiz_facil: true, climaturista: '2026-01-01T00:00:00Z' },
            periodos: ['Jurássico'],
            ignoradas: ['hack']
        });
    });

    test('aplicarImportacao mescla sem sobrescrever conquistas existentes', () => {
        s.registrarConquista('quiz_facil', new Date('2026-05-05T00:00:00Z'));
        s.registrarPeriodoVisitado('Triássico');
        const r = s.validarPayloadImportacao({ conquistas: { quiz_facil: true, batalha_mestre: true }, periodosVisitados: ['Cretáceo'] }, IDS);
        expect(s.aplicarImportacao(r)).toBe(true);
        expect(s.lerConquistas()).toEqual({ quiz_facil: '2026-05-05T00:00:00.000Z', batalha_mestre: true });
        expect(s.lerPeriodosVisitados()).toEqual(['Triássico', 'Cretáceo']);
    });

    test('aplicarImportacao recusa resultados inválidos', () => {
        expect(s.aplicarImportacao({ ok: false })).toBe(false);
    });

    test('o arquivo exportado pode ser importado de volta', () => {
        s.registrarConquista('detetive_icno');
        const payload = JSON.parse(JSON.stringify(s.criarPayloadExportacao(s.lerConquistas(), ['Jurássico'])));
        instalarLocalStorageFalso();
        s.aplicarImportacao(s.validarPayloadImportacao(payload, IDS));
        expect(s.conquistaObtida('detetive_icno')).toBe(true);
    });
});
