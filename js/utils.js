// js/utils.js

// ============================================================
// CARREGA A IMAGEM ORIGINAL DA PASTA assets/ (SEM REDIMENSIONAR)
// ============================================================
function carregarImagemOriginal(nome) {
    return new Promise((resolve, reject) => {
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
            resolve(img);
        };
        img.onerror = function() {
            // Fallback: gerar placeholder
            const placeholder = gerarSilhuetaPlaceholder(nome, 200, 200);
            const imgFallback = new Image();
            imgFallback.onload = function() {
                resolve(imgFallback);
            };
            imgFallback.src = placeholder;
        };
        img.src = caminho;
    });
}

// ============================================================
// FUNÇÃO PRINCIPAL: tenta carregar imagem real, fallback para placeholder
// ============================================================
function carregarImagemOuPlaceholder(nome, largura = 200, altura = 200) {
    return new Promise((resolve) => {
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
            const canvas = document.createElement('canvas');
            canvas.width = largura;
            canvas.height = altura;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, largura, altura);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function() {
            resolve(gerarSilhuetaPlaceholder(nome, largura, altura));
        };
        img.src = caminho;
    });
}

// ============================================================
// SILHUETA PLACEHOLDER (desenho estilizado de dinossauro)
// ============================================================
function gerarSilhuetaPlaceholder(nome, largura = 200, altura = 200) {
    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, largura, altura);

    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, largura, altura);

    const cores = ['#6c757d', '#495057', '#343a40', '#5a6268', '#4e555b'];
    let cor = cores[Math.floor(Math.random() * cores.length)];
    if (nome.toLowerCase().includes('humano')) cor = '#f8c291';
    if (nome.toLowerCase().includes('elefante')) cor = '#6b5b4f';

    ctx.fillStyle = cor;
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 2;

    const cx = largura / 2;
    const cy = altura / 2;
    const escala = Math.min(largura, altura) / 200;

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
        // Desenho do pescoço, cabeça, pernas e cauda (mantido do original)
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
        // Desenho humano simplificado
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
        // Desenho elefante simplificado
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
// REDIMENSIONA IMAGEM PARA UMA ALTURA ESPECÍFICA (PROPORCIONAL)
// ============================================================
function redimensionarParaAltura(dataURL, alturaAlvo) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ratio = alturaAlvo / img.height;
            canvas.width = Math.round(img.width * ratio);
            canvas.height = alturaAlvo;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function() {
            resolve(gerarSilhuetaPlaceholder('erro', 200, 200));
        };
        img.src = dataURL;
    });
}

// ============================================================
// COMBINA DUAS IMAGENS LADO A LADO (ALINHADAS PELA BASE)
// ============================================================
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
                const largura = img1.width + img2.width;
                canvas.width = largura;
                canvas.height = altura;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, largura, altura);
                ctx.drawImage(img1, 0, altura - img1.height);
                ctx.drawImage(img2, img1.width, altura - img2.height);
                resolve(canvas.toDataURL('image/png'));
            }
        };
        img1.src = dataURL1;
        img2.src = dataURL2;
    });
}

// ============================================================
// SIMULAÇÃO K-Pg (RK4)
// ============================================================
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

// ============================================================
// IDENTIFICAÇÃO DE ICNOFÓSSEIS
// ============================================================
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