# Changelog

## [2.0.0] – Qualidade, testes, acessibilidade e nova interface

### Itens do roadmap v2.0.0
- **Eventos centralizados:** todos os `onclick` inline foram removidos. Um único ouvinte delegado (`initEvents()` em `js/main.js`) despacha as ações `data-action` registradas com `registrarAcao()`.
- **Testes unitários (Jest):** 97 testes em `tests/` cobrindo `identificarIcnogenus`, `simularExtincao`, `gerarSilhuetaPlaceholder`, carregamento de imagens, massa corporal, modo Batalha, quiz, conquistas e o carregador de bibliotecas. Rode com `npm install && npm test`.
- **Acessibilidade:** `alt` descritivo em todas as imagens, `aria-label` e `aria-valuetext` em controles, `tablist`/`tabpanel` com navegação por setas, regiões `aria-live`, foco gerenciado ao trocar de aba, diálogos nativos (`<dialog>`), link "pular para o conteúdo", suporte a `prefers-reduced-motion`.
- **Carregamento condicional:** `js/loader.js` baixa Chart.js, Leaflet, vis-network e jsPDF só quando necessário; cada aba é renderizada apenas na primeira visita. Se uma biblioteca não carrega, a aba mostra um aviso com botão "Tentar novamente" em vez de quebrar.
- **Import/export de conquistas:** exportar para `.json`, importar com validação (ids desconhecidos são ignorados, progresso é mesclado) e apagar progresso com confirmação.
- **Responsividade:** menu lateral vira gaveta em telas ≤ 960 px e há ajustes específicos para telas com menos de 400 px.

### Nova interface (UI/UX)
- Design system próprio (`css/style.css`), sem Bootstrap: barra lateral agrupada (Explorar, Laboratório, Desafios), **tema claro/escuro** (segue o sistema e pode ser alternado), toasts no lugar de `alert()`.
- **Início:** painel com atalhos para todos os módulos, progresso e "Dinossauro do dia".
- **Escala Real:** palco com régua em metros, atualização automática, até 3 animais e frases comparativas.
- **Fósseis Reais:** galeria com busca, filtros por período e dieta, ordenação e ficha detalhada (com atalhos para o mapa e para o modo Batalha).
- **Deriva Continental:** seletor de eras, mapa com miniatura no popup, opção "mostrar todas as espécies" e lista de sítios (funciona mesmo sem o mapa).
- **Linha do Tempo:** barra proporcional dos períodos, sem dependência de Chart.js, com os dinossauros do museu de cada período.
- **Clima:** indicadores, comparação com o clima atual e contador de períodos explorados.
- **Árvore Evolutiva:** painel com a descrição de cada clado e modo "Lista" navegável por teclado.
- **Extinção K‑Pg:** cenários prontos, simulação em tempo real e indicadores das populações finais.
- **Massa Corporal:** cálculo em tempo real, exemplos prontos, dinossauro de peso mais parecido e gráfico com escala logarítmica opcional.
- **Icnofósseis:** perguntas em cartões, placar (acertos, tentativas, sequência) e chave dicotômica de consulta.
- **Quiz:** alternativas embaralhadas, feedback imediato com explicação, atalhos de teclado (1–4), rodadas de 10 ou 20 perguntas, recordes por nível e tela de resultado com revisão.
- **Batalha:** cartões dos dois duelistas, sorteio de duelo e perguntas novas (dieta, postura, época, razão de massas).
- **Relatório PDF:** nome/turma opcionais, escolha das seções, quebra de linha e paginação corretas, gráfico K‑Pg com fundo branco, resultado da batalha e da massa corporal.
- Navegação por URL (`#/quiz`, `#/escala`...), com suporte ao botão Voltar.

### Modo aplicativo (para o app Android)
- `index.html?plataforma=app` ativa um layout de app (`js/plataforma.js` + `css/app.css`): barra superior com voltar, navegação inferior, telas de seção, bottom sheets, snackbars, alvos de toque de 48 px e transições entre telas.
- Pontes com o app nativo: download de PDF/JSON pelo Android (o WebView não suporta `<a download>`), cor das barras do sistema conforme o tema, vibração e botão voltar.
- Ícones do Bootstrap Icons agora ficam no projeto (`vendor/`), e o carregador tenta primeiro cópias locais das bibliotecas (`scripts/baixar-bibliotecas.sh`) antes das CDNs.

### Correções
- `module.exports` de `data.js` referenciava constantes inexistentes e quebrava qualquer `require` (impedia testes).
- Modo Batalha: `const tipoPergunta` era reatribuída (TypeError em ~20 % das perguntas); distratores aleatórios podiam ser mais pesados que os dois duelistas, tornando a pergunta ambígua. Agora as perguntas comparam só os dois duelistas, com opção de empate.
- Contador de conquistas apontava para um elemento inexistente (`#conquista-count`).
- A conquista "Explorador de Escalas" nunca era desbloqueada.
- `DOMContentLoaded` era registrado duas vezes (renderização duplicada).
- `verificarBiblioteca('Leaflet', L, ...)` lançava `ReferenceError` quando a biblioteca não carregava.
- PDF: emojis e caracteres fora do Latin‑1 viravam lixo; textos longos saíam da página.
- Escala Real: o uso de canvas falhava ao abrir o arquivo direto (file://); agora as silhuetas são exibidas como imagens comuns.
- Pergunta do quiz "pés de lagarto" corrigida para "quadril de lagarto" (Saurischia).
- Cenários do simulador ajustados para que "Chicxulub" e "Inverno de impacto" produzam o resultado descrito.

### Desempenho
- Imagens redimensionadas e recomprimidas: pasta `assets/` de 24 MB para 6 MB. Pegadas fósseis convertidas para `.jpg`.
- Bootstrap (CSS + JS) removido; bibliotecas pesadas só são baixadas sob demanda.

### Estrutura
- `js/components.js` (2.000 linhas) foi dividido em `js/app.js` (núcleo), `js/ui.js`, `js/store.js`, `js/loader.js` e um arquivo por aba em `js/abas/`.
