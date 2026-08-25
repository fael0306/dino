# 🦴 Roadmap PaleoLab Científico – v1.3.0 → v2.0.0

Com base na versão atual (v1.3.0) e nas duas listas de *issues* fornecidas, estruturei um **roadmap de desenvolvimento** com 4 marcos principais. Cada marco representa uma versão incremental, priorizando correções críticas, novas funcionalidades e melhorias de qualidade.

---

## 📌 Visão Geral das Versões

| Versão | Foco | Principais entregas |
|--------|------|---------------------|
| **v1.4.0** | Estabilidade e usabilidade | Documentação corrigida, fallbacks offline, lógica do jogo de icnofósseis, feedback de carregamento, conquista `climaturista`, persistência básica de abas. |
| **v1.5.0** | Expansão de dados e interação | Inclusão dos 50 dinossauros reais na Escala Real, popups com ficha detalhada no mapa, comparação de três animais, revisão de respostas no Quiz. |
| **v1.6.0** | Funcionalidades avançadas | Modo "batalha" no Quiz (comparações entre dois dinossauros), gráfico de dispersão na aba Massa Corporal, exportação de PDF completa (incluindo gráficos e imagens). |
| **v2.0.0** | Qualidade, testes e acessibilidade | Migração para `addEventListener`, testes unitários (Jest), acessibilidade (ARIA, `alt`), otimização de carregamento condicional, import/export de conquistas. |

---

## 🔧 v1.4.0 – Estabilidade e Usabilidade (prioridade máxima) - OK

**Objetivo:** Corrigir problemas imediatos que afetam a experiência do usuário e a coerência do projeto.

### Issues contempladas

| # | Issue (fonte) | Descrição |
|---|---------------|-----------|
| 2 | Lista 1 – README | Atualizar README para descrever a versão web estática (HTML/CSS/JS), removendo referências ao Streamlit/Python. Explicar como executar com Live Server ou servidor simples. |
| 3 | Lista 1 – Fallback | Adicionar verificações robustas para bibliotecas externas (Chart.js, Leaflet, vis.js, jsPDF) com mensagens amigáveis caso não carreguem. |
| 1 | Lista 2 – Icnofósseis | Corrigir a lógica do jogo: as perguntas extras (tamanho, forma, proporção) devem ser atualizadas dinamicamente quando o usuário alterar os campos "dedos" ou "garras" (usar `onchange`). |
| 10 | Lista 2 – Conquista 'climaturista' | Adicionar chamada a `desbloquearConquista('climaturista')` em `atualizarClima()` após o usuário explorar os três períodos (ex: manter contador de períodos visitados). |
| 9 | Lista 1 – Feedback de carregamento | Inserir spinner/mensagem "Carregando..." durante a geração de imagens (Escala, Icnofósseis) e na simulação K‑Pg. |
| 10 | Lista 2 – Persistência entre abas | Implementar um mecanismo simples para evitar re-renderização completa de uma aba já inicializada (ex: flag `initialized` por aba). Pode ser um objeto `state` global que armazena o HTML gerado ou apenas impede chamadas repetidas de `render`. |

> **Prazo estimado:** 1 sprint (2 semanas)

---

## 🚀 v1.5.0 – Expansão de Dados e Interação

**Objetivo:** Aumentar o repertório de dados e enriquecer as interações existentes.

### Issues contempladas

| # | Issue (fonte) | Descrição |
|---|---------------|-----------|
| 3 | Lista 2 – Escala Real | Expandir o `<select>` da aba Escala para incluir todos os 50 dinossauros de `DINOSSAUROS_REAIS`. Manter a opção "Outro dinossauro" que já existe, mas agora com todos. - abandonado |
| 4 | Lista 2 – Mapa interativo | Ao clicar em um marcador no mapa Leaflet, abrir um popup com informações do dinossauro (nome, período, dieta e uma imagem pequena – usar `carregarImagemOriginal`). |
| 5 | Lista 2 – Comparação múltipla | Permitir adicionar um terceiro animal à comparação de escala (além do dinossauro e da referência). Renderizar os três lado a lado com proporções corretas (adaptar `combinarLadoALado` para três imagens). |
| 2 | Lista 2 – Revisão do Quiz | Ao final do quiz, exibir não apenas a pontuação, mas uma lista das perguntas respondidas, indicando a resposta correta e uma breve explicação (campo extra no objeto de perguntas). |

> **Prazo estimado:** 2 sprints (4 semanas)

---

## ⚡ v1.6.0 – Funcionalidades Avançadas

**Objetivo:** Introduzir novos modos de jogo e ferramentas analíticas mais profundas.

### Issues contempladas

| # | Issue (fonte) | Descrição |
|---|---------------|-----------|
| 6 | Lista 2 – Modo "batalha" no Quiz | Criar uma nova modalidade onde o usuário escolhe dois dinossauros da lista de 50 e o sistema gera perguntas comparativas (ex: "Qual é mais pesado?", "Qual viveu mais tarde?", "Qual é mais comprido?"). As perguntas são geradas dinamicamente com base nos atributos dos dois espécimes. |
| 7 | Lista 2 – Gráfico de dispersão (Massa) | Na aba Massa Corporal, plotar um gráfico de dispersão (Chart.js) com os 7 dinossauros clássicos (usando suas circunferências femorais estimadas – podem ser calculadas a partir da massa com a equação inversa) e destacar o ponto calculado pelo usuário. Isso contextualiza o resultado. |
| 8 | Lista 2 – Exportação PDF completa | Expandir a geração de PDF para incluir: resultado do último quiz (com perguntas e respostas), gráfico da simulação K‑Pg (exportar como imagem do canvas) e a comparação de escala atual (também como imagem). Utilizar `canvas.toDataURL` e `jsPDF.addImage`. |

> **Prazo estimado:** 2 sprints (4 semanas)

---

## 🧪 v2.0.0 – Qualidade, Testes e Acessibilidade

**Objetivo:** Profissionalizar o código, garantir manutenibilidade e inclusão.

### Issues contempladas

| # | Issue (fonte) | Descrição |
|---|---------------|-----------|
| 5 | Lista 1 – Migrar `onclick` | Substituir todos os `onclick` inline por `addEventListener` no JavaScript, concentrando a lógica de eventos em um único local (ex: `initEvents()`). |
| 7 | Lista 1 – Testes unitários | Implementar testes com Jest (ou Mocha) para funções puras: `identificarIcnogenus`, `simularExtincao` (com valores esperados), `gerarSilhuetaPlaceholder` (comparação de canvas ou MD5), e funções de carregamento de imagem. |
| 4 | Lista 1 – Acessibilidade | Adicionar atributos `alt` descritivos para todas as imagens geradas dinamicamente, `aria-label` para controles (sliders, selects, botões) e roles apropriados para regiões interativas. |
| 6 | Lista 1 – Carregamento otimizado | Implementar carregamento condicional de bibliotecas: carregar Chart.js apenas quando a aba de gráficos for ativada, Leaflet apenas quando a Deriva for acessada, etc. Usar `import()` dinâmico ou carregar via `script` com `onload`. |
| 9 | Lista 1 – Exportação/importação de conquistas | Adicionar botões para exportar (baixar JSON) e importar (upload de arquivo) as conquistas salvas no `localStorage`, permitindo que o usuário preserve seu progresso. |
| 8 | Lista 1 – Responsividade extra | Ajustar ainda mais o layout para dispositivos com largura < 400px: reduzir `font-size`, padding e ajustar o menu para um dropdown (se necessário). |

> **Prazo estimado:** 3 sprints (6 semanas)

---

## 📋 Resumo do Cronograma

| Versão | Sprints | Data prevista (exemplo) |
|--------|---------|--------------------------|
| v1.4.0 | 1       | Semana 1–2               |
| v1.5.0 | 2       | Semana 3–6               |
| v1.6.0 | 2       | Semana 7–10              |
| v2.0.0 | 3       | Semana 11–16             |

> **Total estimado:** 8 sprints (≈ 4 meses) – ajustável conforme equipe e disponibilidade.

---

## 🧩 Observações Finais

- **Integração entre listas:** As duas listas de *issues* se complementam. Priorizei as correções imediatas (documentação, fallback, lógica) para não prejudicar a primeira impressão do usuário.
- **Comunidade:** Sugiro abrir *issues* no repositório para cada uma dessas tarefas, permitindo que colaboradores se responsabilizem por partes específicas.
- **Documentação contínua:** Durante cada versão, atualize o README e adicione um changelog para facilitar o rastreamento das mudanças.

Com esse roadmap, o PaleoLab sairá de uma versão funcional para uma aplicação madura, pronta para uso em sala de aula e com potencial para futuras expansões (como integração com APIs de dados paleontológicos ou realidade aumentada). 🚀
