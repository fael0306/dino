/**
 * Testes de gerarSilhuetaPlaceholder e das funções de carregamento de imagem.
 */
const { instalarDocumentFalso, instalarImageFalso } = require('./helpers.js');
const u = require('../js/utils.js');

describe('gerarSilhuetaPlaceholder', () => {
    let canvases;
    beforeEach(() => { canvases = instalarDocumentFalso(); });

    test('retorna um data URL PNG com as dimensões pedidas', () => {
        const url = u.gerarSilhuetaPlaceholder('Tyrannosaurus rex', 320, 160);
        expect(url).toBe('data:image/png;base64,FAKE320x160');
        expect(canvases[0].width).toBe(320);
        expect(canvases[0].height).toBe(160);
    });

    test('usa 200 x 200 por padrão', () => {
        u.gerarSilhuetaPlaceholder('X');
        expect([canvases[0].width, canvases[0].height]).toEqual([200, 200]);
    });

    test('é determinístico: mesmo nome → mesmas chamadas de desenho', () => {
        u.gerarSilhuetaPlaceholder('Allosaurus fragilis', 300, 200);
        u.gerarSilhuetaPlaceholder('Allosaurus fragilis', 300, 200);
        expect(canvases[0].chamadas).toEqual(canvases[1].chamadas);
    });

    test('desenhos diferentes para pegada, humano, elefante e dinossauro', () => {
        ['pegada', 'Humano', 'Elefante', 'Dino'].forEach(n => u.gerarSilhuetaPlaceholder(n, 200, 200));
        const assinaturas = canvases.map(c => JSON.stringify(c.chamadas));
        expect(new Set(assinaturas).size).toBe(4);
    });

    test('pinta o fundo antes de desenhar', () => {
        u.gerarSilhuetaPlaceholder('Dino', 200, 100);
        const fill = canvases[0].chamadas.find(c => c[0] === 'fillRect');
        expect(fill).toEqual(['fillRect', 0, 0, 200, 100]);
    });

    test('não quebra com nome vazio ou indefinido', () => {
        expect(() => u.gerarSilhuetaPlaceholder(undefined, 50, 50)).not.toThrow();
        expect(() => u.gerarSilhuetaPlaceholder('', 50, 50)).not.toThrow();
    });
});

describe('carregamento de imagens', () => {
    beforeEach(() => { instalarDocumentFalso(); });

    test('carregarImagem resolve com a imagem quando carrega', async () => {
        instalarImageFalso(() => true);
        const img = await u.carregarImagem('assets/trex.png');
        expect(img.src).toBe('assets/trex.png');
    });

    test('carregarImagem resolve null em caso de erro ou src vazio', async () => {
        instalarImageFalso(() => false);
        await expect(u.carregarImagem('assets/nao_existe.png')).resolves.toBeNull();
        await expect(u.carregarImagem('')).resolves.toBeNull();
    });

    test('carregarImagemOriginal usa o arquivo mapeado da silhueta', async () => {
        instalarImageFalso(() => true);
        const img = await u.carregarImagemOriginal('Tyrannosaurus rex');
        expect(img.src).toBe('assets/trex.png');
    });

    test('carregarImagemOriginal cai no placeholder quando o arquivo falta', async () => {
        instalarImageFalso(src => src.startsWith('data:'));
        const img = await u.carregarImagemOriginal('Patagotitan');
        // Patagotitan tem proporção 3:1 → placeholder 600 x 200
        expect(img.src).toBe('data:image/png;base64,FAKE600x200');
    });

    test('carregarImagemFossilReal devolve o caminho ou um placeholder', async () => {
        instalarImageFalso(() => true);
        await expect(u.carregarImagemFossilReal('Diplodocus longus')).resolves.toBe('assets/real_diplodocus_longus.png');
        instalarImageFalso(() => false);
        await expect(u.carregarImagemFossilReal('Diplodocus longus')).resolves.toBe('data:image/png;base64,FAKE300x200');
    });

    test('carregarImagemIcnofossil usa placeholder para nomes desconhecidos', async () => {
        instalarImageFalso(() => true);
        await expect(u.carregarImagemIcnofossil('Eubrontes')).resolves.toBe('assets/eubrontes.jpg');
        await expect(u.carregarImagemIcnofossil('Desconhecido')).resolves.toBe('data:image/png;base64,FAKE200x200');
    });

    test('comporImagensLadoALado cria canvas com a soma das larguras', () => {
        const canvases = instalarDocumentFalso();
        const imgs = [{ width: 100, height: 50 }, { width: 50, height: 100 }];
        const url = u.comporImagensLadoALado(imgs, [100, 50], { espaco: 10 });
        // larguras redimensionadas: 200 e 25; 3 espaços de 10; altura 100 + 2 * 10
        expect(url).toBe('data:image/png;base64,FAKE255x120');
        expect(canvases[0].chamadas.filter(c => c[0] === 'drawImage')).toHaveLength(2);
    });
});
