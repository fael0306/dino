**🗺️ Roadmap — PaleoLab Científico (atualizado com issues pendentes)**  

Mantive todas as versões já planejadas e adicionei a **issue #4** (precisão paleogeográfica) em uma nova versão, **v0.3.3**, respeitando o cronograma existente.

---

### Estado atual
- **v0.1.0** ✅ Fundação (modularização, idioma)
- **v0.1.1** ✅ Cache + primeiros testes
- **v0.2.0** ✅ Alinhamento de silhuetas e normalização de proporção extrema

---

### 🧪 Fase 3 – Aprofundamento Científico (parte 1)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.2.1** | #17 | Comparação dino × dino na escala real. | Selecionar dois dinossauros, visualização lado a lado. |
| **v0.2.2** | #7, #6 | Modelo K‑Pg robusto e didático (estabilidade numérica + clareza). | Simulação sem valores inconsistentes, explicações acessíveis. |
| **v0.3.0** | #12, #13 | Calculadora de massa corporal (formula de Campione & Evans). | Entrada de circunferência femoral com limites realistas e equivalências. |
| **v0.3.1** | #5, #20 | Globo interativo com mais dinossauros no mapa e link para imagens. | ≥80% dos dinossauros com coordenadas; globo navegável. |
| **v0.3.2** | #6 | Link direto para Dinosaur Pictures na aba Escala Real. | Acesso externo, integração suave. |
| **v0.3.3** | **#4** | **Melhorar precisão paleogeográfica (Deriva Continental).** | **Coordenadas transformadas com maior fidelidade (idealmente com apoio do GPlates ou dataset especializado), documentação da fonte científica.** |

---

### 🧪 Fase 3 – Aprofundamento Científico (parte 2)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.4.0** | #8, #9 | Chave dicotômica melhorada (novos atributos) + fallback com imagens locais em `/assets`. | Características adicionais (largura, profundidade) distinguem ≥ 5 morfotipos; imagens offline disponíveis. |
| **v0.4.1** | #10, #11 | Aprimoramento da etimologia: eufonia, vogais de ligação, ≥ 20 radicais. | Nomes soam naturais; banco expandido. |
| **v0.4.2** | #18 | Gerador de nomes de dinossauros reais: banco de ~50 espécies com imagem e descrição (se possível). | Modo “real” mostra imagem, período, dieta e curiosidade. |

---

### 🎮 Fase 3 – Aprofundamento Científico (parte 3)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.5.0** | #19 | Jogo Paleo‑Detetive: reformula icnofósseis (mostra fóssil → perguntas → adivinhação). | Fluxo autoexplicativo, feedback visual, pronto para sala de aula. |

---

### 🚀 Fase 4 – Qualidade e Lançamento

| Versão | Atividades | Descrição |
|--------|-----------|-----------|
| **v1.0.0‑rc1** | Cobertura de testes ≥ 60%, testes de usabilidade com professores/alunos, correções de bugs. | App completo e validado. |
| **v1.0.0** | Documentação de deploy (Streamlit Cloud), ajustes finos, publicação final. | Estável, independente de serviços externos para imagens/dados, pronto para divulgação. |

---

### 📅 Cronograma sugerido (sprints de 2 semanas)

| Sprint | Versão | Entregas principais |
|--------|--------|---------------------|
| 1 (atual) | v0.2.1 | Issue #17 (comparação dino × dino) |
| 2 | v0.2.2 | Issues #7, #6 (modelo K‑Pg robusto e didático) |
| 3 | v0.3.0 | Issues #12, #13 (massa corporal) |
| 4 | v0.3.1 | Issues #5, #20 (globo + expansão dados) |
| 5 | v0.3.2 | Issue #6 (link Dinosaur Pictures) |
| **5.5** | **v0.3.3** | **Issue #4 (precisão paleogeográfica)** |
| 6 | v0.4.0 | Issues #8, #9 (chave dicotômica) |
| 7 | v0.4.1 | Issues #10, #11 (etimologia) |
| 8 | v0.4.2 | Issue #18 (dinossauros reais) |
| 9 | v0.5.0 | Issue #19 (jogo icnofósseis) |
| 10 | v1.0.0‑rc1 | Testes, usabilidade |
| 11 | v1.0.0 | Deploy e publicação |

---

*Nota:* A issue **#4** (*Paleo-detetive*, descrição detalhada do jogo) já está coberta pela issue **#19** na versão v0.5.0, portanto não foi duplicada. A nova issue **#4** adicionada refere‑se exclusivamente à **precisão paleogeográfica**.
