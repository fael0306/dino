# 🦴 PaleoLab Científico v1.0.0

**Explorando dinossauros com dados reais e modelos matemáticos da paleontologia.**

O PaleoLab Científico é uma aplicação interativa desenvolvida em [Streamlit](https://streamlit.io/), voltada para o ensino fundamental e médio. Com visualizações imersivas, jogos educativos e simulações científicas, o app convida os alunos a mergulharem no mundo da paleontologia de forma prática e divertida.

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/562b697e-8bf7-4e40-86ed-75411c365425" />

---

## ✨ Funcionalidades

### 📏 Escala Real
- Compare o tamanho de um dinossauro com um humano, um elefante africano ou outro dinossauro.
- Silhuetas redimensionadas lado a lado, alinhadas pela base, com proporção exata.
- Link externo para imagens no Dinosaur Pictures.
- Explicação sobre ossos pneumáticos (adaptação evolutiva).

### 🗺️ Deriva Continental
- Globo interativo do [Ancient Earth](https://dinosaurpictures.org/ancient-earth) embutido via iframe.
- Selecione entre **Mundo Atual, Cretáceo Superior, Jurássico Superior e Triássico Médio**.
- Visualize no mapa 2D os sítios fossilíferos de **50 dinossauros reais**, com dados do Paleobiology Database.
- Opção de lista de coordenadas (latitude/longitude).

### 🦠 Extinção K‑Pg
- Simulação do ecossistema pós‑impacto usando o modelo **Lotka‑Volterra**.
- Integração numérica via **Runge‑Kutta de 4ª ordem** (RK4) para maior precisão.
- Parâmetros ajustáveis: bloqueio solar, chuva ácida e anos de simulação.
- Equações exibidas em LaTeX, explicação detalhada dos coeficientes ecológicos.
- Interpretação automática do resultado: colapso total, ecossistema devastado ou estável.

### 👣 Icnofósseis – Jogo Paleo‑Detetive
- Desafio: observe uma pegada fóssil e responda perguntas (dedos, garras, tamanho, forma).
- Ao final, o sistema revela qual icnogênero você descreveu e compara com o fóssil real.
- **8 icnogêneros** disponíveis: *Grallator, Eubrontes, Megalosauripus, Wintonopus, Amblydactylus, Anomoepus, Brontopodus, Parabrontopodus*.
- Feedback lúdico com balões e explicações científicas.

### 🦴 Fósseis Reais
- Botão para sortear aleatoriamente um dos **50 dinossauros reais** do banco de dados.
- Exibe imagem do fóssil (ou silhueta artística), período, dieta, tamanho e uma **curiosidade exclusiva**.
- Ideal para atividades de descoberta e discussão em sala de aula.

### ⚖️ Massa Corporal
- Estime a massa de um dinossauro a partir da circunferência do fêmur, com base no estudo de Campione & Evans (2012).
- Fórmulas diferentes para bípedes e quadrúpedes.
- Validação dos limites realistas (ex.: fêmur de T. rex ~58 cm).
- Equivalência visual: “quantos elefantes”, “quantos T. rex” e “quantos Patagotitan” equivalem à massa calculada.

---

## 🧰 Tecnologias Utilizadas

- **Python 3.8+**
- **Streamlit** – interface web interativa
- **Pandas** – manipulação de dados
- **Matplotlib** – gráficos e silhuetas
- **Pillow (PIL)** – processamento de imagens
- **NumPy** – cálculos numéricos
- **Streamlit Components** – injeção de HTML/iframe

---

## 📁 Estrutura do Projeto

```
paleolab/
├── dino.py                   # Ponto de entrada da aplicação Streamlit
├── components.py             # Componentes das abas (lógica de interface)
├── data.py                   # Dados e funções de acesso a dados
├── utils.py                  # Funções utilitárias (imagens, escalas, etc.)
├── assets/                   # Imagens das silhuetas e fósseis
├── tests/
│   ├── test_data.py
│   ├── test_components.py
│   └── test_utils.py
├── requirements.txt
└── README.md
```

---

## 🚀 Instalação e Execução

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seuusuario/paleolab.git
   cd paleolab
   ```

2. **Crie um ambiente virtual (recomendado)**

   ```bash
   python -m venv venv
   source venv/bin/activate      # Linux/macOS
   venv\Scripts\activate         # Windows
   ```

3. **Instale as dependências**

   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o aplicativo**

   ```bash
   streamlit run dino.py
   ```

   O navegador abrirá automaticamente em `http://localhost:8501`.

---

## 🧪 Testes

O projeto inclui testes unitários para garantir a integridade das funções de dados, dos componentes e dos utilitários.

Para executá‑los:

```bash
pytest tests/
```

Os testes cobrem:
- Carga correta dos datasets
- Classificação dos icnogêneros
- Simulação da extinção K‑Pg (RK4)
- Funções de manipulação de imagem
- Coordenadas paleogeográficas

---

## 🤝 Contribuição

Contribuições são muito bem‑vindas! Sugestões, correções de bugs, novas ideias de abas ou melhorias nos modelos são ótimas formas de ajudar.

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b minha-feature`
3. Commit suas mudanças: `git commit -m 'Adiciona nova funcionalidade'`
4. Push para a branch: `git push origin minha-feature`
5. Abra um Pull Request

Antes de enviar, verifique se os testes passam e, se possível, adicione testes para as novas funcionalidades.

---

## 📜 Licença

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📚 Créditos e Referências

- **Dados de dinossauros**: [Paleobiology Database](https://paleobiodb.org/)
- **Globo interativo**: [Ancient Earth](https://dinosaurpictures.org/ancient-earth) (projeto Paleomap)
- **Modelo de massa corporal**: Campione, N. E., & Evans, D. C. (2012) – *BMC Biology*
- **Silhuetas e imagens**: originais ou geradas proceduralmente (fallback)
- **Desenvolvimento**: comunidade de professores e entusiastas da paleontologia

---

🐾 *Explore, aprenda e divirta‑se com a ciência dos gigantes que já dominaram a Terra!*
