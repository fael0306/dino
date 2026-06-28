// js/data.js

// ============================================================
// 1. Dinossauros "clássicos" (usados na Escala Real e Massa)
// ============================================================
const DINOSSAUROS_CLASSICOS = [
    { Nome: "Tyrannosaurus rex", Periodo: "Cretáceo", Dieta: "Carnívoro", Comprimento: 12.3, Altura: 4.0, Peso: 8.4, Postura: "Bípede" },
    { Nome: "Triceratops", Periodo: "Cretáceo", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 3.0, Peso: 6.0, Postura: "Quadrúpede" },
    { Nome: "Velociraptor", Periodo: "Cretáceo", Dieta: "Carnívoro", Comprimento: 2.0, Altura: 0.5, Peso: 0.015, Postura: "Bípede" },
    { Nome: "Brachiosaurus", Periodo: "Jurássico", Dieta: "Herbívoro", Comprimento: 25.0, Altura: 12.0, Peso: 50.0, Postura: "Quadrúpede" },
    { Nome: "Stegosaurus", Periodo: "Jurássico", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 4.0, Peso: 7.0, Postura: "Quadrúpede" },
    { Nome: "Spinosaurus", Periodo: "Cretáceo", Dieta: "Piscívoro", Comprimento: 15.0, Altura: 5.0, Peso: 7.5, Postura: "Bípede" },
    { Nome: "Patagotitan", Periodo: "Cretáceo", Dieta: "Herbívoro", Comprimento: 37.0, Altura: 8.0, Peso: 70.0, Postura: "Quadrúpede" }
];

// ============================================================
// 2. Banco de 50 dinossauros reais (completos)
// ============================================================
const DINOSSAUROS_REAIS = [
    { Nome: "Tyrannosaurus rex", Periodo: "Cretáceo Superior", Dieta: "Carnívoro", Comprimento: 12.3, Altura: 4.0, Peso: 8.4, Postura: "Bípede", Curiosidade: "O T. rex possuía a mordida mais forte de qualquer animal terrestre, capaz de esmagar ossos com uma força equivalente a 6 toneladas." },
    { Nome: "Triceratops horridus", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 3.0, Peso: 6.0, Postura: "Quadrúpede", Curiosidade: "Seu nome significa 'cabeça com três chifres'. Provavelmente usava os chifres e o grande folho ósseo em disputas territoriais e defesa." },
    { Nome: "Velociraptor mongoliensis", Periodo: "Cretáceo Superior", Dieta: "Carnívoro", Comprimento: 2.0, Altura: 0.5, Peso: 0.015, Postura: "Bípede", Curiosidade: "Menor do que o retratado em filmes, o Velociraptor tinha penas e uma garra retrátil no pé, usada para caçar pequenas presas." },
    { Nome: "Brachiosaurus altithorax", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 25.0, Altura: 12.0, Peso: 50.0, Postura: "Quadrúpede", Curiosidade: "Um dos maiores dinossauros, o Braquiossauro tinha as narinas no topo da cabeça, o que levou cientistas a pensarem que ele passava muito tempo submerso." },
    { Nome: "Stegosaurus stenops", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 4.0, Peso: 7.0, Postura: "Quadrúpede", Curiosidade: "As placas ósseas do Stegossauro podem ter servido para termorregulação, além de exibição. O 'talo' na cauda era uma arma perigosa." },
    { Nome: "Spinosaurus aegyptiacus", Periodo: "Cretáceo Superior", Dieta: "Piscívoro", Comprimento: 15.0, Altura: 5.0, Peso: 7.5, Postura: "Bípede", Curiosidade: "O Espinossauro possuía uma vela neural de até 1,8 m e adaptações para a vida semiaquática, sendo um dos maiores dinossauros carnívoros." },
    { Nome: "Patagotitan mayorum", Periodo: "Cretáceo Inferior", Dieta: "Herbívoro", Comprimento: 37.0, Altura: 8.0, Peso: 70.0, Postura: "Quadrúpede", Curiosidade: "O Patagotitan é um dos maiores animais que já andaram na Terra, pesando cerca de 70 toneladas – o equivalente a 10 elefantes africanos." },
    { Nome: "Allosaurus fragilis", Periodo: "Jurássico Superior", Dieta: "Carnívoro", Comprimento: 8.5, Altura: 3.0, Peso: 2.3, Postura: "Bípede", Curiosidade: "O Alossauro era o principal predador do Jurássico, com dentes serrilhados e garras fortes, provavelmente caçando em bandos." },
    { Nome: "Diplodocus longus", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 27.0, Altura: 5.0, Peso: 15.0, Postura: "Quadrúpede", Curiosidade: "O Diplodoco tinha uma cauda extremamente longa, com cerca de 13 metros, que podia ser usada como chicote para se defender." },
    { Nome: "Ankylosaurus magniventris", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 6.0, Altura: 1.7, Peso: 6.0, Postura: "Quadrúpede", Curiosidade: "O Anquilossauro era um tanque vivo, com armadura óssea e uma pesada clava na cauda capaz de quebrar ossos de predadores." },
    { Nome: "Parasaurolophus walkeri", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 9.5, Altura: 3.0, Peso: 2.5, Postura: "Quadrúpede", Curiosidade: "Sua crista tubular oca pode ter funcionado como câmara de ressonância para emitir sons de baixa frequência e comunicação." },
    { Nome: "Pachycephalosaurus wyomingensis", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 4.5, Altura: 1.5, Peso: 0.45, Postura: "Bípede", Curiosidade: "Seu crânio tinha um domo ósseo de até 25 cm de espessura, usado provavelmente para disputas cabeça-contra-cabeça." },
    { Nome: "Carnotaurus sastrei", Periodo: "Cretáceo Superior", Dieta: "Carnívoro", Comprimento: 7.5, Altura: 3.0, Peso: 1.3, Postura: "Bípede", Curiosidade: "O Carnotauro tinha dois chifres sobre os olhos e membros anteriores extremamente reduzidos, ainda mais curtos que os do T. rex." },
    { Nome: "Therizinosaurus cheloniformis", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 10.0, Altura: 4.5, Peso: 5.0, Postura: "Bípede", Curiosidade: "Possuía garras gigantescas de até 1 metro de comprimento, mas provavelmente era um herbívoro pacífico que as usava para alcançar folhas." },
    { Nome: "Deinonychus antirrhopus", Periodo: "Cretáceo Inferior", Dieta: "Carnívoro", Comprimento: 3.4, Altura: 1.0, Peso: 0.08, Postura: "Bípede", Curiosidade: "Parente maior do Velociraptor, o Deinônico inspirou a garra retrátil e a cauda rígida dos raptores retratados em Jurassic Park." },
    { Nome: "Iguanodon bernissartensis", Periodo: "Cretáceo Inferior", Dieta: "Herbívoro", Comprimento: 10.0, Altura: 3.0, Peso: 3.5, Postura: "Bípede/Quadrúpede", Curiosidade: "Foi um dos primeiros dinossauros descobertos. Sua 'polegar' em forma de espinho pode ter sido usado como arma defensiva." },
    { Nome: "Baryonyx walkeri", Periodo: "Cretáceo Inferior", Dieta: "Piscívoro", Comprimento: 9.0, Altura: 2.5, Peso: 2.0, Postura: "Bípede", Curiosidade: "Tinha uma garra enorme no polegar e focinho alongado com dentes cônicos, ideal para pescar, semelhante a um urso-pescador." },
    { Nome: "Microraptor gui", Periodo: "Cretáceo Inferior", Dieta: "Carnívoro", Comprimento: 0.8, Altura: 0.3, Peso: 0.001, Postura: "Bípede", Curiosidade: "Um pequeno dinossauro com penas nas quatro asas, capaz de planar entre as árvores, mostrando um estágio evolutivo do voo." },
    { Nome: "Archaeopteryx lithographica", Periodo: "Jurássico Superior", Dieta: "Carnívoro", Comprimento: 0.5, Altura: 0.2, Peso: 0.0005, Postura: "Bípede", Curiosidade: "Considerado o 'elo perdido' entre dinossauros e aves, combinava penas assimétricas (bom para voo) com dentes e cauda longa." },
    { Nome: "Coelophysis bauri", Periodo: "Triássico Superior", Dieta: "Carnívoro", Comprimento: 3.0, Altura: 1.0, Peso: 0.03, Postura: "Bípede", Curiosidade: "Um dos primeiros dinossauros, de ossos ocos e corpo esguio, viveu em um ambiente árido e provavelmente era canibal em situações extremas." },
    { Nome: "Plateosaurus engelhardti", Periodo: "Triássico Superior", Dieta: "Herbívoro", Comprimento: 8.0, Altura: 2.0, Peso: 0.7, Postura: "Bípede/Quadrúpede", Curiosidade: "Um dos primeiros grandes herbívoros, com pescoço longo e mãos fortes que podiam agarrar galhos ou caminhar sobre as quatro patas." },
    { Nome: "Apatosaurus louisae", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 21.0, Altura: 5.0, Peso: 20.0, Postura: "Quadrúpede", Curiosidade: "Conhecido popularmente como 'Brontossauro', o Apatossauro tinha vértebras ocas e um pescoço poderoso para pastar no alto." },
    { Nome: "Camarasaurus grandis", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 15.0, Altura: 5.0, Peso: 20.0, Postura: "Quadrúpede", Curiosidade: "Tinha dentes em forma de colher e um crânio relativamente curto e robusto, adaptado a uma mastigação mais eficiente." },
    { Nome: "Giganotosaurus carolinii", Periodo: "Cretáceo Superior", Dieta: "Carnívoro", Comprimento: 13.0, Altura: 4.0, Peso: 8.0, Postura: "Bípede", Curiosidade: "Maior que o T. rex em comprimento, o Giganotossauro habitava a América do Sul e provavelmente caçava grandes saurópodes como o Argentinossauro." },
    { Nome: "Carcharodontosaurus saharicus", Periodo: "Cretáceo Superior", Dieta: "Carnívoro", Comprimento: 13.0, Altura: 4.0, Peso: 6.0, Postura: "Bípede", Curiosidade: "Seu nome significa 'lagarto com dentes de tubarão', graças aos dentes serrilhados e achatados, semelhantes aos do grande tubarão branco." },
    { Nome: "Utahraptor ostrommaysorum", Periodo: "Cretáceo Inferior", Dieta: "Carnívoro", Comprimento: 6.0, Altura: 2.0, Peso: 0.5, Postura: "Bípede", Curiosidade: "O maior dos dromaeossauros, com uma garra em foice de 24 cm, era um predador ativo que podia derrubar presas bem maiores." },
    { Nome: "Dilophosaurus wetherilli", Periodo: "Jurássico Inferior", Dieta: "Carnívoro", Comprimento: 6.0, Altura: 2.0, Peso: 0.4, Postura: "Bípede", Curiosidade: "Conhecido pelas duas cristas ósseas na cabeça, o Dilofossauro não cuspia veneno como nos filmes, mas era um caçador ágil." },
    { Nome: "Ceratosaurus nasicornis", Periodo: "Jurássico Superior", Dieta: "Carnívoro", Comprimento: 7.0, Altura: 2.5, Peso: 0.5, Postura: "Bípede", Curiosidade: "Possuía um chifre no nariz e dois chifres sobre os olhos, além de placas ósseas ao longo do dorso." },
    { Nome: "Edmontosaurus annectens", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 13.0, Altura: 3.0, Peso: 4.0, Postura: "Quadrúpede", Curiosidade: "Um dos dinossauros de bico de pato mais comuns, com baterias dentárias para mastigar plantas duras." },
    { Nome: "Lambeosaurus lambei", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 2.5, Peso: 3.0, Postura: "Quadrúpede", Curiosidade: "Sua crista oca em formato de machado era maior nos machos e podia servir para emitir sons e se comunicar." },
    { Nome: "Corythosaurus casuarius", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 2.5, Peso: 2.8, Postura: "Quadrúpede", Curiosidade: "Tinha uma crista arredondada que lembra um capacete coríntio. A função da crista permanece debatida (ressonância ou exibição)." },
    { Nome: "Styracosaurus albertensis", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 5.5, Altura: 2.0, Peso: 2.7, Postura: "Quadrúpede", Curiosidade: "Possuía um longo chifre nasal e espigões em forma de gancho na borda do folho, formando uma impressionante coroa defensiva." },
    { Nome: "Chasmosaurus belli", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 5.0, Altura: 1.8, Peso: 1.5, Postura: "Quadrúpede", Curiosidade: "Seu folho craniano era enorme, com grandes aberturas (fenestras) que o tornavam mais leve e talvez colorido para exibição." },
    { Nome: "Protoceratops andrewsi", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 2.0, Altura: 0.7, Peso: 0.2, Postura: "Quadrúpede", Curiosidade: "Fóssil de Protocerátops foi encontrado abraçado a um Velociraptor, evidenciando uma luta até a morte preservada na areia." },
    { Nome: "Psittacosaurus mongoliensis", Periodo: "Cretáceo Inferior", Dieta: "Herbívoro", Comprimento: 2.0, Altura: 0.7, Peso: 0.02, Postura: "Bípede/Quadrúpede", Curiosidade: "Um dos ceratopsianos mais basais, tinha um bico semelhante ao de um papagaio e cerdas alongadas na cauda, sugerindo penas primitivas." },
    { Nome: "Euoplocephalus tutus", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 6.0, Altura: 1.8, Peso: 2.5, Postura: "Quadrúpede", Curiosidade: "Seu corpo era coberto por placas ósseas e até as pálpebras tinham armadura. Usava uma clava óssea na ponta da cauda." },
    { Nome: "Gallimimus bullatus", Periodo: "Cretáceo Superior", Dieta: "Onívoro", Comprimento: 6.0, Altura: 2.0, Peso: 0.5, Postura: "Bípede", Curiosidade: "O mais famoso dos 'dinossauros-avestruz', rápido e possivelmente onívoro, filtrador ou comedor de pequenas presas." },
    { Nome: "Ornithomimus velox", Periodo: "Cretáceo Superior", Dieta: "Onívoro", Comprimento: 4.0, Altura: 1.5, Peso: 0.1, Postura: "Bípede", Curiosidade: "Semelhante a uma avestruz moderna, corria a cerca de 60 km/h. Evidências mostram que possuía penas no corpo e asas rudimentares." },
    { Nome: "Struthiomimus altus", Periodo: "Cretáceo Superior", Dieta: "Onívoro", Comprimento: 4.3, Altura: 1.5, Peso: 0.15, Postura: "Bípede", Curiosidade: "Seu nome significa 'imitador de avestruz'. Tinha pernas longas e provavelmente usava o bico para bicar plantas e pequenos animais." },
    { Nome: "Oviraptor philoceratops", Periodo: "Cretáceo Superior", Dieta: "Onívoro", Comprimento: 2.0, Altura: 0.6, Peso: 0.04, Postura: "Bípede", Curiosidade: "Originalmente acusado de roubar ovos, hoje sabe-se que chocava seus próprios ovos, preservado em posição de incubação sobre o ninho." },
    { Nome: "Citipati osmolskae", Periodo: "Cretáceo Superior", Dieta: "Onívoro", Comprimento: 3.0, Altura: 1.2, Peso: 0.08, Postura: "Bípede", Curiosidade: "Encontrado em posição de sentar sobre o ninho, com os braços abertos para proteger os ovos, como as aves modernas." },
    { Nome: "Maiasaura peeblesorum", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 9.0, Altura: 2.5, Peso: 3.0, Postura: "Quadrúpede", Curiosidade: "O 'lagarto boa mãe' evidenciava cuidado parental; ninhos com ovos e filhotes foram encontrados em colônias, sugerindo comportamento social." },
    { Nome: "Shantungosaurus giganteus", Periodo: "Cretáceo Superior", Dieta: "Herbívoro", Comprimento: 15.0, Altura: 5.0, Peso: 13.0, Postura: "Quadrúpede", Curiosidade: "Um dos maiores hadrossauros já descobertos, com um crânio de 1,6 metro e dentes perfeitamente adaptados para triturar folhas." },
    { Nome: "Mamenchisaurus hochuanensis", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 22.0, Altura: 6.0, Peso: 15.0, Postura: "Quadrúpede", Curiosidade: "O dinossauro de pescoço mais longo já registrado: seu pescoço atingia 14 metros, mais da metade do comprimento total." },
    { Nome: "Sauroposeidon proteles", Periodo: "Cretáceo Inferior", Dieta: "Herbívoro", Comprimento: 30.0, Altura: 18.0, Peso: 50.0, Postura: "Quadrúpede", Curiosidade: "Possivelmente o dinossauro mais alto que existiu: com o pescoço erguido, alcançava uma altura de 18 metros, como um prédio de 6 andares." },
    { Nome: "Amargasaurus cazaui", Periodo: "Cretáceo Inferior", Dieta: "Herbívoro", Comprimento: 10.0, Altura: 2.0, Peso: 2.6, Postura: "Quadrúpede", Curiosidade: "Possuía duas fileiras de espinhos neurais alongados ao longo do pescoço, formando uma vela dupla ou suporte para espinhos queratinosos." },
    { Nome: "Kentrosaurus aethiopicus", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 5.0, Altura: 1.2, Peso: 0.5, Postura: "Quadrúpede", Curiosidade: "Parente do Stegossauro, tinha espinhos afiados na metade posterior do corpo e placas apenas na parte dianteira, sendo bem espinhoso." },
    { Nome: "Tuojiangosaurus multispinus", Periodo: "Jurássico Superior", Dieta: "Herbívoro", Comprimento: 7.0, Altura: 2.0, Peso: 2.8, Postura: "Quadrúpede", Curiosidade: "Mais um estegossauro chinês, com placas nas costas e dois grandes espinhos nos ombros, além da cauda espinhosa (talo)." },
    { Nome: "Euhelopus zdanskyi", Periodo: "Cretáceo Inferior", Dieta: "Herbívoro", Comprimento: 12.0, Altura: 4.0, Peso: 5.0, Postura: "Quadrúpede", Curiosidade: "Um saurópode de pescoço relativamente curto, encontrado na China, com dentes espatulados que indicam uma dieta de vegetação tenra." },
    { Nome: "Herrerasaurus ischigualastensis", Periodo: "Triássico Superior", Dieta: "Carnívoro", Comprimento: 3.0, Altura: 1.0, Peso: 0.1, Postura: "Bípede", Curiosidade: "Um dos dinossauros mais antigos já descobertos, viveu há 231 milhões de anos na Argentina e já possuía características de terópodes e sauropodomorfos." }
];

// ============================================================
// 3. Coordenadas paleogeográficas (para todos os 50)
// ============================================================
const COORDENADAS_DINOSSAUROS = {
    "Tyrannosaurus rex": [{lat:47.5, lon:-106.0}, {lat:44.0, lon:-103.0}, {lat:46.9, lon:-103.5}],
    "Triceratops horridus": [{lat:47.5, lon:-106.0}, {lat:44.5, lon:-104.0}],
    "Velociraptor mongoliensis": [{lat:44.0, lon:102.0}, {lat:43.5, lon:101.0}],
    "Brachiosaurus altithorax": [{lat:39.0, lon:-108.0}, {lat:38.5, lon:-109.5}],
    "Stegosaurus stenops": [{lat:38.5, lon:-109.0}, {lat:40.0, lon:-106.0}],
    "Spinosaurus aegyptiacus": [{lat:30.0, lon:31.0}, {lat:28.0, lon:33.0}],
    "Patagotitan mayorum": [{lat:-43.3, lon:-68.5}, {lat:-43.0, lon:-69.0}],
    "Allosaurus fragilis": [{lat:39.6, lon:-109.0}, {lat:40.1, lon:-108.5}],
    "Diplodocus longus": [{lat:39.2, lon:-108.5}, {lat:38.0, lon:-110.0}],
    "Ankylosaurus magniventris": [{lat:47.0, lon:-106.5}, {lat:44.0, lon:-103.0}],
    "Parasaurolophus walkeri": [{lat:51.0, lon:-114.0}, {lat:46.0, lon:-107.0}],
    "Pachycephalosaurus wyomingensis": [{lat:44.5, lon:-104.0}, {lat:46.0, lon:-107.0}],
    "Carnotaurus sastrei": [{lat:-43.0, lon:-69.0}, {lat:-42.5, lon:-68.5}],
    "Therizinosaurus cheloniformis": [{lat:44.0, lon:101.0}, {lat:45.0, lon:100.5}],
    "Deinonychus antirrhopus": [{lat:39.0, lon:-108.0}, {lat:38.5, lon:-109.5}],
    "Iguanodon bernissartensis": [{lat:50.5, lon:3.5}, {lat:51.0, lon:4.0}],
    "Baryonyx walkeri": [{lat:51.0, lon:-0.5}, {lat:50.5, lon:0.0}],
    "Microraptor gui": [{lat:41.0, lon:119.5}, {lat:41.5, lon:120.0}],
    "Archaeopteryx lithographica": [{lat:48.5, lon:10.5}, {lat:48.8, lon:11.0}],
    "Coelophysis bauri": [{lat:36.0, lon:-106.0}, {lat:35.5, lon:-105.5}],
    "Plateosaurus engelhardti": [{lat:48.0, lon:9.0}, {lat:47.5, lon:8.5}],
    "Apatosaurus louisae": [{lat:39.2, lon:-109.0}, {lat:38.5, lon:-110.0}],
    "Camarasaurus grandis": [{lat:39.5, lon:-108.5}, {lat:40.0, lon:-108.0}],
    "Giganotosaurus carolinii": [{lat:-43.5, lon:-68.0}, {lat:-43.0, lon:-68.5}],
    "Carcharodontosaurus saharicus": [{lat:30.0, lon:31.0}, {lat:28.0, lon:33.0}],
    "Utahraptor ostrommaysorum": [{lat:39.0, lon:-109.5}, {lat:39.5, lon:-109.0}],
    "Dilophosaurus wetherilli": [{lat:36.5, lon:-110.0}, {lat:35.5, lon:-109.5}],
    "Ceratosaurus nasicornis": [{lat:39.0, lon:-108.5}, {lat:38.5, lon:-109.0}],
    "Edmontosaurus annectens": [{lat:51.0, lon:-114.0}, {lat:47.0, lon:-106.5}],
    "Lambeosaurus lambei": [{lat:51.5, lon:-114.0}, {lat:50.0, lon:-113.0}],
    "Corythosaurus casuarius": [{lat:51.0, lon:-114.0}, {lat:50.5, lon:-113.5}],
    "Styracosaurus albertensis": [{lat:51.5, lon:-114.0}, {lat:51.0, lon:-113.5}],
    "Chasmosaurus belli": [{lat:51.0, lon:-114.0}, {lat:50.5, lon:-113.0}],
    "Protoceratops andrewsi": [{lat:44.0, lon:102.0}, {lat:43.5, lon:101.5}],
    "Psittacosaurus mongoliensis": [{lat:41.0, lon:119.5}, {lat:41.5, lon:120.0}],
    "Euoplocephalus tutus": [{lat:51.0, lon:-114.0}, {lat:47.5, lon:-106.0}],
    "Gallimimus bullatus": [{lat:44.0, lon:101.0}, {lat:44.5, lon:100.5}],
    "Ornithomimus velox": [{lat:51.0, lon:-114.0}, {lat:46.0, lon:-107.0}],
    "Struthiomimus altus": [{lat:51.0, lon:-114.0}, {lat:46.0, lon:-107.0}],
    "Oviraptor philoceratops": [{lat:44.0, lon:102.0}, {lat:43.5, lon:101.5}],
    "Citipati osmolskae": [{lat:44.0, lon:101.0}, {lat:44.5, lon:100.5}],
    "Maiasaura peeblesorum": [{lat:48.0, lon:-112.0}, {lat:48.5, lon:-111.5}],
    "Shantungosaurus giganteus": [{lat:35.0, lon:119.0}, {lat:36.0, lon:120.0}],
    "Mamenchisaurus hochuanensis": [{lat:29.0, lon:106.0}, {lat:30.0, lon:107.0}],
    "Sauroposeidon proteles": [{lat:35.0, lon:-97.0}, {lat:34.5, lon:-96.5}],
    "Amargasaurus cazaui": [{lat:-43.0, lon:-69.0}, {lat:-42.5, lon:-68.5}],
    "Kentrosaurus aethiopicus": [{lat:-7.0, lon:37.0}, {lat:-6.5, lon:36.5}],
    "Tuojiangosaurus multispinus": [{lat:29.0, lon:105.0}, {lat:28.5, lon:104.5}],
    "Euhelopus zdanskyi": [{lat:37.0, lon:118.0}, {lat:38.0, lon:119.0}],
    "Herrerasaurus ischigualastensis": [{lat:-30.0, lon:-68.0}, {lat:-29.5, lon:-68.5}]
};

// ============================================================
// 4. Icnofósseis
// ============================================================
const ICNOFOSSEIS = {
    "Grallator": { dedos: 3, garras: true, tamanho: "pequeno", dieta: "Carnívoro (Terópode pequeno)" },
    "Eubrontes": { dedos: 3, garras: true, tamanho: "grande", dieta: "Carnívoro (Terópode ágil)" },
    "Megalosauripus": { dedos: 3, garras: true, tamanho: "grande", dieta: "Carnívoro (Terópode robusto)" },
    "Wintonopus": { dedos: 3, garras: false, tamanho: "pequeno", dieta: "Herbívoro (Ornitópode pequeno)" },
    "Amblydactylus": { dedos: 3, garras: false, tamanho: "grande", dieta: "Herbívoro (Hadrossaurídeo)" },
    "Anomoepus": { dedos: 4, garras: true, tamanho: "medio", dieta: "Herbívoro (Ornitísquio primitivo)" },
    "Brontopodus": { dedos: 4, garras: false, tamanho: "grande", dieta: "Herbívoro (Saurópode de passada larga)" },
    "Parabrontopodus": { dedos: 4, garras: false, tamanho: "grande", dieta: "Herbívoro (Saurópode de passada estreita)" }
};

// ============================================================
// 5. Quiz – 20 perguntas por nível (Fácil, Médio, Difícil)
// ============================================================
const QUIZ = {
    "Fácil": [
        { pergunta: "Qual dinossauro é conhecido como 'Rei dos Dinossauros'?", opcoes: ["Triceratops", "Velociraptor", "Tyrannosaurus rex", "Braquiossauro"], resposta: 2 },
        { pergunta: "O que significa a palavra 'dinossauro'?", opcoes: ["Lagarto terrível", "Lagarto antigo", "Ave do trovão", "Monstro gigante"], resposta: 0 },
        { pergunta: "Em qual período viveu o Tiranossauro rex?", opcoes: ["Jurássico", "Triássico", "Cretáceo", "Permiano"], resposta: 2 },
        { pergunta: "Quantos chifres o Triceratops tinha no rosto?", opcoes: ["1", "2", "3", "4"], resposta: 2 },
        { pergunta: "Qual desses dinossauros era herbívoro?", opcoes: ["Velociraptor", "Estegossauro", "Espinossauro", "Alossauro"], resposta: 1 },
        { pergunta: "Os dinossauros viveram na Era...", opcoes: ["Cenozoica", "Paleozoica", "Mesozoica", "Proterozoica"], resposta: 2 },
        { pergunta: "Qual das opções é um dinossauro voador?", opcoes: ["Pterodáctilo", "Arqueoptérix", "Microraptor", "Nenhuma das anteriores"], resposta: 1 },
        { pergunta: "Qual dinossauro tinha placas nas costas?", opcoes: ["Tiranossauro", "Velociraptor", "Estegossauro", "Braquiossauro"], resposta: 2 },
        { pergunta: "O que os dinossauros carnívoros comiam?", opcoes: ["Plantas", "Insetos", "Outros animais", "Pedras"], resposta: 2 },
        { pergunta: "Qual era o maior dinossauro carnívoro?", opcoes: ["T-Rex", "Espinossauro", "Giganotossauro", "Carcharodontossauro"], resposta: 1 },
        { pergunta: "Os dinossauros botavam ovos?", opcoes: ["Sim, todos", "Não, alguns nasciam vivos", "Apenas os herbívoros", "Apenas os carnívoros"], resposta: 0 },
        { pergunta: "Qual desses viveu no período Jurássico?", opcoes: ["Triceratops", "Braquiossauro", "Tiranossauro rex", "Velociraptor"], resposta: 1 },
        { pergunta: "O fêmur é um osso da...", opcoes: ["Cabeça", "Perna", "Cauda", "Costas"], resposta: 1 },
        { pergunta: "Qual dinossauro tinha uma 'vela' nas costas?", opcoes: ["Espinossauro", "T-Rex", "Diplodoco", "Paquicefalossauro"], resposta: 0 },
        { pergunta: "Como chamamos os dinossauros com 'pés de lagarto'?", opcoes: ["Ornitísquios", "Saurísquios", "Terópodes", "Saurópodes"], resposta: 1 },
        { pergunta: "Qual dinossauro usava uma clava (bola) na ponta da cauda?", opcoes: ["Anquilossauro", "Estegossauro", "Triceratops", "Parassaurolofo"], resposta: 0 },
        { pergunta: "Os dinossauros e os seres humanos viveram na mesma época?", opcoes: ["Sim", "Não, os dinossauros sumiram antes", "Sim, na Era do Gelo", "Apenas na África"], resposta: 1 },
        { pergunta: "Qual dinossauro tinha garras gigantes, mas era herbívoro?", opcoes: ["Therizinosaurus", "Deinonychus", "Velociraptor", "Utahraptor"], resposta: 0 },
        { pergunta: "Em que continente foi encontrado o primeiro fóssil de T-Rex?", opcoes: ["África", "América do Norte", "Ásia", "Europa"], resposta: 1 },
        { pergunta: "Qual desses é um dinossauro bico de pato?", opcoes: ["Estegossauro", "Edmontossauro", "Paquicefalossauro", "Protocerátops"], resposta: 1 }
    ],
    "Médio": [
        { pergunta: "Qual dinossauro possuía uma vela neural nas costas?", opcoes: ["Espinossauro", "Estegossauro", "Triceratops", "Velociraptor"], resposta: 0 },
        { pergunta: "A circunferência do fêmur é usada para estimar:", opcoes: ["Velocidade", "Massa corporal", "Idade", "Dieta"], resposta: 1 },
        { pergunta: "Qual icnogênero tem 3 dedos, garras e tamanho pequeno (<25cm)?", opcoes: ["Eubrontes", "Grallator", "Megalosauripus", "Amblydactylus"], resposta: 1 },
        { pergunta: "No modelo da Extinção K-Pg, o que representa a letra 'P'?", opcoes: ["Predadores", "Plantas", "Presas", "População total"], resposta: 1 },
        { pergunta: "Qual período geológico é conhecido como 'Era dos Dinossauros'?", opcoes: ["Permiano", "Triássico", "Jurássico", "Cretáceo"], resposta: 2 },
        { pergunta: "O Estegossauro viveu em qual período?", opcoes: ["Triássico", "Jurássico", "Cretáceo", "Permiano"], resposta: 1 },
        { pergunta: "Qual dinossauro tinha um 'capacete' ósseo na cabeça?", opcoes: ["Paquicefalossauro", "Carnotauro", "Ceratossauro", "Protocerátops"], resposta: 0 },
        { pergunta: "O que são icnofósseis?", opcoes: ["Fósseis de ossos", "Fósseis de ovos", "Vestígios de atividade", "Fósseis de plantas"], resposta: 2 },
        { pergunta: "Qual dinossauro é famoso por ter três chifres e um grande folho?", opcoes: ["Triceratops", "Estiracossauro", "Casmossauro", "Protocerátops"], resposta: 0 },
        { pergunta: "O Velociraptor pertencia à família:", opcoes: ["Tiranossaurídeos", "Dromaeossaurídeos", "Ceratopsídeos", "Hadrossaurídeos"], resposta: 1 },
        { pergunta: "A Teoria do Impacto de Alvarez explica:", opcoes: ["A deriva continental", "A extinção K-Pg", "O surgimento das aves", "A formação dos fósseis"], resposta: 1 },
        { pergunta: "Qual desses dinossauros viveu no Triássico?", opcoes: ["Alossauro", "Coelophysis", "T-Rex", "Braquiossauro"], resposta: 1 },
        { pergunta: "A silhueta placeholder é gerada quando:", opcoes: ["A imagem é muito grande", "Falta a imagem real", "O dinossauro é desconhecido", "Há erro no código"], resposta: 1 },
        { pergunta: "No modelo Lotka-Volterra, quem são os predadores de topo?", opcoes: ["Plantas", "Herbívoros", "Carnívoros", "Onívoros"], resposta: 2 },
        { pergunta: "Qual continente já foi parte de Gondwana?", opcoes: ["América do Norte", "África", "Europa", "Ásia"], resposta: 1 },
        { pergunta: "Qual a dieta do Espinossauro?", opcoes: ["Carnívoro", "Herbívoro", "Piscívoro", "Onívoro"], resposta: 2 },
        { pergunta: "O que significa 'pneumatização' em dinossauros?", opcoes: ["Ossos ocos", "Pulmões grandes", "Sangue quente", "Voo"], resposta: 0 },
        { pergunta: "Qual dinossauro tinha uma crista tubular oca?", opcoes: ["Parassaurolofo", "Lambeossauro", "Corythosaurus", "Maiassaura"], resposta: 0 },
        { pergunta: "Em que era os dinossauros surgiram?", opcoes: ["Mesozoica", "Paleozoica", "Cenozoica", "Proterozoica"], resposta: 0 },
        { pergunta: "Qual o nome do supercontinente que existia no Triássico?", opcoes: ["Laurásia", "Gondwana", "Pangeia", "Rodínia"], resposta: 2 }
    ],
    "Difícil": [
        { pergunta: "No modelo K-Pg, o parâmetro 'r' é afetado por:", opcoes: ["Chuva ácida", "Bloqueio solar", "Predação", "Mortalidade"], resposta: 1 },
        { pergunta: "Qual icnogênero tem 3 dedos, sem garras e tamanho grande (>25cm)?", opcoes: ["Grallator", "Eubrontes", "Amblydactylus", "Wintonopus"], resposta: 2 },
        { pergunta: "Os dinossauros Saurísquios se dividem em:", opcoes: ["Terópodes e Saurópodes", "Ornitópodes e Ceratopsídeos", "Estegossauros e Anquilossauros", "Hadrossauros e Paquicefalossauros"], resposta: 0 },
        { pergunta: "Qual dinossauro tinha uma garra retrátil em forma de foice?", opcoes: ["T-Rex", "Deinonychus", "Espinossauro", "Carnotauro"], resposta: 1 },
        { pergunta: "Segundo Campione & Evans, a massa é proporcional a qual potência da circunferência femoral?", opcoes: ["1.5", "2.0", "2.73", "3.14"], resposta: 2 },
        { pergunta: "Qual é o significado de 'K-Pg' na extinção?", opcoes: ["Cretáceo-Paleógeno", "K-Permiano", "Jurássico-Cretáceo", "Carbonífero-Permiano"], resposta: 0 },
        { pergunta: "No jogo Paleo-Detetive, qual característica distingue Brontopodus de Parabrontopodus?", opcoes: ["Número de dedos", "Presença de garras", "Largura da pegada", "Tamanho"], resposta: 2 },
        { pergunta: "Qual dinossauro possuía ossos pneumáticos para reduzir peso?", opcoes: ["T-Rex", "Braquiossauro", "Triceratops", "Estegossauro"], resposta: 1 },
        { pergunta: "O glóbulo interativo do Ancient Earth usa qual modelo?", opcoes: ["GPlates", "Paleomap", "EarthByte", "Paleobiology Database"], resposta: 2 },
        { pergunta: "O que o parâmetro 'e' representa no modelo Lotka-Volterra?", opcoes: ["Taxa de crescimento", "Taxa de consumo", "Taxa de predação", "Mortalidade"], resposta: 2 },
        { pergunta: "Qual o menor dinossauro mesozoico conhecido?", opcoes: ["Microraptor", "Compsognathus", "Oculudentavis", "Anchiornis"], resposta: 2 },
        { pergunta: "A equação Massa = a × (Circunferência_mm)^b é baseada em:", opcoes: ["Estudo de dinossauros bípedes", "Escala universal", "Apenas quadrúpedes", "Fósseis marinhos"], resposta: 1 },
        { pergunta: "Qual a altitude aproximada do sítio de Ischigualasto?", opcoes: ["Nível do mar", "~700 m", "~2000 m", "~4000 m"], resposta: 1 },
        { pergunta: "O que significa 'mesotermia'?", opcoes: ["Sangue frio", "Sangue quente", "Temperatura intermediária", "Fotossíntese"], resposta: 2 },
        { pergunta: "Quantos milhões de anos atrás ocorreu a extinção K-Pg?", opcoes: ["65", "66", "100", "150"], resposta: 1 },
        { pergunta: "Qual dinossauro foi encontrado abraçado a um Velociraptor?", opcoes: ["Protocerátops", "Psitacossauro", "Triceratops", "Estegossauro"], resposta: 0 },
        { pergunta: "No método RK4 aplicado na extinção, qual é o passo de tempo (dt) usado?", opcoes: ["0.1 anos", "0.5 anos", "1 ano", "2 anos"], resposta: 1 },
        { pergunta: "Qual a principal evidência de cuidado parental em Maiassaura?", opcoes: ["Ovos isolados", "Ninhos coloniais", "Cráneos pequenos", "Penas"], resposta: 1 },
        { pergunta: "A fórmula para massa de quadrúpedes usa valores de a e b:", opcoes: ["a=0.00016, b=2.73", "a=0.00049, b=2.75", "a=0.001, b=2.5", "a=0.0001, b=3.0"], resposta: 1 },
        { pergunta: "Qual dinossauro possuía espinhos neurais alongados no pescoço formando uma vela dupla?", opcoes: ["Amargassauro", "Espinossauro", "Ouranossauro", "Concavenator"], resposta: 0 }
    ]
};

// ============================================================
// 6. Períodos geológicos
// ============================================================
const PERIODOS = [
    { nome: "Triássico", inicio: 252, fim: 201, cor: "#F44336", eventos: ["Surgimento dos dinossauros", "Primeiros mamíferos", "Início do Mesozóico"] },
    { nome: "Jurássico", inicio: 201, fim: 145, cor: "#E91E63", eventos: ["Dinossauros dominam a Terra", "Surgimento das aves (Archaeopteryx)", "Primeiros pterossauros gigantes"] },
    { nome: "Cretáceo", inicio: 145, fim: 66, cor: "#9C27B0", eventos: ["Primeiras plantas com flores", "Extinção K-Pg (dinossauros não-avianos)", "Auge dos répteis marinhos"] }
];

// ============================================================
// 7. Dados climáticos
// ============================================================
const DADOS_CLIMA = {
    "Triássico (252-201 Ma)": {
        temperatura: 20,
        co2: 2000,
        vegetacao: "Gimnospermas (coníferas, cicadáceas), primeiras plantas com flores no final",
        nivelMar: "Baixo (Pangeia unificada)",
        descricao: "Clima quente e seco, com desertos extensos. Concentração de CO₂ muito alta."
    },
    "Jurássico (201-145 Ma)": {
        temperatura: 22,
        co2: 1500,
        vegetacao: "Florestas de coníferas, cicadáceas, ginkgos. Primeiras angiospermas no final.",
        nivelMar: "Moderado, com início da abertura do Atlântico",
        descricao: "Clima quente e úmido, com estações definidas e aumento das florestas."
    },
    "Cretáceo (145-66 Ma)": {
        temperatura: 26,
        co2: 1000,
        vegetacao: "Angiospermas (plantas com flores) tornam-se dominantes",
        nivelMar: "Alto (mar epicontinental inundando continentes)",
        descricao: "Clima quente e úmido, sem calotas polares. Grande diversificação de plantas e dinossauros."
    }
};

// ============================================================
// 8. Arestas para a árvore evolutiva (cladograma)
// ============================================================
const ARVORE_ARESTAS = [
    ["Reptilia", "Archosauria"],
    ["Archosauria", "Dinosauria"],
    ["Archosauria", "Pterosauria"],
    ["Dinosauria", "Saurischia"],
    ["Dinosauria", "Ornithischia"],
    ["Saurischia", "Theropoda"],
    ["Saurischia", "Sauropodomorpha"],
    ["Theropoda", "Tyrannosauridae"],
    ["Theropoda", "Dromaeosauridae"],
    ["Theropoda", "Spinosauridae"],
    ["Sauropodomorpha", "Brachiosauridae"],
    ["Sauropodomorpha", "Diplodocidae"],
    ["Ornithischia", "Ceratopsia"],
    ["Ornithischia", "Ornithopoda"],
    ["Ornithischia", "Stegosauria"],
    ["Ornithischia", "Ankylosauria"],
    ["Reptilia", "Sauropterygia"],
    ["Sauropterygia", "Plesiosauria"],
    ["Reptilia", "Ichthyosauria"]
];