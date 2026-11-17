/**
 * Simulações mínimas de APIs do navegador, para os testes rodarem no
 * ambiente "node" do Jest sem dependências extras (jsdom/canvas).
 */

/** Canvas falso que registra todas as chamadas de desenho. */
function criarCanvasFalso() {
    const chamadas = [];
    const ctx = new Proxy({}, {
        get(alvo, prop) {
            if (prop in alvo) return alvo[prop];
            return (...args) => { chamadas.push([prop, ...args]); };
        },
        set(alvo, prop, valor) {
            chamadas.push([`set:${String(prop)}`, valor]);
            alvo[prop] = valor;
            return true;
        }
    });
    const canvas = {
        width: 0,
        height: 0,
        chamadas,
        getContext: () => ctx,
        toDataURL: () => `data:image/png;base64,FAKE${canvas.width}x${canvas.height}`
    };
    return canvas;
}

/** Instala `document` com createElement('canvas') falso. Retorna os canvases criados. */
function instalarDocumentFalso() {
    const criados = [];
    global.document = {
        createElement(tag) {
            if (tag === 'canvas') {
                const c = criarCanvasFalso();
                criados.push(c);
                return c;
            }
            return { tagName: tag.toUpperCase(), setAttribute() {}, style: {} };
        }
    };
    return criados;
}

/**
 * Instala `Image` falso. `deveCarregar(src)` decide se dispara onload ou onerror.
 */
function instalarImageFalso(deveCarregar) {
    global.Image = class {
        constructor() { this.width = 400; this.height = 200; }
        set src(valor) {
            this._src = valor;
            setTimeout(() => (deveCarregar(valor) ? this.onload && this.onload() : this.onerror && this.onerror()), 0);
        }
        get src() { return this._src; }
    };
}

/** localStorage em memória. */
function instalarLocalStorageFalso(inicial = {}) {
    const dados = { ...inicial };
    global.localStorage = {
        getItem: k => (k in dados ? dados[k] : null),
        setItem: (k, v) => { dados[k] = String(v); },
        removeItem: k => { delete dados[k]; },
        clear: () => Object.keys(dados).forEach(k => delete dados[k]),
        _dados: dados
    };
    return global.localStorage;
}

module.exports = { criarCanvasFalso, instalarDocumentFalso, instalarImageFalso, instalarLocalStorageFalso };
