Com base no código atual e nas decisões tomadas, aqui está o **Roadmap atualizado do PaleoLab Científico**, refletindo o que já foi implementado, o cancelamento da v0.4.1 e as próximas etapas.

---

## 🗺️ Roadmap — PaleoLab Científico (Revisão pós‑código)

### ✅ Estado atual (pré‑release 0.4.0)
- **v0.1.0** ✅ Fundação (modularização, idioma)
- **v0.1.1** ✅ Cache + primeiros testes
- **v0.2.0** ✅ Alinhamento de silhuetas e normalização de proporção extrema
- **v0.2.1** ✅ Comparação dino × dino (#17)
- **v0.2.2** ✅ Modelo K‑Pg didático + estabilidade numérica básica (#7, #6)
- **v0.3.0** ✅ Calculadora de massa corporal (#12, #13)
- **v0.3.1** ✅ Globo interativo da Terra antiga + expansão parcial de coordenadas (#5, #20)
- **v0.3.2** ✅ Link para Dinosaur Pictures na escala real (#6)
- **v0.3.3** ✅ Melhoria inicial da precisão paleogeográfica (#4)
- **v0.4.0** ✅ Chave dicotômica aprimorada com fallback local (#8, #9) + Museu de Fósseis Reais com 50 espécies (#18)
- ~~v0.4.1~~ ❌ **Cancelada** (substituída pela v0.4.2)

---

### 🧪 Próximas etapas da Fase 3 (refinamento)

| Versão | Issues | Descrição | Critérios de aceitação |
|--------|--------|-----------|------------------------|
| **v0.4.3** | #4, #5, #7 | Refinamento da Deriva Continental (precisão paleogeográfica com GPlates/dataset científico) + expansão de coordenadas para ≥80% dos dinossauros + estabilidade numérica definitiva do modelo K‑Pg (Euler melhorado, sem limites artificiais). | Coordenadas mais fiéis ao período geológico; simulação sem valores inconsistentes; mapa completo. |
| **v0.5.0** | #19 | Jogo Paleo‑Detetive: reformulação total da aba de icnofósseis (mostrar fóssil → perguntas → adivinhação com feedback educativo). | Fluxo autoexplicativo, adequado para leigos, pronto para uso em sala de aula. |

---

### 🚀 Fase 4 – Qualidade e Lançamento

| Versão | Atividades | Descrição |
|--------|-----------|-----------|
| **v1.0.0‑rc1** | Cobertura de testes ≥ 60%, testes de usabilidade com professores/alunos, correções de bugs. | App completo e validado. |
| **v1.0.0** | Documentação de deploy (Streamlit Cloud), ajustes finos, publicação final. | Estável, independente de serviços externos, pronto para divulgação. |

---

### 📅 Cronograma sugerido (a partir da release 0.4.0)

| Sprint | Duração | Versão | Entregas principais |
|--------|---------|--------|---------------------|
| 1 | 2 semanas | v0.4.0 | **Release atual** (já codificada) |
| 2 | 2 semanas | v0.4.3 | Issues #4, #5, #7 (deriva continental + K‑Pg) |
| 3 | 2 semanas | v0.5.0 | Jogo Paleo‑Detetive (#19) |
| 4 | 2 semanas | v1.0.0‑rc1 | Testes, ajustes de usabilidade |
| 5 | 2 semanas | v1.0.0 | Deploy e publicação final |

---

### 📋 Detalhamento das issues pendentes

- **#4 (Precisão paleogeográfica):** Hoje as coordenadas são convertidas de forma simplificada. A ideia é integrar uma reconstrução tectônica (ex.: pyGPlates ou dados do EarthByte) para mostrar os sítios fósseis nas posições corretas do passado.
- **#5 (Cobertura de coordenadas):** Atualmente apenas 7 dinossauros possuem localização no mapa. Expandir a base com dados do Paleobiology Database para alcançar ≥80% das espécies do app.
- **#7 (Estabilidade numérica K‑Pg):** Substituir o método semi‑implícito atual por um esquema Runge‑Kutta de ordem 2 ou 4, garantindo que populações nunca atinjam valores negativos mesmo com parâmetros extremos.
- **#19 (Jogo Paleo‑Detetive):** Transformar a identificação de pegadas em uma experiência gamificada: exibir a imagem do icnofóssil, guiar o usuário por perguntas e só revelar a resposta após a tentativa, com explicações didáticas.

---

Este roadmap reflete fielmente o código que você possui agora e organiza as melhorias restantes de forma incremental. A **release 0.4.0** pode ser gerada imediatamente, pois tudo já está implementado e funcional.
