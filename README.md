# 🦴 PaleoLab Científico

Laboratório virtual interativo para o ensino de paleontologia e ciências naturais, voltado para alunos do ensino fundamental e médio. Utiliza dados científicos reais, modelos matemáticos e jogos para explorar o mundo dos dinossauros.

<img width="1366" height="768" alt="PaleoLab Screenshot" src="https://github.com/user-attachments/assets/562b697e-8bf7-4e40-86ed-75411c365425" />

---

## ✨ Funcionalidades

### Abas disponíveis
1. **📏 Escala Real** – Compare qualquer dinossauro com um humano, elefante ou outro dinossauro, visualizando silhuetas proporcionais.
2. **🗺️ Deriva Continental** – Globo interativo da Terra antiga (Ancient Earth) e mapa de sítios fósseis de mais de 50 espécies.
3. **🦠 Extinção K‑Pg** – Simulador do impacto do asteroide baseado no modelo Lotka‑Volterra, agora com integração Runge‑Kutta 4.
4. **👣 Icnofósseis** – Jogo “Paleo‑Detetive” onde o aluno identifica icnogéneros a partir de características da pegada.
5. **🦴 Fósseis Reais** – Museu com 50 dinossauros reais, imagens e curiosidades taxonómicas.
6. **⚖️ Massa Corporal** – Estimativa de massa pela circunferência do fêmur, segundo Campione & Evans (2012).
7. **📝 Quiz** – Questionário de 20 perguntas em três níveis de dificuldade.

### Dados científicos reais
- Ficha de 7 dinossauros “clássicos” (T‑Rex, Triceratops, Velociraptor, etc.).
- Banco expandido com 50 espécies reais e coordenadas paleogeográficas.
- Fórmulas da literatura (massa × circunferência femoral, modelo Lotka‑Volterra).
- Referências ao Paleobiology Database e Paleomap Project.

---

## 🚀 Como executar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/paleolab-cientifico.git
   cd paleolab-cientifico
   ```

2. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```
   *Requer Python 3.9+ e Streamlit 1.28+.*

3. **Execute a aplicação**
   ```bash
   streamlit run dino.py
   ```

4. **Acesse** `http://localhost:8501` no seu navegador.

> 💡 **Nota sobre as imagens:** As figuras dos dinossauros devem ser colocadas na pasta `assets/`. Enquanto não existirem, o aplicativo gera automaticamente silhuetas geométricas coloridas.

---

## 📁 Estrutura do projeto

```
paleolab-cientifico/
├── dino.py                # Ponto de entrada da aplicação Streamlit
├── components.py          # Componentes visuais e lógica de cada aba
├── data.py                # Carregamento de dados (dinossauros, quiz, etc.)
├── utils.py               # Funções utilitárias (imagens, escalas, gráficos)
├── assets/                 # Pasta para as imagens (a preencher pelo utilizador)
├── tests/
│   ├── test_data.py
│   ├── test_components.py
│   └── test_utils.py
├── requirements.txt       # Lista de dependências Python
└── README.md
```

---

## 🧪 Testes

O projeto possui testes unitários com `pytest`. Para executá‑los:

```bash
pip install pytest
pytest tests/
```

Cobertura actual: funções de dados, classificador de icnofósseis, simulação K‑Pg e utilitários de imagem.

---

## 🎓 Contexto pedagógico

PaleoLab Científico foi desenhado para ser utilizado em sala de aula ou em casa, com:
- Linguagem acessível (português do Brasil).
- Conceitos da paleontologia e ecologia explicados passo a passo.
- Modelos matemáticos simples que mostram como a ciência real funciona.
- Jogos que estimulam a observação e o raciocínio lógico.

---

## 📚 Créditos e fontes

- **Ancient Earth Globe** – [dinosaurpictures.org/ancient-earth](https://dinosaurpictures.org/ancient-earth)
- **Paleobiology Database** – [paleobiodb.org](https://paleobiodb.org/)
- **Campione & Evans (2012)** – *A universal scaling relationship between body mass and proximal limb bone dimensions in quadrupedal terrestrial tetrapods.*
- **Paleomap Project** – [earthbyte.org](https://www.earthbyte.org/)

---

## 📦 Requisitos

As dependências estão listadas em `requirements.txt`. Principais bibliotecas:
- `streamlit`
- `pandas`
- `matplotlib`
- `Pillow`
- `numpy`

---

## 🤝 Contribuindo

Contribuições são bem‑vindas!  
Sugestões, reporte de bugs e novos recursos podem ser enviados via *issues* e *pull requests*.  
Por favor, mantenha o estilo de código e adicione testes para novas funcionalidades.

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Consulte o ficheiro [LICENSE](LICENSE) para mais informações.

---

**📎 Resumo:** A versão 1.0.0 marca o lançamento completo do PaleoLab Científico, pronto para utilização em contexto educativo, com todas as ferramentas interactivas planeadas, dados científicos actualizados e uma base de código sólida e testada.
