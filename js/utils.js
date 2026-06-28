// js/utils.js

// ============================================================
// FUNÇÃO PRINCIPAL: tenta carregar imagem real, fallback para placeholder
// ============================================================
function carregarImagemOuPlaceholder(nome, largura = 200, altura = 200) {
    return new Promise((resolve) => {
        // Mapeamento dos nomes para arquivos (ajuste conforme seus arquivos)
        const mapa = {
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
        const nomeArquivo = mapa[nome] || nome.toLowerCase().replace(/ /g, '_') + '.png';
        const caminho = `assets/${nomeArquivo}`;

        const img = new Image();
        img.onload = function() {
            // Redimensionar para a largura/altura desejada (opcional)
            const canvas = document.createElement('canvas');
            canvas.width = largura;
            canvas.height = altura;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, largura, altura);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function() {
            // Se falhar, usa o placeholder genérico
            resolve(gerarSilhuetaPlaceholder(nome, largura, altura));
        };
        img.src = caminho;
    });
}

// ============================================================
// FUNÇÃO AUXILIAR: gera silhueta placeholder (fallback)
// ============================================================
function gerarSilhuetaPlaceholder(nome, largura = 200, altura = 200) {
    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, largura, altura);
    ctx.fillStyle = '#4a4a4a';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    // Desenha uma silhueta genérica (pode personalizar por nome)
    ctx.beginPath();
    ctx.moveTo(50, 180);
    ctx.lineTo(150, 180);
    ctx.lineTo(170, 120);
    ctx.lineTo(140, 70);
    ctx.lineTo(100, 50);
    ctx.lineTo(60, 70);
    ctx.lineTo(30, 120);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Olho
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(130, 100, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(132, 102, 4, 0, 2 * Math.PI);
    ctx.fill();
    return canvas.toDataURL('image/png');
}

// ============================================================
// DEMAIS FUNÇÕES UTILITÁRIAS (já existentes, mantidas)
// ============================================================

// Redimensiona imagem para altura (promise)
function redimensionarParaAltura(dataURL, alturaAlvo) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ratio = alturaAlvo / img.height;
            canvas.width = img.width * ratio;
            canvas.height = alturaAlvo;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = dataURL;
    });
}

// Combina duas imagens lado a lado
function combinarLadoALado(dataURL1, dataURL2) {
    return new Promise((resolve) => {
        const img1 = new Image();
        const img2 = new Image();
        let loaded = 0;
        img1.onload = img2.onload = function() {
            loaded++;
            if (loaded === 2) {
                const canvas = document.createElement('canvas');
                const altura = Math.max(img1.height, img2.height);
                canvas.width = img1.width + img2.width;
                canvas.height = altura;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img1, 0, altura - img1.height);
                ctx.drawImage(img2, img1.width, altura - img2.height);
                resolve(canvas.toDataURL('image/png'));
            }
        };
        img1.src = dataURL1;
        img2.src = dataURL2;
    });
}

// Simulação RK4 para extinção K-Pg
function simularExtincao(bloqueioSolar, chuvaAcida, anos) {
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
    const resultados = { P: [P0], H: [H0], C: [C0] };
    let state = [P0, H0, C0];

    for (let i = 0; i < n; i++) {
        const k1 = lotkaVolterra(state, r, a, b, d, e, f, g);
        const k2 = lotkaVolterra(
            [state[0] + dt/2 * k1[0], state[1] + dt/2 * k1[1], state[2] + dt/2 * k1[2]],
            r, a, b, d, e, f, g
        );
        const k3 = lotkaVolterra(
            [state[0] + dt/2 * k2[0], state[1] + dt/2 * k2[1], state[2] + dt/2 * k2[2]],
            r, a, b, d, e, f, g
        );
        const k4 = lotkaVolterra(
            [state[0] + dt * k3[0], state[1] + dt * k3[1], state[2] + dt * k3[2]],
            r, a, b, d, e, f, g
        );
        state[0] += dt/6 * (k1[0] + 2*k2[0] + 2*k3[0] + k4[0]);
        state[1] += dt/6 * (k1[1] + 2*k2[1] + 2*k3[1] + k4[1]);
        state[2] += dt/6 * (k1[2] + 2*k2[2] + 2*k3[2] + k4[2]);
        state[0] = Math.max(0, state[0]);
        state[1] = Math.max(0, state[1]);
        state[2] = Math.max(0, state[2]);
        resultados.P.push(state[0]);
        resultados.H.push(state[1]);
        resultados.C.push(state[2]);
    }
    return resultados;
}

function lotkaVolterra(state, r, a, b, d, e, f, g) {
    const [P, H, C] = state;
    return [
        r * P - a * P * H,
        b * a * P * H - d * H - e * H * C,
        f * e * H * C - g * C
    ];
}

// Identificação de icnofósseis
function identificarIcnogenus(dedos, garras, tamanho, forma, proporcao) {
    if (dedos === 3) {
        if (garras) {
            if (tamanho === "pequeno") return "Grallator";
            else {
                if (forma === "alongada") return "Eubrontes";
                else return "Megalosauripus";
            }
        } else {
            if (tamanho === "pequeno") return "Wintonopus";
            else return "Amblydactylus";
        }
    } else {
        if (garras) return "Anomoepus";
        else {
            if (proporcao === "larga") return "Brontopodus";
            else return "Parabrontopodus";
        }
    }
}

// (Opcional) Função antiga mantida para compatibilidade, se necessário
function gerarSilhueta(nome, largura, altura) {
    return gerarSilhuetaPlaceholder(nome, largura, altura);
}