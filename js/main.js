// js/main.js
console.log('🚀 PaleoLab Web v2.0.0 carregado!');

/**
 * Gerenciador de Navegação entre Abas (com persistência de estado)
 * @param {string} abaId - Identificador único da aba
 */
function navegarParaAba(abaId) {
    if (!abaId) return;

    // 1. Oculta todos os painéis e desativa botões de abas
    document.querySelectorAll('.tab-content').forEach(panel => {
        panel.classList.remove('active');
        panel.style.display = 'none';
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });

    // 2. Ativa o painel e o botão da aba selecionada
    const painelAlvo = document.getElementById(`tab-${abaId}`);
    const botaoAlvo = document.getElementById(`btn-tab-${abaId}`);

    if (painelAlvo) {
        painelAlvo.classList.add('active');
        painelAlvo.style.display = 'block';
    }
    if (botaoAlvo) {
        botaoAlvo.classList.add('active');
        botaoAlvo.setAttribute('aria-selected', 'true');
    }

    // 3. Inicializa a aba apenas se ainda não foi inicializada
    if (typeof state !== 'undefined' && state.initialized && !state.initialized[abaId]) {
        console.log(`📌 Inicialização sob demanda da aba: ${abaId}`);
        state.initialized[abaId] = true;
    }

    // 4. Anuncia a mudança de aba para leitores de tela (Acessibilidade ARIA)
    const announcer = document.getElementById('aria-announcer');
    if (announcer && botaoAlvo) {
        announcer.textContent = `Aba ${botaoAlvo.textContent.trim()} selecionada.`;
    }
}

// Expõe a função para o escopo global
window.navegarParaAba = navegarParaAba;

// Inicialização principal da aplicação no DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('⚡ DOMContentLoaded - Inicializando PaleoLab v2.0.0');

    // Inicializa escutadores de eventos centralizados
    if (typeof initEvents === 'function') {
        initEvents();
    }

    // Renderiza todas as abas iniciais
    if (typeof renderizarAbas === 'function') {
        renderizarAbas();
    }

    // Atualiza contadores de conquistas
    if (typeof atualizarBadgeConquistas === 'function') {
        atualizarBadgeConquistas();
    }

    // Navega para a aba padrão
    navegarParaAba('escala');
});
