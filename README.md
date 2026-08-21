# 🦴 PaleoLab Científico – v1.4.0 (Web Estática)

Laboratório virtual interativo para o ensino de paleontologia e ciências naturais, voltado para alunos do ensino fundamental e médio. Utiliza dados científicos reais, modelos matemáticos e jogos para explorar o mundo dos dinossauros – **tudo rodando diretamente no navegador, sem necessidade de servidor backend**.

---

## ✨ Novidades da v1.4.0

- **🎯 Jogo de Icnofósseis dinâmico** – as perguntas extras (tamanho, forma, proporção) agora se atualizam instantaneamente quando o usuário altera as opções de dedos ou garras, tornando a experiência mais interativa.
- **🔄 Persistência entre abas** – cada aba é renderizada apenas uma vez; ao alternar entre elas, o estado (mapa, quiz, conquistas) é preservado, evitando recarregamentos desnecessários.
- **⏳ Feedback visual de carregamento** – spinners e mensagens de “Carregando…” foram adicionados na Escala Real, Icnofósseis e Simulação K‑Pg, melhorando a percepção de resposta.
- **🏅 Conquista “climaturista”** – agora é desbloqueada automaticamente ao explorar os três períodos climáticos (Triássico, Jurássico e Cretáceo) na aba Clima.
- **🛡️ Fallback robusto para bibliotecas externas** – se Chart.js, Leaflet, vis.js ou jsPDF não carregarem (por falha de rede), a aplicação exibe mensagens amigáveis e sugere recarregar a página, em vez de quebrar silenciosamente.

---

## ✨ Funcionalidades (12 abas)

1. **📏 Escala Real** – Compare qualquer dinossauro com um humano, elefante ou outro dinossauro, visualizando silhuetas proporcionais.
2. **🗺️ Deriva Continental** – Globo interativo da Terra antiga (Ancient Earth) e mapa de sítios fósseis de mais de 50 espécies.
3. **🦠 Extinção K‑Pg** – Simulador do impacto do asteroide baseado no modelo Lotka‑Volterra, com integração Runge‑Kutta 4.
4. **👣 Icnofósseis** – Jogo “Paleo‑Detetive” onde o aluno identifica icnogéneros a partir de características da pegada.
5. **🦴 Fósseis Reais** – Museu com 50 dinossauros reais, imagens e curiosidades taxonómicas.
6. **⚖️ Massa Corporal** – Estimativa de massa pela circunferência do fêmur, segundo Campione & Evans (2012).
7. **📝 Quiz** – Questionário de 20 perguntas em três níveis de dificuldade.
8. **⏳ Linha do Tempo** – Navegue pelos períodos do Mesozoico com slider interativo.
9. **🌍 Clima Mesozóico** – Explore temperatura, CO₂ e vegetação de cada período (Triássico, Jurássico, Cretáceo).
10. **🏆 Conquistas** – Sistema de progressão que desbloqueia medalhas ao completar desafios.
11. **📄 Exportar PDF** – Gera um relatório científico com suas simulações e conquistas.
12. **🌳 Árvore Evolutiva** – Cladograma hierárquico interativo (vis.js) mostrando relações filogenéticas.

### Dados científicos reais
- Ficha de 7 dinossauros “clássicos” (T‑Rex, Triceratops, Velociraptor, etc.).
- Banco expandido com 50 espécies reais e coordenadas paleogeográficas.
- Fórmulas da literatura (massa × circunferência femoral, modelo Lotka‑Volterra).
- Referências ao Paleobiology Database, Paleomap Project e IPCC.

---

## 🚀 Como executar (front‑end puro)

Como o PaleoLab é uma aplicação **estática**, você pode abri‑lo de várias formas:

### 1. Diretamente no navegador (mais simples)
- Baixe ou clone este repositório.
- Localize o arquivo `index.html`.
- **Dê um duplo‑clique** nele – ele abrirá no seu navegador padrão.

> ℹ️ Alguns navegadores podem bloquear requisições locais (CORS) ao carregar imagens da pasta `assets/`. Se isso ocorrer, use uma das opções abaixo.

### 2. Com Live Server (recomendado)
Se você usa o **VS Code**, instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer):
- Abra a pasta do projeto no VS Code.
- Clique com o botão direito sobre `index.html` e escolha **"Open with Live Server"**.
- O navegador abrirá automaticamente em `http://127.0.0.1:5500`.

### 3. Com um servidor HTTP simples (Python)
Se você tem Python instalado, pode usar o módulo `http.server`:
```bash
# Na raiz do projeto
python3 -m http.server 8000
```
Acesse `http://localhost:8000` no navegador.

### 4. Com qualquer outro servidor estático
Você pode usar `serve` (Node.js), `nginx`, Apache ou até mesmo o GitHub Pages – basta apontar para a pasta raiz.

---

## 📁 Estrutura do projeto

```
paleolab-cientifico/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos globais
├── js/
│   ├── data.js             # Todos os dados (dinossauros, quiz, clima, etc.)
│   ├── utils.js            # Funções utilitárias (imagens, simulações, identificação)
│   ├── components.js       # Renderização de cada aba e lógica principal
│   └── main.js             # Ponto de entrada (carrega components.js)
├── assets/                 # Pasta para imagens (a preencher pelo utilizador)
│   ├── trex.png
│   ├── triceratops.png
│   └── ...                 # demais arquivos .png (reais e placeholders)
└── README.md
```

> **Nota:** As imagens dos dinossauros devem ser colocadas na pasta `assets/`. Enquanto não existirem, o aplicativo gera automaticamente silhuetas geométricas coloridas.

---

## 🧪 Testes (futuro)

Atualmente não há testes automatizados. O roadmap prevê a implementação de testes unitários com Jest na versão 2.0.0.

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
- **Modelo climático** – baseado em Scotese (2021) e IPCC (2021).

---

## 🤝 Contribuindo

Contribuições são bem‑vindas!  
Sugestões, reporte de bugs e novos recursos podem ser enviados via *issues* e *pull requests*.  
Por favor, mantenha o estilo de código e adicione testes para novas funcionalidades.

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

**📎 Resumo:** Esta versão **1.4.0** consolida importantes melhorias de usabilidade, robustez e experiência do usuário, mantendo a natureza totalmente front‑end e sem dependências Python. Basta abrir o `index.html` no navegador ou usar um servidor estático simples para desfrutar de todas as funcionalidades.