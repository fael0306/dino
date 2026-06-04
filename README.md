# 🦴 PaleoLab Científico – v1.3.0

Laboratório virtual interativo para o ensino de paleontologia e ciências naturais.

<img width="1366" alt="PaleoLab Screenshot" src="https://github.com/user-attachments/assets/562b697e-8bf7-4e40-86ed-75411c365425" />

## ✨ Funcionalidades (12 abas)

1. **📏 Escala Real** – Compare silhuetas proporcionais.
2. **🗺️ Deriva Continental** – Globo interativo Ancient Earth + mapa de fósseis.
3. **🦠 Extinção K‑Pg** – Simulação Lotka‑Volterra com integração Runge‑Kutta 4.
4. **👣 Icnofósseis** – Jogo Paleo‑Detetive com pegadas fossilizadas.
5. **🦴 Fósseis Reais** – 50 dinossauros com curiosidades científicas.
6. **⚖️ Massa Corporal** – Estimativa por circunferência femoral (Campione & Evans, 2012).
7. **📝 Quiz** – 20 perguntas em 3 níveis de dificuldade.
8. **⏳ Linha do Tempo** – Navegue pelos períodos do Mesozoico.
9. **🌍 Clima Mesozóico** – Temperatura, CO₂ e vegetação de cada período.
10. **🏆 Conquistas** – Sistema de progressão (quiz, exploração, etc.).
11. **📄 Exportar PDF** – Gera relatório científico das simulações e conquistas.
12. **🌳 Árvore Evolutiva** – Cladograma interativo (NetworkX).

## 🚀 Como executar

(igual ao original, mas com dependências atualizadas)

```bash
pip install -r requirements.txt   # inclui plotly, fpdf, networkx
streamlit run dino.py
```

## 📁 Estrutura

(igual, mas note que `tests_components.py` deve ser renomeado para `test_components.py`)

## 📦 Requisitos (requirements.txt)

```
streamlit
pandas
numpy
matplotlib
Pillow
plotly
fpdf
networkx
```

## 🧪 Testes

```bash
pytest tests/
```

## 📚 Créditos (mesmos, acrescente:)

- **Modelo climático** baseado em Scotese (2021) e IPCC.

**📎 Resumo:** versão 1.3.0 adiciona simulação climática, linha do tempo, árvore evolutiva, sistema de conquistas e exportação PDF.