## 🗺️ Roadmap — PaleoLab Científico (v2 granular)

> **Filosofia:** cada versão entrega um valor concreto, testável e independente. As fases originais continuam como grandes épicos, mas as releases são quebradas em incrementos menores.

### 🔧 Fase 1 – Fundação Técnica e Estabilidade

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.1.0** | #14, #15 | Modularização do código e padronização do idioma (português). | Estrutura de módulos (data, utils, components) sem dependências circulares; todas as strings da UI em português. |
| **v0.1.1** | #3, #16 | Cache de imagens e primeiros testes automatizados. | Carregamento de imagens reduzido (cache comprovado); pytest com cobertura ≥ 40% sobre funções essenciais. |

---

### 🎨 Fase 2 – Experiência do Usuário e Precisão Visual

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.2.0** | #1, #2 | Alinhamento das silhuetas pela base e normalização de proporções extremas. | Imagens lado a lado, base comum; botão de toggle entre escala real e adaptativa, com nota informativa. |
| **v0.2.1** | #17 | Comparação dinossauro × dinossauro (remove “Ônibus Escolar”, mantém humano, elefante e outros dinossauros). | Seletor “Comparar com” oferece apenas referências biológicas; comparação visual funciona com dois dinossauros. |
| **v0.2.2** | #7, #6 (modelo extinção) | Estabilidade numérica da simulação K‑Pg (Euler semi‑implícito) + explicação didática das equações Lotka‑Volterra. | Simulação nunca gera valores negativos ou travados; seção explicativa com LaTeX e tabela de parâmetros visível. |

---

### 📊 Fase 3 – Aprofundamento Científico e Conteúdo (parte 1)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.3.0** | #12, #13 | Validação de entrada na massa corporal e equivalências com animais reais (elefantes, T‑Rex, Patagotitan). | Erro claro para valores irreais; métricas de comparação exibidas automaticamente. |
| **v0.3.1** | #5, #20 | Expansão da base de dinossauros (≥ 80% de cobertura do PaleoDB) + substituição do mapa estático por globo interativo do Ancient Earth. | Globo incorporado via iframe com fallback funcional (Folium + GPlates); novos dinossauros aparecem no seletor e no mapa. |
| **v0.3.2** | #6 (Dinosaur Pictures) | Link/botão que redireciona para a galeria do Dinosaur Pictures do dinossauro selecionado. | Link funcional, abre em nova aba, sem bloqueios de segurança. (Opcional: thumbnail se viável). |

---

### 🧪 Fase 3 – Aprofundamento Científico e Conteúdo (parte 2)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.4.0** | #8, #9 | Chave dicotômica melhorada (novos atributos: largura, profundidade) + fallback com imagens locais em `/assets`. | Chave diferencia pelo menos 5 morfotipos; imagens offline disponíveis. |
| **v0.4.1** | #10, #11 | Aprimoramento da etimologia: regras de eufonia, vogais de ligação e expansão para ≥ 20 radicais. | Nomes gerados soam naturais e sem cacofonia; banco de radicais ampliado. |
| **v0.4.2** | #18 | Gerador de dinossauros reais: banco de ~50 espécies com imagem e descrição informativa. | Modo “dinossauro real” acessível, exibe imagem e texto científico. |

---

### 🎮 Fase 3 – Aprofundamento Científico e Conteúdo (parte 3)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.5.0** | #19 | Jogo Paleo‑Detetive: reformula aba de icnofósseis para mostrar o fóssil primeiro e depois perguntas para adivinhar. | Fluxo autoexplicativo, feedback claro, utilizável em sala de aula sem instruções. |

---

### 🚀 Fase 4 – Qualidade, Robustez e Lançamento

| Versão | Atividades | Descrição |
|--------|-----------|-----------|
| **v1.0.0‑rc1** | Testes de integração, cobertura ≥ 60%, revisão de usabilidade com professores/alunos. | Aplicação completa, todos os fluxos validados. |
| **v1.0.0** | Documentação de deploy (Streamlit Cloud), ajustes finos, correções de bugs reportados no piloto. | App online, independente de serviços externos para imagens/dados (exceto links opcionais). Pronto para divulgação. |

---

### 📅 Cronograma sugerido (sprints de 2 semanas)

| Sprint | Versão | Entregas |
|--------|--------|----------|
| 1 | v0.1.0 | Modularização + idioma |
| 2 | v0.1.1 | Cache + testes iniciais |
| 3 | v0.2.0 | Alinhamento de silhuetas + proporção |
| 4 | v0.2.1 | Comparação dino × dino |
| 5 | v0.2.2 | Simulação K‑Pg robusta e didática |
| 6 | v0.3.0 | Validação de massa + equivalências |
| 7 | v0.3.1 | Globo interativo + expansão de dados |
| 8 | v0.3.2 | Link Dinosaur Pictures |
| 9 | v0.4.0 | Chave dicotômica + assets offline |
| 10 | v0.4.1 | Etimologia melhorada |
| 11 | v0.4.2 | Gerador de dinossauros reais |
| 12 | v0.5.0 | Jogo Paleo‑Detetive |
| 13 | v1.0.0‑rc1 | Testes de usabilidade e cobertura |
| 14 | v1.0.0 | Deploy e correções finais |

---

### 💡 Por que essa mudança?

- **Menos risco:** cada versão é pequena e testável, evitando “big bangs” que podem quebrar tudo.
- **Feedback contínuo:** após cada release, é possível validar com usuários (professores/alunos) e ajustar prioridades.
- **Motivação da equipe:** entregas frequentes geram senso de progresso.
- **Semântica profissional:** versões no estilo `MAJOR.MINOR.PATCH` refletem maturidade do projeto.

Se quiser, posso detalhar ainda mais as dependências entre as versões ou sugerir uma estratégia de branching (Git Flow, GitHub Flow) alinhada a esse roadmap.
