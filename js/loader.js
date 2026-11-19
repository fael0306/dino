// js/loader.js
// Carregamento condicional de bibliotecas externas (v2.0.0).
// Cada biblioteca só é baixada quando a aba que precisa dela é aberta.

// Cada biblioteca tem uma cópia local (pasta vendor/, incluída no app Android
// pelo script scripts/baixar-bibliotecas.sh) e uma CDN de reserva.
const BIBLIOTECAS = {
    chart: {
        nome: 'Chart.js',
        global: 'Chart',
        local: 'vendor/chart.umd.min.js',
        js: 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
    },
    leaflet: {
        nome: 'Leaflet',
        global: 'L',
        local: 'vendor/leaflet/leaflet.js',
        localCss: 'vendor/leaflet/leaflet.css',
        js: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        css: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    },
    jspdf: {
        nome: 'jsPDF',
        global: 'jspdf',
        local: 'vendor/jspdf.umd.min.js',
        js: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    }
};

const _promessasBibliotecas = {};

function bibliotecaDisponivel(chave) {
    const lib = BIBLIOTECAS[chave];
    return !!lib && typeof globalThis[lib.global] !== 'undefined';
}

function _inserirCss(url) {
    if (!url || document.querySelector(`link[data-lib-css="${url}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('data-lib-css', url);
    document.head.appendChild(link);
}

/**
 * Carrega uma biblioteca do registro BIBLIOTECAS.
 * Resolve `true` quando o objeto global estiver disponível e `false` em caso de
 * falha (offline, CDN bloqueada, tempo esgotado). Nunca rejeita.
 * Chamadas repetidas reaproveitam a mesma promessa.
 */
function carregarBiblioteca(chave, { tempoLimiteMs = 15000 } = {}) {
    const lib = BIBLIOTECAS[chave];
    if (!lib) return Promise.resolve(false);
    if (bibliotecaDisponivel(chave)) return Promise.resolve(true);
    if (_promessasBibliotecas[chave]) return _promessasBibliotecas[chave];

    const tentar = (urlJs, urlCss, tempo) => new Promise(resolve => {
        _inserirCss(urlCss);
        const script = document.createElement('script');
        script.src = urlJs;
        script.async = true;
        let finalizado = false;
        const finalizar = ok => {
            if (finalizado) return;
            finalizado = true;
            clearTimeout(timer);
            if (!ok && script.parentNode) script.parentNode.removeChild(script);
            resolve(ok);
        };
        const timer = setTimeout(() => finalizar(false), tempo);
        script.onload = () => finalizar(bibliotecaDisponivel(chave));
        script.onerror = () => finalizar(false);
        document.head.appendChild(script);
    });

    _promessasBibliotecas[chave] = (async () => {
        // 1º: cópia local (rápida e offline); 2º: CDN
        if (lib.local && await tentar(lib.local, lib.localCss, Math.min(tempoLimiteMs, 5000))) return true;
        const ok = await tentar(lib.js, lib.css, tempoLimiteMs);
        if (!ok) delete _promessasBibliotecas[chave]; // permite tentar de novo
        return ok;
    })();
    return _promessasBibliotecas[chave];
}

/** Carrega várias bibliotecas; resolve true somente se todas carregarem. */
function carregarBibliotecas(chaves, opcoes) {
    return Promise.all(chaves.map(c => carregarBiblioteca(c, opcoes))).then(r => r.every(Boolean));
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BIBLIOTECAS,
        bibliotecaDisponivel,
        carregarBiblioteca,
        carregarBibliotecas,
        _promessasBibliotecas
    };
}
