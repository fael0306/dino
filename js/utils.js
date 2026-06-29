// js/utils.js

// ============================================================
// MAPEAMENTO PARA ICNOFÓSSEIS
// ============================================================
const MAPA_ICNOFOSSEIS = {
    "Grallator": "grallator.png",
    "Eubrontes": "eubrontes.png",
    "Megalosauripus": "megalosauripus.png",
    "Wintonopus": "wintonopus.png",
    "Amblydactylus": "amblydactylus.png",
    "Anomoepus": "anomoepus.png",
    "Brontopodus": "brontopodus.png",
    "Parabrontopodus": "parabrontopodus.png"
};

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

        // Proporções naturais de cada ser (largura x altura)
        const proporcoes = {
            "Tyrannosaurus rex": [2, 1],
            "Triceratops":       [2, 1],
            "Velociraptor":      [2, 1],
            "Brachiosaurus":     [2, 1],
            "Stegosaurus":       [2, 1],
            "Spinosaurus":       [2, 1],
            "Patagotitan":       [3, 1],
            "Humano":            [1, 2],
            "Elefante":          [2, 1]
        };

        const nomeArquivo = mapa[nome] || nome.toLowerCase().replace(/ /g, '_') + '.png';
        const caminho = `assets/${nomeArquivo}`;
        const img = new Image();
        img.onload = function() {
            resolve(img);
        };
        img.onerror = function() {
            const [pw, ph] = proporcoes[nome] || [1, 1];
            const base = 200;
            const largura = base * pw;
            const altura  = base * ph;
            const placeholder = gerarSilhuetaPlaceholder(nome, largura, altura);
            const imgFallback = new Image();
            imgFallback.onload = function() { resolve(imgFallback); };
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
// CARREGA IMAGEM DE ICNOFÓSSIL (real ou placeholder)
// ============================================================
function carregarImagemIcnofossil(nome) {
    return new Promise((resolve) => {
        const nomeArquivo = MAPA_ICNOFOSSEIS[nome];
        if (!nomeArquivo) {
            resolve(gerarSilhuetaPlaceholder('pegada', 200, 200));
            return;
        }
        const caminho = `assets/${nomeArquivo}`;
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            const ratio = Math.min(200 / img.width, 200 / img.height);
            const w = img.width * ratio;
            const h = img.height * ratio;
            const x = (200 - w) / 2;
            const y = (200 - h) / 2;
            ctx.drawImage(img, x, y, w, h);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function() {
            resolve(gerarSilhuetaPlaceholder('pegada', 200, 200));
        };
        img.src = caminho;
    });
}

// ============================================================
// CARREGA IMAGEM DE FÓSSIL REAL (esqueleto)
// ============================================================
function carregarImagemFossilReal(nome) {
    return new Promise((resolve) => {
        const mapa = {
            "Tyrannosaurus rex":                 "real_tyrannosaurus_rex.png",
            "Triceratops horridus":              "real_triceratops_horridus.png",
            "Velociraptor mongoliensis":         "real_velociraptor_mongoliensis.png",
            "Brachiosaurus altithorax":          "real_brachiosaurus_altithorax.png",
            "Stegosaurus stenops":               "real_stegosaurus_stenops.png",
            "Spinosaurus aegyptiacus":           "real_spinosaurus_aegyptiacus.png",
            "Patagotitan mayorum":               "real_patagotitan_mayorum.png",
            "Allosaurus fragilis":               "real_allosaurus_fragilis.png",
            "Diplodocus longus":                 "real_diplodocus_longus.png",
            "Ankylosaurus magniventris":         "real_ankylosaurus_magniventris.png",
            "Parasaurolophus walkeri":           "real_parasaurolophus_walkeri.png",
            "Pachycephalosaurus wyomingensis":   "real_pachycephalosaurus_wyomingensis.png",
            "Carnotaurus sastrei":               "real_carnotaurus_sastrei.png",
            "Therizinosaurus cheloniformis":     "real_therizinosaurus_cheloniformis.png",
            "Deinonychus antirrhopus":           "real_deinonychus_antirrhopus.png",
            "Iguanodon bernissartensis":         "real_iguanodon_bernissartensis.png",
            "Baryonyx walkeri":                  "real_baryonyx_walkeri.png",
            "Microraptor gui":                   "real_microraptor_gui.png",
            "Archaeopteryx lithographica":       "real_archaeopteryx_lithographica.png",
            "Coelophysis bauri":                 "real_coelophysis_bauri.png",
            "Plateosaurus engelhardti":          "real_plateosaurus_engelhardti.png",
            "Apatosaurus louisae":               "real_apatosaurus_louisae.png",
            "Camarasaurus grandis":              "real_camarasaurus_grandis.png",
            "Giganotosaurus carolinii":          "real_giganotosaurus_carolinii.png",
            "Carcharodontosaurus saharicus":     "real_carcharodontosaurus_saharicus.png",
            "Utahraptor ostrommaysorum":         "real_utahraptor_ostrommaysorum.png",
            "Dilophosaurus wetherilli":          "real_dilophosaurus_wetherilli.png",
            "Ceratosaurus nasicornis":           "real_ceratosaurus_nasicornis.png",
            "Edmontosaurus annectens":           "real_edmontosaurus_annectens.png",
            "Lambeosaurus lambei":               "real_lambeosaurus_lambei.png",
            "Corythosaurus casuarius":           "real_corythosaurus_casuarius.png",
            "Styracosaurus albertensis":         "real_styracosaurus_albertensis.png",
            "Chasmosaurus belli":                "real_chasmosaurus_belli.png",
            "Protoceratops andrewsi":            "real_protoceratops_andrewsi.png",
            "Psittacosaurus mongoliensis":       "real_psittacosaurus_mongoliensis.png",
            "Euoplocephalus tutus":              "real_euoplocephalus_tutus.png",
            "Gallimimus bullatus":               "real_gallimimus_bullatus.png",
            "Ornithomimus velox":                "real_ornithomimus_velox.png",
            "Struthiomimus altus":               "real_struthiomimus_altus.png",
            "Oviraptor philoceratops":           "real_oviraptor_philoceratops.png",
            "Citipati osmolskae":                "real_citipati_osmolskae.png",
            "Maiasaura peeblesorum":             "real_maiasaura_peeblesorum.png",
            "Shantungosaurus giganteus":         "real_shantungosaurus_giganteus.png",
            "Mamenchisaurus hochuanensis":       "real_mamenchisaurus_hochuanensis.png",
            "Sauroposeidon proteles":            "real_sauroposeidon_proteles.png",
            "Amargasaurus cazaui":               "real_amargasaurus_cazaui.png",
            "Kentrosaurus aethiopicus":          "real_kentrosaurus_aethiopicus.png",
            "Tuojiangosaurus multispinus":       "real_tuojiangosaurus_multispinus.png",
            "Euhelopus zdanskyi":                "real_euhelopus_zdanskyi.png",
            "Herrerasaurus ischigualastensis":   null  // não existe na pasta
        };

        const nomeArquivo = mapa[nome];
        if (!nomeArquivo) {
            resolve(gerarSilhuetaPlaceholder(nome, 300, 200));
            return;
        }

        const caminho = `assets/${nomeArquivo}`;
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const maxWidth = 300;
            const ratio = Math.min(maxWidth / img.width, 1);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = function() {
            resolve(gerarSilhuetaPlaceholder(nome, 300, 200));
        };
        img.src = caminho;
    });
}

// ============================================================
// SILHUETA PLACEHOLDER (desenho estilizado)
// ============================================================
function gerarSilhuetaPlaceholder(nome, largura = 200, altura = 200) {
    const canvas = document.createElement('canvas');
    canvas.width = largura;
    canvas.height = altura;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, largura, altura);

    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, largura, altura);

    // ============================================================
    // PEGADA (icnofóssil)
    // ============================================================
    if (nome.toLowerCase().includes('pegada')) {
        const cx = largura / 2;
        const cy = altura / 2;
        const escala = Math.min(largura, altura) / 200;

        ctx.fillStyle = '#495057';
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 2;

        // Palma
        ctx.beginPath();
        ctx.ellipse(cx, cy + 10 * escala, 25 * escala, 15 * escala, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Dedo 1 (esquerdo)
        ctx.beginPath();
        ctx.moveTo(cx - 20 * escala, cy + 5 * escala);
        ctx.lineTo(cx - 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx - 25 * escala, cy - 35 * escala);
        ctx.lineTo(cx - 10 * escala, cy - 5 * escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx - 40 * escala, cy - 40 * escala);
        ctx.lineTo(cx - 30 * escala, cy - 35 * escala);
        ctx.closePath();
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#212529';
        ctx.fillStyle = '#495057';

        // Dedo 2 (central)
        ctx.beginPath();
        ctx.moveTo(cx, cy + 5 * escala);
        ctx.lineTo(cx, cy - 40 * escala);
        ctx.lineTo(cx + 10 * escala, cy - 45 * escala);
        ctx.lineTo(cx + 10 * escala, cy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - 40 * escala);
        ctx.lineTo(cx - 5 * escala, cy - 50 * escala);
        ctx.lineTo(cx + 5 * escala, cy - 45 * escala);
        ctx.closePath();
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#212529';
        ctx.fillStyle = '#495057';

        // Dedo 3 (direito)
        ctx.beginPath();
        ctx.moveTo(cx + 20 * escala, cy + 5 * escala);
        ctx.lineTo(cx + 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx + 25 * escala, cy - 35 * escala);
        ctx.lineTo(cx + 10 * escala, cy - 5 * escala);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 35 * escala, cy - 30 * escala);
        ctx.lineTo(cx + 40 * escala, cy - 40 * escala);
        ctx.lineTo(cx + 30 * escala, cy - 35 * escala);
        ctx.closePath();
        ctx.fillStyle = '#e9ecef';
        ctx.fill();
        ctx.strokeStyle = '#212529';

        ctx.fillStyle = '#6c757d';
        ctx.font = `${14 * escala}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('👣', cx, cy + 60 * escala);

        return canvas.toDataURL('image/png');
    }

    // ============================================================
    // CORES E ESTILOS PARA OUTROS
    // ============================================================
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

    // Desenho genérico de dinossauro
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
        // desenho de cabeça e detalhes de dinossauro
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
        // Desenho humano
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
        // Desenho elefante
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