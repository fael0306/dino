# 🗺️ Roadmap — PaleoLab Científico (Atualizado)

Este roadmap organiza as issues em fases lógicas de desenvolvimento. As fases já concluídas permanecem como registro, e as novas ideias são incorporadas nos momentos adequados.

---

## Fase 1 – Fundação Técnica e Estabilidade - `v0.1.0` ✅ RESOLVIDA
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

## Fase 2 – Experiência do Usuário e Precisão Visual - `v0.2.0`
**Objetivo:** Ajustar as visualizações principais para que sejam didáticas, responsivas e fiéis à comunicação científica.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #1  | Melhorar alinhamento visual das silhuetas | Dispor imagens lado a lado com base alinhada (chão). | 🔴 Alta |
| #2  | Normalizar proporção extrema | Toggle entre escala real e adaptativa, com mensagem explicativa. | 🟡 Média |
| #6  | Tornar modelo de extinção mais didático | Adicionar equações e explicação simplificada no app. | 🟡 Média |
| #7  | Melhorar estabilidade numérica (Extinção) | `clamp` robusto ou solver Euler melhorado para evitar valores irreais. | 🔴 Alta |
| #12 | Validar entrada do usuário (Massa) | Limitar faixa de valores com base em dados reais e exibir erro. | 🟡 Média |
| #13 | Comparação com dinossauros reais (Massa) | Mostrar equivalentes como "igual a X elefantes". | 🟢 Baixa |
| 🆕 #17 | **Referência de dinossauro na escala** | Permitir comparar o tamanho com um dinossauro conhecido (ex: T‑Rex) para tornar as proporções mais intuitivas para alunos leigos. | 🟡 Média |

**Critérios de saída:**
- Comparação de escalas funciona bem em mobile e desktop.
- Simulação K‑Pg nunca gera números negativos ou presos em 0.1.
- O usuário entende o que cada parâmetro da equação significa.
- Calculadora de massa rejeita valores absurdos e oferece contexto.
- A nova referência de dinossauro aparece como opção no seletor ao lado de Humano, Elefante e Ônibus.

---

## Fase 3 – Aprofundamento Científico e Conteúdo - `v0.3.0`
**Objetivo:** Ampliar a base de dados e tornar as ferramentas mais fiéis ao conhecimento paleontológico atual.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #4  | Melhorar precisão paleogeográfica | Integrar visualização de globo terrestre da época (ex: Cretáceo) com a posição real dos continentes, substituindo a simples translação de coordenadas. Pode‑se usar GPlates, pygplates ou dataset de reconstrução continental. | 🔴 Alta |
| #5  | Adicionar mais dinossauros no mapa | Expandir base do Paleobiology Database (≥ 80% de cobertura das ocorrências fósseis). | 🟡 Média |
| #8  | Melhorar chave dicotômica (Icnofósseis) | Incluir novos atributos (largura, profundidade, espaçamento, etc.) para enriquecer a identificação. | 🟡 Média |
| #9  | Fallback de imagens externas (Icnofósseis) | Salvar assets localmente em `/assets` para uso offline. | 🟡 Média |
| #10 | Melhorar geração de nomes (Etimologia) | Adicionar regras de vogais de ligação e eufonia para gerar nomes verossímeis. | 🟢 Baixa |
| #11 | Adicionar mais radicais (Etimologia) | Expandir para ≥ 20 radicais reais da paleontologia. | 🟢 Baixa |
| 🆕 #18 | **Gerador de nomes reais com descrição** | Criar um banco com ~50 dinossauros reais. Ao clicar, exibir aleatoriamente nome, imagem (se disponível) e um parágrafo explicativo sobre o animal. | 🟡 Média |
| 🆕 #19 | **Jogo Paleo‑Detetive** | Reformular a aba de Icnofósseis: mostrar primeiro o fóssil (imagem) e depois guiar o usuário com perguntas educativas para que ele tente adivinhar a espécie. Exibir o resultado e a explicação apenas no final. | 🟡 Média |

**Critérios de saída:**
- Globo interativo (ou projeção) mostrando a posição dos continentes no período selecionado.
- Dinossauros exibidos no mapa são representativos da diversidade real.
- A chave dicotômica consegue distinguir pelo menos 5 morfotipos de pegadas.
- O gerador de nomes produz combinações verossímeis e sem cacofonia, além do modo de dinossauros reais com descrições informativas.
- O jogo de icnofósseis é auto‑explicativo, fornece feedback claro e pode ser usado em sala de aula sem instruções externas.

---

## Fase 4 – Qualidade, Robustez e Lançamento - `v1.0.0`
**Objetivo:** Garantir que todo o sistema funcione de forma integrada e estável, pronto para divulgação.

| Atividade | Responsável pela conclusão |
|-----------|----------------------------|
| Revisão dos testes (cobertura ≥ 60%) e adição de testes para componentes visuais simulados. | Issue #16 contínua |
| Teste de usabilidade com usuários reais (professores/alunos) para validar didática e novas features (jogo de icnofósseis, comparação com T‑Rex, etc.). | Nova tarefa |
| Documentação de deploy (Streamlit Cloud, requisitos, variáveis de ambiente). | Tarefa complementar |
| Correção de bugs menores identificados nas fases anteriores. | Manutenção geral |

**Critérios finais de aceite do roadmap:**
- Todas as issues das fases 1–3 estão fechadas.
- Aplicação online funciona sem depender de serviços externos para imagens e dados geográficos (exceto fontes científicas atualizáveis).
- O app pode ser usado por um professor em sala de aula sem treinamento prévio.

---

## Observações sobre dependências (atualizadas)

- **#14 e #15** já resolvidos; base para todas as outras fases.
- **#4 (paleogeografia)** agora inclui explicitamente a visualização de um globo ou mapa com os continentes da época, conforme sugerido por Jessy.
- **#19 (Jogo Paleo‑Detetive)** depende da disponibilidade das imagens (resolve‑se com #9) e das melhorias na chave (#8). Pode ser implementada após #8.
- **#17 (referência dinossauro)** é independente e pode ser feita em paralelo com a Fase 2.
- O **Gerador de Nomes Reais (#18)** compartilha base de dados com #5 e pode ser construído após a expansão dos dinossauros no mapa.

---

## Sugestão de timeline revisada (sprints quinzenais)

| Sprint | Itens |
|--------|-------|
| 1 | #14, #15 (concluídos) |
| 2 | #3, #16 (testes iniciais) |
| 3 | #1, #2, #17 |
| 4 | #4 (pesquisa + integração do globo), #5 |
| 5 | #6, #7 |
| 6 | #8, #9, #12 |
| 7 | #10, #11, #18, #19 |
| 8 | Revisão, testes de usabilidade, correções finais, deploy |

**Nota:** A sprint 4 foca na pesquisa de ferramentas de reconstrução paleogeográfica (GPlates, pygplates, ou APIs de mapa interativo). Caso a implementação de um globo dinâmico se mostre muito complexa para o escopo, uma projeção de mapa com os contornos das massas continentais da época já atenderá à sugestão de Jessy.
