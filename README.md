# 🦴 PaleoLab Científico

Uma aplicação interativa em Streamlit para o ensino de paleontologia voltada aos ensinos fundamental e médio. Explore dinossauros com dados reais, modelos matemáticos e visualizações científicas.

![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python)
![Streamlit](https://img.shields.io/badge/Streamlit-1.28+-red?logo=streamlit)
![Licença](https://img.shields.io/badge/Licença-MIT-green)

---

## 📖 Descrição

O **PaleoLab Científico** é um laboratório virtual que transforma conceitos paleontológicos em atividades interativas. Através de abas temáticas, os estudantes podem:

- Comparar dinossauros em escala real (com silhuetas)
- Visualizar a deriva continental e a distribuição de fósseis
- Simular a extinção K‑Pg com o modelo Lotka‑Volterra
- Identificar pegadas com uma chave dicotômica
- Criar nomes científicos a partir de radicais gregos/latinos
- Estimar a massa corporal usando a circunferência femoral

Tudo baseado em dados reais do Paleobiology Database e em estudos publicados (Campione & Evans, 2012).

---

## 🧪 Funcionalidades (Abas)

| Aba                         | Descrição                                                                                                                                                  |
|-----------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **📏 Escala Real**          | Comparação visual de altura entre dinossauros e referências (humano, elefante, ônibus). Inclui explicação sobre ossos pneumáticos.                         |
| **🗺️ Deriva Continental**   | Mapa com pontos de descoberta de fósseis e opção de visualização no Cretáceo Superior (66 Ma), mostrando o efeito das placas tectônicas.                 |
| **🦠 Extinção K‑Pg**       | Simulador do colapso ecológico pós‑impacto do asteroide, baseado na dinâmica presa‑predador (Lotka‑Volterra) com parâmetros ajustáveis.                    |
| **👣 Icnofósseis**         | Chave dicotômica interativa para identificar icnogêneros de pegadas (Grallator, Eubrontes, Brontopodus, Anomoepus).                                        |
| **📖 Etimologia**          | Gerador de nomes fictícios de dinossauros usando radicais gregos/latinos, com explicação do significado e exemplos reais.                                 |
| **⚖️ Massa Corporal**      | Cálculo da massa estimada a partir da circunferência do fêmur, diferenciando bípedes e quadrúpedes, conforme Campione & Evans (2012).                      |

---

## 🚀 Como Executar

### Pré‑requisitos
- Python 3.8 ou superior
- pip (gerenciador de pacotes)

### Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/paleolab-cientifico.git
cd paleolab-cientifico
pip install -r requirements.txt
```

### Executando o aplicativo

```bash
streamlit run dino.py
```

O navegador abrirá automaticamente em `http://localhost:8501`.

---

## 🗂️ Estrutura do Projeto

```
.
├── dino.py               # Código principal do Streamlit
├── requirements.txt      # Dependências Python
├── assets/               # (Opcional) Imagens personalizadas
│   ├── trex.png
│   ├── triceratops.png
│   ├── velociraptor.png
│   ├── brachiosaurus.png
│   ├── human.png
│   ├── elephant.png
│   └── onibus.png
└── README.md             # Este arquivo
```

**Sobre as imagens:**  
Se a pasta `assets/` com os arquivos PNG não existir, o aplicativo gera automaticamente silhuetas simples usando o `matplotlib`. As imagens próprias podem ser adicionadas para melhorar a experiência visual.

---

## 📦 Dependências

As bibliotecas necessárias estão listadas em `requirements.txt`:

- `streamlit`
- `pandas`
- `numpy`
- `matplotlib`
- `Pillow`

Instale com:

```bash
pip install -r requirements.txt
```

---

## 🧠 Modelos Científicos Utilizados

- **Extinção K‑Pg:** Modelo de Lotka‑Volterra com três níveis tróficos (plantas, herbívoros, carnívoros), modificado para simular bloqueio solar e chuva ácida.
- **Massa Corporal:** Equação alométrica de Campione & Evans (2012):  
  `Massa = a × (Circunferência Femoral)^b`, com parâmetros diferentes para bípedes e quadrúpedes.
- **Deriva Continental:** As coordenadas dos fósseis no mapa do Cretáceo são ajustadas heuristicamente para refletir a posição aproximada dos continentes há 66 milhões de anos.

---

## 🤝 Contribuições

Contribuições são bem‑vindas! Se você tiver ideias para novas abas, melhorias visuais ou correções científicas, sinta‑se à vontade para abrir uma *issue* ou enviar um *pull request*.

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido para fins educacionais – inspire futuros paleontólogos!** 🦕
