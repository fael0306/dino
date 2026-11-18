/**
 * Testes do carregamento condicional de bibliotecas (js/loader.js).
 */
let loader;
let scripts;

function instalarDomFalso({ comportamento = 'carrega', falharLocal = false } = {}) {
    scripts = [];
    const head = {
        appendChild(el) {
            el.parentNode = head;
            if (el.tagName === 'SCRIPT') {
                scripts.push(el);
                setTimeout(() => {
                    if (falharLocal && el.src.startsWith('vendor/')) {
                        el.onerror && el.onerror();
                    } else if (comportamento === 'carrega') {
                        global[el._global] = {};
                        el.onload && el.onload();
                    } else if (comportamento === 'erro') {
                        el.onerror && el.onerror();
                    } // 'silencio': nunca responde
                }, 0);
            }
        },
        removeChild() {}
    };
    global.document = {
        head,
        querySelector: () => null,
        createElement(tag) {
            return { tagName: tag.toUpperCase(), setAttribute() {} };
        }
    };
}

beforeEach(() => {
    jest.resetModules();
    ['Chart', 'L', 'vis', 'jspdf'].forEach(g => delete global[g]);
    loader = require('../js/loader.js');
});

/** Liga cada <script> ao objeto global que ele deveria criar. */
function rotularScripts() {
    const original = global.document.head.appendChild;
    global.document.head.appendChild = el => {
        if (el.tagName === 'SCRIPT') {
            const lib = Object.values(loader.BIBLIOTECAS).find(b => b.js === el.src || b.local === el.src);
            el._global = lib && lib.global;
        }
        original(el);
    };
}

test('resolve true imediatamente se a biblioteca já existe', async () => {
    instalarDomFalso();
    global.Chart = function () {};
    await expect(loader.carregarBiblioteca('chart')).resolves.toBe(true);
});

test('usa primeiro a cópia local (pasta vendor/)', async () => {
    instalarDomFalso();
    rotularScripts();
    await expect(loader.carregarBiblioteca('leaflet')).resolves.toBe(true);
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toBe(loader.BIBLIOTECAS.leaflet.local);
});

test('recorre à CDN quando a cópia local não existe', async () => {
    instalarDomFalso({ falharLocal: true });
    rotularScripts();
    await expect(loader.carregarBiblioteca('chart')).resolves.toBe(true);
    expect(scripts.map(s => s.src)).toEqual([loader.BIBLIOTECAS.chart.local, loader.BIBLIOTECAS.chart.js]);
});

test('reaproveita a mesma promessa em chamadas simultâneas', async () => {
    instalarDomFalso();
    rotularScripts();
    const [a, b] = await Promise.all([loader.carregarBiblioteca('vis'), loader.carregarBiblioteca('vis')]);
    expect(a && b).toBe(true);
    expect(scripts).toHaveLength(1);
});

test('resolve false (sem rejeitar) quando local e CDN falham, e permite nova tentativa', async () => {
    instalarDomFalso({ comportamento: 'erro' });
    await expect(loader.carregarBiblioteca('jspdf')).resolves.toBe(false);
    expect(scripts).toHaveLength(2);
    expect(loader._promessasBibliotecas.jspdf).toBeUndefined();
});

test('resolve false quando o tempo limite estoura', async () => {
    instalarDomFalso({ comportamento: 'silencio' });
    await expect(loader.carregarBiblioteca('chart', { tempoLimiteMs: 20 })).resolves.toBe(false);
});

test('resolve false para chaves desconhecidas', async () => {
    instalarDomFalso();
    await expect(loader.carregarBiblioteca('jquery')).resolves.toBe(false);
});

test('carregarBibliotecas só é true se todas carregarem', async () => {
    instalarDomFalso();
    rotularScripts();
    await expect(loader.carregarBibliotecas(['chart', 'vis'])).resolves.toBe(true);
});
