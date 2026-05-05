## 🗺️ Roadmap — PaleoLab Científico (partindo da v0.2.0)

### Estado atual
- **v0.1.0** ✅ Fundação (modularização, idioma)
- **v0.1.1** ✅ Cache + primeiros testes
- **v0.2.0** ✅ Alinhamento de silhuetas e normalização de proporção extrema

---

### 🎨 Fase 2 – Experiência do Usuário (continuação)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.2.1** | #17 | Comparação dinossauro × dinossauro (remove “Ônibus”, mantém referências biológicas). | Seletor só com humano, elefante e dinossauros do dataset; comparação visual lado a lado. |
| **v0.2.2** | #7, #6 (modelo K‑Pg) | Estabilidade numérica (semi‑implícito) + explicação didática das equações de Lotka‑Volterra. | Simulação nunca gera valores negativos/estourados; fórmulas e parâmetros explicados em linguagem acessível. |

---

### 📊 Fase 3 – Aprofundamento Científico (parte 1)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.3.0** | #12, #13 | Validação de entrada na massa corporal + equivalências com animais reais (elefantes, T‑Rex, Patagotitan). | Erro se valor fora do padrão realista; métricas de comparação exibidas automaticamente. |
| **v0.3.1** | #5, #20 | Expansão da base de dinossauros (≥ 80% PaleoDB) + substituição do mapa por globo interativo (Ancient Earth). | Globo incorporado com fallback funcional; novos dinossauros no seletor e mapa. |
| **v0.3.2** | #6 (Dinosaur Pictures) | Link/botão que redireciona para a galeria do Dinosaur Pictures do dinossauro selecionado. | Link funcional, abre em nova aba; opcional thumbnail se viável. |

---

### 🧪 Fase 3 – Aprofundamento Científico (parte 2)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.4.0** | #8, #9 | Chave dicotômica melhorada (novos atributos) + fallback com imagens locais em `/assets`. | Características adicionais (largura, profundidade) distinguem ≥ 5 morfotipos; imagens offline disponíveis. |
| **v0.4.1** | #10, #11 | Aprimoramento da etimologia: eufonia, vogais de ligação, ≥ 20 radicais. | Nomes soam naturais; banco expandido. |
| **v0.4.2** | #18 | Gerador de dinossauros reais: banco de ~50 espécies com imagem e descrição. | Modo “real” mostra imagem, período, dieta e curiosidade. |

---

### 🎮 Fase 3 – Aprofundamento Científico (parte 3)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.5.0** | #19 | Jogo Paleo‑Detetive: reformula icnofósseis (fóssil → perguntas → adivinhação). | Fluxo autoexplicativo, feedback visual, pronto para sala de aula. |

---

### 🚀 Fase 4 – Qualidade e Lançamento

| Versão | Atividades | Descrição |
|--------|-----------|-----------|
| **v1.0.0‑rc1** | Cobertura de testes ≥ 60%, testes de usabilidade com professores/alunos, correções de bugs. | App completo e validado. |
| **v1.0.0** | Documentação de deploy (Streamlit Cloud), ajustes finos, publicação final. | Estável, independente de serviços externos para imagens/dados, pronto para divulgação. |

---

### 📅 Cronograma sugerido (sprints de 2 semanas a partir de hoje)

| Sprint | Versão | Entregas principais |
|--------|--------|---------------------|
| 1 (atual) | v0.2.1 | Issue #17 (comparação dino × dino) |
| 2 | v0.2.2 | Issues #7, #6 (modelo K‑Pg robusto e didático) |
| 3 | v0.3.0 | Issues #12, #13 (massa corporal) |
| 4 | v0.3.1 | Issues #5, #20 (globo + expansão dados) |
| 5 | v0.3.2 | Issue #6 (link Dinosaur Pictures) |
| 6 | v0.4.0 | Issues #8, #9 (chave dicotômica) |
| 7 | v0.4.1 | Issues #10, #11 (etimologia) |
| 8 | v0.4.2 | Issue #18 (dinossauros reais) |
| 9 | v0.5.0 | Issue #19 (jogo icnofósseis) |
| 10 | v1.0.0‑rc1 | Testes, usabilidade |
| 11 | v1.0.0 | Deploy e publicação |

---
