## 🗺️ Roadmap — PaleoLab Científico (ATUALIZADO)

Este roadmap organiza as issues em fases lógicas de desenvolvimento. As fases já concluídas permanecem como registro, e as novas ideias são incorporadas nos momentos adequados.

---

### Fase 1 – Fundação Técnica e Estabilidade - `v0.1.0` ✅ RESOLVIDA

**Objetivo:** Preparar o código‑base para crescimento sustentável, eliminar gargalos e padronizar o projeto.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #14 | Modularização do código | Separar em `data.py`, `utils.py`, `components.py`. | 🔴 Alta |
| #15 | Padronização de idioma | Unificar código em português para consistência. | 🔴 Alta |
| #3  | Cache de imagens | Usar `st.cache_data`/`st.cache_resource` para evitar recarregamentos. | 🔴 Alta |
| #16 | Adicionar testes automatizados | `pytest` para funções auxiliares e cálculos (cobertura ≥ 60%). | 🟡 Média |

**Critérios de saída:**
- Estrutura de módulos clara e sem dependências circulares.
- Todos os textos de UI e comentários em português.
- Tempo de carregamento das imagens reduzido e mensurável.
- Testes rodando em CI (ex: GitHub Actions) com cobertura mínima.

---

### Fase 2 – Experiência do Usuário e Precisão Visual - `v0.2.0` ✅ RESOLVIDA

**Objetivo:** Ajustar as visualizações principais para que sejam didáticas, responsivas e fiéis à comunicação científica.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #1  | Melhorar alinhamento visual das silhuetas | Dispor imagens lado a lado com base alinhada (chão). | 🔴 Alta |
| #2  | Normalizar proporção extrema | Toggle entre escala real e adaptativa, com mensagem explicativa. | 🟡 Média |
| #6  | Tornar modelo de extinção mais didático | Adicionar equações e explicação simplificada no app. | 🟡 Média |
| #7  | Melhorar estabilidade numérica (Extinção) | `clamp` robusto ou solver Euler melhorado para evitar valores irreais. | 🔴 Alta |
| #12 | Validar entrada do usuário (Massa) | Limitar faixa de valores com base em dados reais e exibir erro. | 🟡 Média |
| #13 | Comparação com dinossauros reais (Massa) | Mostrar equivalentes como "igual a X elefantes". | 🟢 Baixa |
| 🆕 #17 | **Comparação dinossauro x dinossauro na escala** | Adicionar a opção de comparar o dinossauro selecionado com outro dinossauro (ex: T‑Rex vs Braquiossauro). Remover a opção "Ônibus Escolar", mantendo apenas referências biológicas (Humano, Elefante e outros dinossauros). | 🔴 Alta |

**Critérios de saída:**
- Comparação de escalas funciona bem em mobile e desktop.
- Simulação K‑Pg nunca gera números negativos ou presos em 0.1.
- O usuário entende o que cada parâmetro da equação significa.
- Calculadora de massa rejeita valores absurdos e oferece contexto.
- O seletor "Comparar com" exibe as opções: "Humano (1.7m)", "Elefante Africano (3.3m)" e uma lista dos dinossauros disponíveis (T-Rex, Braquiossauro, etc.).
- Ao selecionar um dinossauro como referência, a comparação visual é gerada com as silhuetas de ambos os dinossauros lado a lado, alinhadas pela base.

---

### Fase 3 – Aprofundamento Científico e Conteúdo - `v0.3.0`

**Objetivo:** Ampliar a base de dados e tornar as ferramentas mais fiéis ao conhecimento paleontológico atual.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| 🆕 #20 | **Substituir mapa de deriva continental por globo interativo** | Integrar o globo do [Ancient Earth](https://dinosaurpictures.org/ancient-earth#240) na aba "Deriva Continental". A abordagem recomendada é: **(1) Tentar incorporar via `st.iframe`** — o Streamlit oferece `st.iframe` para embutir URLs externas. Se o site `dinosaurpictures.org` permitir (sem bloqueio `X-Frame-Options` ou `Content-Security-Policy`), o globo pode ser exibido diretamente com `st.iframe("https://dinosaurpictures.org/ancient-earth#240", height=600)`. **(2) Fallback: usar `streamlit-folium` + GPlates Web Service** — Caso o iframe seja bloqueado, implementar um mapa 2D interativo com `streamlit-folium`, reconstruindo as coordenadas dos fósseis para o período geológico com o [GPlates Web Service](https://gws.gplates.org/reconstruct/reconstruct_points/). Esta abordagem oferece controle total sobre a visualização e não depende de serviços externos. O globo 3D completo pode ser deixado como melhoria futura. | 🔴 Alta |
| #5  | Adicionar mais dinossauros no mapa | Expandir base do Paleobiology Database (≥ 80% de cobertura das ocorrências fósseis). | 🟡 Média |
| #8  | Melhorar chave dicotômica (Icnofósseis) | Incluir novos atributos (largura, profundidade, espaçamento, etc.) para enriquecer a identificação. | 🟡 Média |
| #9  | Fallback de imagens externas (Icnofósseis) | Salvar assets localmente em `/assets` para uso offline. | 🟡 Média |
| #10 | Melhorar geração de nomes (Etimologia) | Adicionar regras de vogais de ligação e eufonia para gerar nomes verossímeis. | 🟢 Baixa |
| #11 | Adicionar mais radicais (Etimologia) | Expandir para ≥ 20 radicais reais da paleontologia. | 🟢 Baixa |
| 🆕 #18 | **Gerador de nomes reais com descrição** | Criar um banco com ~50 dinossauros reais. Ao clicar, exibir aleatoriamente nome, imagem (se disponível) e um parágrafo explicativo sobre o animal. | 🟡 Média |
| 🆕 #19 | **Jogo Paleo‑Detetive** | Reformular a aba de Icnofósseis: mostrar primeiro o fóssil (imagem) e depois guiar o usuário com perguntas educativas para que ele tente adivinhar a espécie. Exibir o resultado e a explicação apenas no final. | 🟡 Média |

**Critérios de saída:**
- O globo interativo do Ancient Earth (ou mapa interativo 2D como fallback) substitui o mapa `st.map()` na aba "Deriva Continental".
- A visualização é responsiva e permite ao usuário explorar diferentes períodos geológicos.
- Dinossauros exibidos são representativos da diversidade real.
- A chave dicotômica consegue distinguir pelo menos 5 morfotipos de pegadas.
- O gerador de nomes produz combinações verossímeis e sem cacofonia, além do modo de dinossauros reais com descrições informativas.
- O jogo de icnofósseis é auto‑explicativo, fornece feedback claro e pode ser usado em sala de aula sem instruções externas.

---

### Fase 4 – Qualidade, Robustez e Lançamento - `v1.0.0`

**Objetivo:** Garantir que todo o sistema funcione de forma integrada e estável, pronto para divulgação.

| Atividade | Responsável pela conclusão |
|-----------|----------------------------|
| Revisão dos testes (cobertura ≥ 60%) e adição de testes para componentes visuais simulados. | Issue #16 contínua |
| Teste de usabilidade com usuários reais (professores/alunos) para validar didática e novas features (jogo de icnofósseis, comparação dinossauro x dinossauro, globo interativo, etc.). | Nova tarefa |
| Documentação de deploy (Streamlit Cloud, requisitos, variáveis de ambiente). | Tarefa complementar |
| Correção de bugs menores identificados nas fases anteriores. | Manutenção geral |

**Critérios finais de aceite do roadmap:**
- Todas as issues das fases 1–3 estão fechadas.
- Aplicação online funciona sem depender de serviços externos para imagens e dados geográficos (exceto fontes científicas atualizáveis).
- O app pode ser usado por um professor em sala de aula sem treinamento prévio.

---

### Observações sobre dependências (atualizadas)

- **#14 e #15** já resolvidos; base para todas as outras fases.
- **#17 (comparação dinossauro x dinossauro)** é independente e deve ser implementada na Fase 2. Substitui a referência "Ônibus Escolar" por dinossauros do dataset (`df["Nome"]`).
- **#20 (globo interativo)** agora é uma issue separada na Fase 3. A abordagem de fallback com `streamlit-folium` + GPlates Web Service garante que a funcionalidade seja entregue mesmo se o iframe for bloqueado.
- **#19 (Jogo Paleo‑Detetive)** depende da disponibilidade das imagens (resolve‑se com #9) e das melhorias na chave (#8). Pode ser implementada após #8.
- O **Gerador de Nomes Reais (#18)** compartilha base de dados com #5 e pode ser construído após a expansão dos dinossauros no mapa.

---

### Sugestão de timeline revisada (sprints quinzenais)

| Sprint | Itens |
|--------|-------|
| 1 | #14, #15 (concluídos) |
| 2 | #3, #16 (testes iniciais) |
| 3 | #1, #2, #17 |
| 4 | #20 (pesquisa + integração do globo/mapa) |
| 5 | #6, #7, #5 |
| 6 | #8, #9, #12 |
| 7 | #10, #11, #18, #19 |
| 8 | Revisão, testes de usabilidade, correções finais, deploy |

---
