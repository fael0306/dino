## Roadmap Completo do Programa — PaleoLab Científico

**Escopo:** Correção e consolidação da aba “📏 Escala Real” (Issue unificada) + melhorias de robustez e manutenibilidade.

---

### 🎯 Objetivo Geral
Eliminar falhas intermitentes de carregamento de imagens, centralizar a lógica de comparação de escala, remover duplicações e reforçar a confiabilidade didática do aplicativo.

---

### 🗂️ Fases e Atividades

#### Fase 1 – Correção Imediata de Bugs (Alta Prioridade)
**Tarefa 1.1 – Sanitização da seleção de referência**
- Criar função centralizada `get_referencia(label)`:
  - Recebe o texto do `radio` (ex.: “Humano (1.7m)”)
  - Retorna `(nome, comprimento_m, altura_m)` 
  - Substituir todas as ocorrências dispersas no código
- **Validação:** `if altura_ref <= 0: raise ValueError(...)`
- **Prazo:** 1 dia
- **Dependências:** Nenhuma

**Tarefa 1.2 – Proteção contra divisão por zero**
- Antes de `razao = altura_dino / altura_ref`:
  ```python
  if altura_ref <= 0:
      st.error("Erro nos dados de referência.")
      st.stop()
  ```
- **Prazo:** Imediato
- **Dependências:** Tarefa 1.1

**Tarefa 1.3 – Remoção de duplicações de cálculo de altura**
- Unificar as duas definições de `altura_ref` e `altura_dino` (hoje uma no bloco principal e outra no bloco de imagens).
- Extrair os valores **uma única vez** no início da aba.
- **Prazo:** Junto com 1.1

---

#### Fase 2 – Confiabilidade do Carregamento de Imagens (Alta Prioridade)
**Tarefa 2.1 – Sistema robusto de fallback**
- Criar função `load_image_with_fallback(asset_path, fallback_url)`:
  - Tenta carregar de `assets/` local
  - Se falhar, tenta URL com `requests.get(..., timeout=3)`
  - Caso falhe também, gera imagem placeholder (cor sólida com texto)
  - Registrar tentativas para debug (`st.session_state` ou log)
- **Cache opcional:** `@st.cache_data(ttl=3600)` apenas para imagens baixadas da internet.
- **Prazo:** 2 dias
- **Dependências:** Tarefa 1.3 (para usar os nomes corretos)

**Tarefa 2.2 – Fallback local independente de internet**
- Incluir na aplicação uma silhueta padrão SVG embutida (codificada em base64) para cada categoria (dinossauro genérico, humano, etc.)
- Se nenhum recurso externo funcionar, usar esse fallback estático.
- **Prazo:** 1 dia

**Tarefa 2.3 – Otimização do redimensionamento**
- Remover limites absolutos `max(30, min(new_height, 600))` que distorcem proporções.
- Adotar escala relativa baseada apenas na proporção real, com um fator de escala configurável `pixels_por_metro` ajustável à viewport.
- Para evitar imagens gigantes, aplicar `clamp` suave com mensagem visual (“diferença de escala > 10x – exibição reduzida para comparação”).
- **Prazo:** 2 dias
- **Dependências:** Tarefas 2.1 e 2.2

---

#### Fase 3 – Refatoração e DRY (Média Prioridade)
**Tarefa 3.1 – Extração de constantes e configurações**
- Mover mapeamentos `SILHUETAS` e parâmetros como `base_px`, referências para um módulo `config.py` ou dicionário central.
- **Prazo:** 0,5 dia

**Tarefa 3.2 – Revisão do `@st.cache_data`**
- Remover `@st.cache_data` de `load_dino_data()` (dataset estático e pequeno). Manter apenas onde há ganho real (ex.: `get_fossil_data` que simula API, `fetch_image` se houver download).
- **Prazo:** 0,5 dia

---

#### Fase 4 – Testes e Validação (Média Prioridade)
**Tarefa 4.1 – Cenários de teste**
- Executar app sem arquivos na pasta `assets/` → deve exibir placeholder.
- Executar sem internet → placeholder funcional.
- Verificar matemática: para cada combinação dinossauro+referência, exibir razão e confirmar com dados da tabela.
- Verificar que nenhum `st.error` ou exceção não tratada aparece.
- **Prazo:** 2 dias (paralelo a ajustes finos)

**Tarefa 4.2 – Teste de regressão nas outras abas**
- Garantir que nenhuma alteração quebrou as abas 2–6.
- **Prazo:** 1 dia

---

#### Fase 5 – Documentação e Deploy (Baixa Prioridade)
**Tarefa 5.1 – Comentários no código**
- Documentar funções novas (`get_referencia`, `load_image_with_fallback`) com docstrings.
- **Prazo:** 0,5 dia

**Tarefa 5.2 – Atualização do `README.md`**
- Incluir instruções sobre fallback, dependências e estrutura de assets.
- **Prazo:** 0,5 dia

---

### 📅 Cronograma Resumido
| Fase | Duração (dias úteis) | Entregável Principal |
|------|----------------------|----------------------|
| 1. Correções imediatas | 1–2 | Código sem duplicações, divisão segura |
| 2. Imagens robustas | 3–5 | Fallback triplo, redimensionamento proporcional |
| 3. Refatoração | 1 | Código mais limpo, cache otimizado |
| 4. Testes | 2–3 | Validação completa da aba |
| 5. Documentação | 1 | Código comentado, README atualizado |

**Total estimado:** 8–12 dias úteis (com um desenvolvedor dedicado em meio período).

---

### 🔄 Dependências entre Tarefas
- Fase 2 depende da conclusão da Fase 1 (cálculo centralizado).
- Testes (Fase 4) iniciam ao final da Fase 2 e 3.

---

### 📈 Métricas de Sucesso
- Zero erros ao carregar a aba “Escala Real” em qualquer condição de rede.
- Código da aba reduzido em pelo menos 30% de duplicações.
- Comparações visuais fidedignas (proporção exata, sem distorção por limites arbitrários).
- Tempo de resposta do app inalterado (fallbacks não devem causar lentidão perceptível).

---

### ⚠️ Riscos e Mitigações
| Risco | Mitigação |
|-------|-----------|
| Imagens placeholder muito genéricas | Usar silhuetas licenciadas (PhyloPic) embutidas como base64 |
| Fallback de internet lento | Implementar timeout curto e cache agressivo para URLs |
| Manutenção de limites de redimensionamento | Usar escala contínua com `pixels_por_metro` definido pelo usuário |

---

Com este roadmap, a equipe pode transformar uma aba atualmente frágil em um componente robusto, cientificamente preciso e de fácil manutenção, elevando a qualidade geral do PaleoLab Científico.
