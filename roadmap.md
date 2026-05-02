# 🗺️ Roadmap — PaleoLab Científico

Este roadmap organiza as issues existentes em fases lógicas de desenvolvimento, priorizando a estabilidade do código, performance e experiência do usuário antes de enriquecer o conteúdo científico. Cada fase contém um conjunto de issues, objetivo principal e critérios de sucesso.

---

## Fase 1 – Fundação Técnica e Estabilidade - v0.1.0
**Objetivo:** Preparar o código-base para crescimento sustentável, eliminar gargalos de performance e padronizar o projeto.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #14 | Modularização do código | Separar em `data.py`, `utils.py`, `components.py`. | 🔴 Alta |
| #15 | Padronização de idioma | Unificar código em português (ou inglês) para consistência. | 🔴 Alta |
| #3  | Cache de imagens | Usar `st.cache_data`/`st.cache_resource` para evitar recarregamentos. | 🔴 Alta |
| #16 | Adicionar testes automatizados | `pytest` para funções auxiliares e cálculos (cobertura ≥ 60%). | 🟡 Média |

**Critérios de saída:**
- Estrutura de módulos clara e sem dependências circulares.
- Todos os textos de UI e comentários no mesmo idioma.
- Tempo de carregamento das imagens reduzido e mensurável.
- Testes rodando em CI (ex: GitHub Actions) com cobertura mínima.

---

## Fase 2 – Experiência do Usuário e Precisão Visual - v0.2.0
**Objetivo:** Ajustar as visualizações principais para que sejam didáticas, responsivas e fiéis à comunicação científica.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #1  | Melhorar alinhamento visual das silhuetas | Dispor imagens lado a lado com base alinhada (chão). | 🔴 Alta |
| #2  | Normalizar proporção extrema | Toggle entre escala real e adaptativa, com mensagem explicativa. | 🟡 Média |
| #6  | Tornar modelo de extinção mais didático | Adicionar equações e explicação simplificada no app. | 🟡 Média |
| #7  | Melhorar estabilidade numérica (Extinção) | `clamp` robusto ou solver Euler melhorado para evitar valores irreais. | 🔴 Alta |
| #12 | Validar entrada do usuário (Massa) | Limitar faixa de valores com base em dados reais e exibir erro. | 🟡 Média |
| #13 | Comparação com dinossauros reais (Massa) | Mostrar equivalentes como "igual a X elefantes". | 🟢 Baixa |

**Critérios de saída:**
- Comparação de escalas funciona bem em mobile e desktop.
- Simulação K-Pg nunca gera números negativos ou presos em 0.1.
- O usuário entende o que cada parâmetro da equação significa.
- Calculadora de massa rejeita valores absurdos e oferece contexto.

---

## Fase 3 – Aprofundamento Científico e Conteúdo - v0.3.0
**Objetivo:** Ampliar a base de dados e tornar as ferramentas mais fiéis ao conhecimento paleontológico atual.

| Issue | Título | Descrição resumida | Prioridade |
|-------|--------|-------------------|------------|
| #4  | Melhorar precisão paleogeográfica | Integrar GPlates ou dataset similar para coordenadas realistas. | 🔴 Alta |
| #5  | Adicionar mais dinossauros no mapa | Expandir base do Paleobiology Database (≥ 80% cobertura). | 🟡 Média |
| #8  | Melhorar chave dicotômica (Icnofósseis) | Incluir largura, profundidade, espaçamento etc. | 🟡 Média |
| #9  | Fallback de imagens externas (Icnofósseis) | Salvar assets localmente em `/assets` para uso offline. | 🟡 Média |
| #10 | Melhorar geração de nomes (Etimologia) | Adicionar regras de vogais de ligação e eufonia. | 🟢 Baixa |
| #11 | Adicionar mais radicais (Etimologia) | Expandir para ≥ 20 radicais reais da paleontologia. | 🟢 Baixa |

**Critérios de saída:**
- Coordenadas fósseis no mapa refletem a posição continental da época.
- Dinossauros exibidos no mapa são representativos da diversidade real.
- Chave dicotômica consegue distinguir pelo menos 5 morfotipos de pegadas.
- Gerador de nomes produz combinações verossímeis e sem cacofonia.

---

## Fase 4 – Qualidade, Robustez e Lançamento - v1.0.0
**Objetivo:** Garantir que todo o sistema funcione de forma integrada e estável, pronto para divulgação.

| Atividade | Responsável pela conclusão |
|-----------|----------------------------|
| Revisão dos testes (cobertura ≥ 60%) e adição de testes para componentes visuais simulados. | Issue #16 contínua |
| Teste de usabilidade com usuários reais (professores/alunos) para validar didática. | Nova tarefa |
| Documentação de deploy (Streamlit Cloud, requisitos, variáveis de ambiente). | Tarefa complementar |
| Correção de bugs menores identificados nas fases anteriores. | Manutenção geral |

**Critérios finais de aceite do roadmap:**
- Todas as issues das fases 1–3 estão fechadas.
- Aplicação online funciona sem depender de serviços externos para imagens e dados geográficos (exceto fontes científicas atualizáveis).
- O app pode ser usado por um professor em sala de aula sem treinamento prévio.

---

## Observações sobre dependências

- **#14 (Modularização) e #15 (Idioma)** devem ser resolvidos no início para evitar retrabalho.
- **#3 (Cache)** e **#9 (Fallback imagens)** podem ser implementados em paralelo.
- **#4 (Precisão paleogeográfica)** pode depender da disponibilidade de bibliotecas Python – uma pesquisa prévia é necessária.
- **#6 e #7 (Extinção)** são independentes, mas a didática (#6) pode ser construída após a estabilidade numérica (#7).

---

## Sugestão de timeline (sprints quinzenais)

| Sprint | Itens |
|--------|-------|
| 1 | #14, #15 |
| 2 | #3, #16 (início dos testes) |
| 3 | #1, #2 |
| 4 | #4, #5 (pesquisa e integração) |
| 5 | #6, #7 |
| 6 | #8, #9, #12 |
| 7 | #10, #11, #13 |
| 8 | Revisão, deploy, testes de usabilidade |

Essa timeline é flexível e pode ser adaptada conforme a disponibilidade da equipe.

---

Este roadmap fornece uma visão clara do caminho a seguir para transformar o PaleoLab em uma ferramenta educacional robusta, precisa e agradável. Todas as issues estão alinhadas com o objetivo de oferecer uma experiência científica interativa de alta qualidade.
