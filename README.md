# 🦴 PaleoLab Científico – v2.1.0 (Web Estática)

Laboratório virtual interativo para o ensino de paleontologia e ciências naturais, voltado para alunos do ensino fundamental e médio. Utiliza dados científicos reais, modelos matemáticos e jogos para explorar o mundo dos dinossauros – **tudo rodando diretamente no navegador, sem servidor backend**.

---

## 🆕 Novidades da v2.1.0

- **Viagem no Tempo:** a Linha do Tempo e a Deriva Continental viraram uma aba só. Você escolhe a idade, e o globo, o período, os dinossauros e o mapa de fósseis acompanham.
- **Novo Paleo‑Detetive:** veja a pegada fóssil e escolha qual dinossauro a deixou.
- **Árvore Evolutiva vertical**, no estilo de árvore genealógica, com exemplos de dinossauros em cada grupo (sem depender de bibliotecas externas).
- **Clima ampliado:** plantas de cada período e a seção "Mundo perdido", com curiosidades sobre o que existia e não existe mais.

## Novidades da v2.0.0

- **Nova interface:** design próprio com barra lateral, **tema claro/escuro**, painel inicial, notificações e layout pensado para celulares (inclusive telas com menos de 400 px).
- **Acessibilidade:** navegação completa por teclado, leitores de tela (ARIA), textos alternativos em todas as imagens e foco gerenciado.
- **Mais rápido:** bibliotecas externas carregadas só quando necessárias e imagens 4× menores.
- **Testes automatizados:** testes unitários com Jest (120 na v2.1.0).
- **Modo aplicativo:** layout de app Android (barra inferior, telas de seção, bottom sheets), usado pelo app [dino-app](https://github.com/fael0306/dino-app).
- **Backup do progresso:** exporte e importe suas conquistas em JSON.
- **Muitas melhorias de uso** em todas as abas: museu com busca e filtros, quiz com feedback imediato, simulador em tempo real, relatório PDF personalizável e mais.

Veja todos os detalhes no [CHANGELOG](CHANGELOG.md).

---

## ✨ Funcionalidades

**Explorar**
1. **📏 Escala Real** – Compare até 3 animais (dinossauros, humano ou elefante) lado a lado, com régua em metros.
2. **🦴 Fósseis Reais** – Museu com 50 espécies reais: busca, filtros por período e dieta, ordenação e ficha detalhada.
3. **⏳ Viagem no Tempo** – Escolha um momento entre 252 e 66 milhões de anos atrás: o globo da Terra antiga (Ancient Earth) mostra os continentes daquela era, aparecem o período, a época, os acontecimentos e os dinossauros, e o mapa mostra onde os fósseis daquela época foram encontrados.
4. **🌍 Clima Mesozoico** – Temperatura, CO₂ e nível do mar comparados com hoje, as plantas de cada período e o "Mundo perdido".
5. **🌳 Árvore Evolutiva** – Árvore genealógica vertical dos grandes grupos de répteis, com exemplos do museu em cada grupo.

**Laboratório**
6. **☄️ Extinção K‑Pg** – Simulador do impacto do asteroide (Lotka‑Volterra + Runge‑Kutta 4) com cenários prontos.
7. **⚖️ Massa Corporal** – Estimativa de massa pela circunferência do fêmur (Campione & Evans, 2012) com gráfico de dispersão.
8. **👣 Icnofósseis** – Jogo "Paleo‑Detetive": observe uma pegada fóssil e descubra qual dinossauro a deixou.

**Desafios**
9. **📝 Quiz & Batalha** – 60 perguntas em 3 níveis e duelos entre dois dinossauros com perguntas geradas na hora.
10. **🏆 Conquistas** – 7 medalhas, progresso e backup em JSON.
11. **📄 Relatório PDF** – Relatório com conquistas, quiz, batalha, simulação K‑Pg, escala e massa corporal.

---

## 🚀 Como executar

O PaleoLab é uma aplicação **estática**:

1. **Direto no navegador:** baixe o repositório e dê um duplo‑clique em `index.html`.
2. **Com um servidor local (recomendado):**
   ```bash
   python3 -m http.server 8000      # depois acesse http://localhost:8000
   # ou
   npx serve .
   ```
   Também funciona com a extensão Live Server do VS Code, GitHub Pages, nginx, Apache etc.

> ℹ️ **Internet:** os ícones já vêm no projeto (`vendor/`). Gráficos, mapa e PDF usam bibliotecas externas: rode `./scripts/baixar-bibliotecas.sh` uma vez para ter cópias locais; sem elas, o site busca as bibliotecas nas CDNs. O globo e o mapa sempre precisam de internet (o mapa usa OpenStreetMap, com Esri como reserva; nenhum dos dois exige chave de acesso). Recursos indisponíveis mostram um aviso com o botão "Tentar novamente".
>
> ℹ️ **Abrindo pelo arquivo (file://):** alguns navegadores bloqueiam a leitura de imagens locais em canvas. Por isso, só a imagem da comparação de escala dentro do PDF pode ficar de fora; use um servidor local para incluí‑la.

Cada aba tem um endereço próprio (por exemplo, `index.html#/quiz`), que pode ser compartilhado ou salvo nos favoritos.

### 📱 Modo aplicativo (Android)

Abrindo `index.html?plataforma=app`, o site troca a barra lateral por uma navegação de aplicativo: barra superior com botão voltar, barra inferior (Início, Explorar, Laboratório, Desafios), telas de seção, fichas em *bottom sheet* e avisos no estilo *snackbar*. É assim que o app Android ([fael0306/dino-app](https://github.com/fael0306/dino-app)) exibe o PaleoLab. No navegador, sem o parâmetro, nada muda.

O app e a página conversam por duas pontes:
- **Página → app:** o app injeta `window.PaleoLabNativo` (só na página principal, nunca em iframes). A página envia mensagens JSON com `chamarNativo(acao, dados)` (`js/ui.js`): `salvarArquivo` (`nome`, `mime`, `base64`), `temaMudou` (`tema`, `corTopo`, `corBase`) e `vibrar`.
- **App → página:** o botão voltar do Android chama `window.PaleoLabApp.voltar()`, que retorna `false` quando o app deve fechar.

---

## 🧪 Testes

```bash
npm install
npm test
```

Os testes ficam em `tests/` e rodam no ambiente `node` do Jest, sem dependências extras. As APIs do navegador (canvas, `Image`, `localStorage`, `<script>`) são simuladas em `tests/helpers.js`.

| Arquivo | O que testa |
|---------|-------------|
| `utils.test.js` | Icnofósseis e Paleo‑Detetive, simulação K‑Pg (valores de referência), massa corporal, escala, quiz, modo Batalha (todos os 2.450 pares), épocas e globo, árvore evolutiva, formatação |
| `imagens.test.js` | `gerarSilhuetaPlaceholder` (desenho determinístico) e as funções de carregamento de imagem |
| `store.test.js` | Conquistas, recordes, exportação e importação de progresso |
| `loader.test.js` | Carregamento condicional de bibliotecas (cópia local, CDN de reserva, erro, tempo esgotado) |
| `data.test.js` | Integridade dos dados (perguntas, espécies, coordenadas, clados) |

---

## 📁 Estrutura do projeto

```
dino/
├── index.html              # Página principal (estrutura e diálogos)
├── css/style.css           # Design system (temas claro/escuro, responsivo)
├── css/app.css             # Estilos do modo aplicativo
├── js/
│   ├── data.js             # Dados: dinossauros, quiz, clima, clados, conquistas
│   ├── utils.js            # Funções puras (simulação, icnofósseis, batalha...) e imagens
│   ├── store.js            # Progresso no localStorage + import/export JSON
│   ├── loader.js           # Carregamento sob demanda das bibliotecas externas
│   ├── ui.js               # Toasts, diálogo de confirmação, tema, estados
│   ├── app.js              # Núcleo: registro de abas e ações, conquistas
│   ├── abas/               # Um arquivo por aba (inicio.js, escala.js, quiz.js...)
│   ├── plataforma.js       # Modo aplicativo (versão Android)
│   └── main.js             # Navegação, menu e eventos centralizados (initEvents)
├── assets/                 # Silhuetas, fotos de fósseis e pegadas
├── vendor/                 # Ícones e cópias locais das bibliotecas
├── scripts/                # baixar-bibliotecas.sh
├── tests/                  # Testes Jest
├── package.json
├── CHANGELOG.md
└── roadmap.md
```

### Como adicionar uma aba

Crie `js/abas/minha-aba.js`, inclua o `<script>` no `index.html` (antes de `main.js`) e registre:

```js
registrarAba({
    id: 'minha-aba',
    titulo: 'Minha Aba',
    subtitulo: 'Descrição curta',
    icone: 'bi-star',          // ícone do Bootstrap Icons
    grupo: 'explorar',         // explorar | laboratorio | desafios
    render(container) {
        container.innerHTML = `<button class="btn btn-primario" data-action="minha-acao">Clique</button>`;
    }
});
registrarAcao('minha-acao', () => toast('Funcionou!', 'sucesso'));
```

A navegação, o menu e o painel inicial são montados automaticamente a partir do registro.

---

## 🎓 Contexto pedagógico

PaleoLab Científico foi desenhado para sala de aula ou estudo em casa, com:
- Linguagem acessível (português do Brasil).
- Conceitos de paleontologia e ecologia explicados passo a passo.
- Modelos matemáticos simples que mostram como a ciência real funciona.
- Jogos que estimulam a observação e o raciocínio lógico.
- Relatório em PDF para portfólio ou avaliação.

---

## 📚 Créditos e fontes

- **Ancient Earth Globe** – [dinosaurpictures.org/ancient-earth](https://dinosaurpictures.org/ancient-earth)
- **Paleobiology Database** – [paleobiodb.org](https://paleobiodb.org/)
- **Campione & Evans (2012)** – *A universal scaling relationship between body mass and proximal limb bone dimensions in quadrupedal terrestrial tetrapods.*
- **Paleomap Project** – [earthbyte.org](https://www.earthbyte.org/)
- **Modelo climático** – baseado em Scotese (2021) e IPCC (2021).
- Bibliotecas: Chart.js, Leaflet, jsPDF, Bootstrap Icons.

---

## 🤝 Contribuindo

Contribuições são bem‑vindas! Envie sugestões, bugs e novos recursos por *issues* e *pull requests*. Mantenha o estilo de código e adicione testes para novas funções em `js/utils.js`, `js/store.js` ou `js/loader.js`.

---

## 📄 Licença

Este projeto é distribuído sob a licença MIT.
