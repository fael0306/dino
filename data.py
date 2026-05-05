# data.py
import pandas as pd

def carregar_dados_dinossauros():
    """Retorna o DataFrame com os dados dos dinossauros."""
    dados = [
        ["Tyrannosaurus rex", "Cretáceo", "Carnívoro", 12.3, 4.0, 8.4, "Bípede"],
        ["Triceratops", "Cretáceo", "Herbívoro", 9.0, 3.0, 6.0, "Quadrúpede"],
        ["Velociraptor", "Cretáceo", "Carnívoro", 2.0, 0.5, 0.015, "Bípede"],
        ["Brachiosaurus", "Jurássico", "Herbívoro", 25.0, 12.0, 50.0, "Quadrúpede"],
        ["Stegosaurus", "Jurássico", "Herbívoro", 9.0, 4.0, 7.0, "Quadrúpede"],
        ["Spinosaurus", "Cretáceo", "Piscívoro", 15.0, 5.0, 7.5, "Bípede"],
        ["Patagotitan", "Cretáceo", "Herbívoro", 37.0, 8.0, 70.0, "Quadrúpede"],
    ]
    return pd.DataFrame(dados, columns=["Nome", "Período", "Dieta", "Comprimento (m)", "Altura (m)", "Peso (ton)", "Postura"])

def obter_info_pegadas():
    """Retorna o dicionário com informações das pegadas (icnofósseis)."""
    return {
        "Grallator": {
            "dedos": 3,
            "garras": True,
            "tamanho": "Pequeno (10-20 cm)",
            "dieta": "Carnívoro (Terópode pequeno)",
            "arquivo": "grallator.png"
        },
        "Eubrontes": {
            "dedos": 3,
            "garras": True,
            "tamanho": "Grande (30-50 cm)",
            "dieta": "Carnívoro (Terópode ágil)",
            "arquivo": "eubrontes.png"
        },
        "Megalosauripus": {
            "dedos": 3,
            "garras": True,
            "tamanho": "Grande (40-60 cm)",
            "dieta": "Carnívoro (Terópode robusto)",
            "arquivo": "megalosauripus.png"
        },
        "Wintonopus": {
            "dedos": 3,
            "garras": False,
            "tamanho": "Pequeno (10-15 cm)",
            "dieta": "Herbívoro (Ornitópode pequeno)",
            "arquivo": "wintonopus.png"
        },
        "Amblydactylus": {
            "dedos": 3,
            "garras": False,
            "tamanho": "Grande (50-80 cm)",
            "dieta": "Herbívoro (Hadrossaurídeo)",
            "arquivo": "amblydactylus.png"
        },
        "Anomoepus": {
            "dedos": 4,
            "garras": True,
            "tamanho": "Médio (15-25 cm)",
            "dieta": "Herbívoro (Ornitísquio primitivo)",
            "arquivo": "anomoepus.png"
        },
        "Brontopodus": {
            "dedos": 4,
            "garras": False,
            "tamanho": "Enorme (>1 m, largo)",
            "dieta": "Herbívoro (Saurópode de passada larga)",
            "arquivo": "brontopodus.png"
        },
        "Parabrontopodus": {
            "dedos": 4,
            "garras": False,
            "tamanho": "Grande (>80 cm, alongado)",
            "dieta": "Herbívoro (Saurópode de passada estreita)",
            "arquivo": "parabrontopodus.png"
        }
    }

# data.py (trecho final, apenas a função alterada)
def obter_banco_dinossauros_reais():
    """Retorna uma lista com 50 dinossauros reais e suas curiosidades."""
    return [
        {
            "Nome": "Tyrannosaurus rex",
            "Período": "Cretáceo Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 12.3,
            "Altura": 4.0,
            "Peso": 8.4,
            "Postura": "Bípede",
            "Curiosidade": "O T. rex possuía a mordida mais forte de qualquer animal terrestre, capaz de esmagar ossos com uma força equivalente a 6 toneladas.",
            "Arquivo": "real_tyrannosaurus_rex.png"
        },
        {
            "Nome": "Triceratops horridus",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 9.0,
            "Altura": 3.0,
            "Peso": 6.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Seu nome significa 'cabeça com três chifres'. Provavelmente usava os chifres e o grande folho ósseo em disputas territoriais e defesa.",
            "Arquivo": "real_triceratops_horridus.png"
        },
        {
            "Nome": "Velociraptor mongoliensis",
            "Período": "Cretáceo Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 2.0,
            "Altura": 0.5,
            "Peso": 0.015,
            "Postura": "Bípede",
            "Curiosidade": "Menor do que o retratado em filmes, o Velociraptor tinha penas e uma garra retrátil no pé, usada para caçar pequenas presas.",
            "Arquivo": "real_velociraptor_mongoliensis.png"
        },
        {
            "Nome": "Brachiosaurus altithorax",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 25.0,
            "Altura": 12.0,
            "Peso": 50.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Um dos maiores dinossauros, o Braquiossauro tinha as narinas no topo da cabeça, o que levou cientistas a pensarem que ele passava muito tempo submerso.",
            "Arquivo": "real_brachiosaurus_altithorax.png"
        },
        {
            "Nome": "Stegosaurus stenops",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 9.0,
            "Altura": 4.0,
            "Peso": 7.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "As placas ósseas do Stegossauro podem ter servido para termorregulação, além de exibição. O 'talo' na cauda era uma arma perigosa.",
            "Arquivo": "real_stegosaurus_stenops.png"
        },
        {
            "Nome": "Spinosaurus aegyptiacus",
            "Período": "Cretáceo Superior",
            "Dieta": "Piscívoro",
            "Comprimento": 15.0,
            "Altura": 5.0,
            "Peso": 7.5,
            "Postura": "Bípede",
            "Curiosidade": "O Espinossauro possuía uma vela neural de até 1,8 m e adaptações para a vida semiaquática, sendo um dos maiores dinossauros carnívoros.",
            "Arquivo": "real_spinosaurus_aegyptiacus.png"
        },
        {
            "Nome": "Patagotitan mayorum",
            "Período": "Cretáceo Inferior",
            "Dieta": "Herbívoro",
            "Comprimento": 37.0,
            "Altura": 8.0,
            "Peso": 70.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "O Patagotitan é um dos maiores animais que já andaram na Terra, pesando cerca de 70 toneladas – o equivalente a 10 elefantes africanos.",
            "Arquivo": "real_patagotitan_mayorum.png"
        },
        {
            "Nome": "Allosaurus fragilis",
            "Período": "Jurássico Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 8.5,
            "Altura": 3.0,
            "Peso": 2.3,
            "Postura": "Bípede",
            "Curiosidade": "O Alossauro era o principal predador do Jurássico, com dentes serrilhados e garras fortes, provavelmente caçando em bandos.",
            "Arquivo": "real_allosaurus_fragilis.png"
        },
        {
            "Nome": "Diplodocus longus",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 27.0,
            "Altura": 5.0,
            "Peso": 15.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "O Diplodoco tinha uma cauda extremamente longa, com cerca de 13 metros, que podia ser usada como chicote para se defender.",
            "Arquivo": "real_diplodocus_longus.png"
        },
        {
            "Nome": "Ankylosaurus magniventris",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 6.0,
            "Altura": 1.7,
            "Peso": 6.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "O Anquilossauro era um tanque vivo, com armadura óssea e uma pesada clava na cauda capaz de quebrar ossos de predadores.",
            "Arquivo": "real_ankylosaurus_magniventris.png"
        },
        {
            "Nome": "Parasaurolophus walkeri",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 9.5,
            "Altura": 3.0,
            "Peso": 2.5,
            "Postura": "Quadrúpede",
            "Curiosidade": "Sua crista tubular oca pode ter funcionado como câmara de ressonância para emitir sons de baixa frequência e comunicação.",
            "Arquivo": "real_parasaurolophus_walkeri.png"
        },
        {
            "Nome": "Pachycephalosaurus wyomingensis",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 4.5,
            "Altura": 1.5,
            "Peso": 0.45,
            "Postura": "Bípede",
            "Curiosidade": "Seu crânio tinha um domo ósseo de até 25 cm de espessura, usado provavelmente para disputas cabeça-contra-cabeça.",
            "Arquivo": "real_pachycephalosaurus_wyomingensis.png"
        },
        {
            "Nome": "Carnotaurus sastrei",
            "Período": "Cretáceo Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 7.5,
            "Altura": 3.0,
            "Peso": 1.3,
            "Postura": "Bípede",
            "Curiosidade": "O Carnotauro tinha dois chifres sobre os olhos e membros anteriores extremamente reduzidos, ainda mais curtos que os do T. rex.",
            "Arquivo": "real_carnotaurus_sastrei.png"
        },
        {
            "Nome": "Therizinosaurus cheloniformis",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 10.0,
            "Altura": 4.5,
            "Peso": 5.0,
            "Postura": "Bípede",
            "Curiosidade": "Possuía garras gigantescas de até 1 metro de comprimento, mas provavelmente era um herbívoro pacífico que as usava para alcançar folhas.",
            "Arquivo": "real_therizinosaurus_cheloniformis.png"
        },
        {
            "Nome": "Deinonychus antirrhopus",
            "Período": "Cretáceo Inferior",
            "Dieta": "Carnívoro",
            "Comprimento": 3.4,
            "Altura": 1.0,
            "Peso": 0.08,
            "Postura": "Bípede",
            "Curiosidade": "Parente maior do Velociraptor, o Deinônico inspirou a garra retrátil e a cauda rígida dos raptores retratados em Jurassic Park.",
            "Arquivo": "real_deinonychus_antirrhopus.png"
        },
        {
            "Nome": "Iguanodon bernissartensis",
            "Período": "Cretáceo Inferior",
            "Dieta": "Herbívoro",
            "Comprimento": 10.0,
            "Altura": 3.0,
            "Peso": 3.5,
            "Postura": "Bípede/Quadrúpede",
            "Curiosidade": "Foi um dos primeiros dinossauros descobertos. Sua 'polegar' em forma de espinho pode ter sido usado como arma defensiva.",
            "Arquivo": "real_iguanodon_bernissartensis.png"
        },
        {
            "Nome": "Baryonyx walkeri",
            "Período": "Cretáceo Inferior",
            "Dieta": "Piscívoro",
            "Comprimento": 9.0,
            "Altura": 2.5,
            "Peso": 2.0,
            "Postura": "Bípede",
            "Curiosidade": "Tinha uma garra enorme no polegar e focinho alongado com dentes cônicos, ideal para pescar, semelhante a um urso-pescador.",
            "Arquivo": "real_baryonyx_walkeri.png"
        },
        {
            "Nome": "Microraptor gui",
            "Período": "Cretáceo Inferior",
            "Dieta": "Carnívoro",
            "Comprimento": 0.8,
            "Altura": 0.3,
            "Peso": 0.001,
            "Postura": "Bípede",
            "Curiosidade": "Um pequeno dinossauro com penas nas quatro asas, capaz de planar entre as árvores, mostrando um estágio evolutivo do voo.",
            "Arquivo": "real_microraptor_gui.png"
        },
        {
            "Nome": "Archaeopteryx lithographica",
            "Período": "Jurássico Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 0.5,
            "Altura": 0.2,
            "Peso": 0.0005,
            "Postura": "Bípede",
            "Curiosidade": "Considerado o 'elo perdido' entre dinossauros e aves, combinava penas assimétricas (bom para voo) com dentes e cauda longa.",
            "Arquivo": "real_archaeopteryx_lithographica.png"
        },
        {
            "Nome": "Coelophysis bauri",
            "Período": "Triássico Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 3.0,
            "Altura": 1.0,
            "Peso": 0.03,
            "Postura": "Bípede",
            "Curiosidade": "Um dos primeiros dinossauros, de ossos ocos e corpo esguio, viveu em um ambiente árido e provavelmente era canibal em situações extremas.",
            "Arquivo": "real_coelophysis_bauri.png"
        },
        {
            "Nome": "Plateosaurus engelhardti",
            "Período": "Triássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 8.0,
            "Altura": 2.0,
            "Peso": 0.7,
            "Postura": "Bípede/Quadrúpede",
            "Curiosidade": "Um dos primeiros grandes herbívoros, com pescoço longo e mãos fortes que podiam agarrar galhos ou caminhar sobre as quatro patas.",
            "Arquivo": "real_plateosaurus_engelhardti.png"
        },
        {
            "Nome": "Apatosaurus louisae",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 21.0,
            "Altura": 5.0,
            "Peso": 20.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Conhecido popularmente como 'Brontossauro', o Apatossauro tinha vértebras ocas e um pescoço poderoso para pastar no alto.",
            "Arquivo": "real_apatosaurus_louisae.png"
        },
        {
            "Nome": "Camarasaurus grandis",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 15.0,
            "Altura": 5.0,
            "Peso": 20.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Tinha dentes em forma de colher e um crânio relativamente curto e robusto, adaptado a uma mastigação mais eficiente.",
            "Arquivo": "real_camarasaurus_grandis.png"
        },
        {
            "Nome": "Giganotosaurus carolinii",
            "Período": "Cretáceo Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 13.0,
            "Altura": 4.0,
            "Peso": 8.0,
            "Postura": "Bípede",
            "Curiosidade": "Maior que o T. rex em comprimento, o Giganotossauro habitava a América do Sul e provavelmente caçava grandes saurópodes como o Argentinossauro.",
            "Arquivo": "real_giganotosaurus_carolinii.png"
        },
        {
            "Nome": "Carcharodontosaurus saharicus",
            "Período": "Cretáceo Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 13.0,
            "Altura": 4.0,
            "Peso": 6.0,
            "Postura": "Bípede",
            "Curiosidade": "Seu nome significa 'lagarto com dentes de tubarão', graças aos dentes serrilhados e achatados, semelhantes aos do grande tubarão branco.",
            "Arquivo": "real_carcharodontosaurus_saharicus.png"
        },
        {
            "Nome": "Utahraptor ostrommaysorum",
            "Período": "Cretáceo Inferior",
            "Dieta": "Carnívoro",
            "Comprimento": 6.0,
            "Altura": 2.0,
            "Peso": 0.5,
            "Postura": "Bípede",
            "Curiosidade": "O maior dos dromaeossauros, com uma garra em foice de 24 cm, era um predador ativo que podia derrubar presas bem maiores.",
            "Arquivo": "real_utahraptor_ostrommaysorum.png"
        },
        {
            "Nome": "Dilophosaurus wetherilli",
            "Período": "Jurássico Inferior",
            "Dieta": "Carnívoro",
            "Comprimento": 6.0,
            "Altura": 2.0,
            "Peso": 0.4,
            "Postura": "Bípede",
            "Curiosidade": "Conhecido pelas duas cristas ósseas na cabeça, o Dilofossauro não cuspia veneno como nos filmes, mas era um caçador ágil.",
            "Arquivo": "real_dilophosaurus_wetherilli.png"
        },
        {
            "Nome": "Ceratosaurus nasicornis",
            "Período": "Jurássico Superior",
            "Dieta": "Carnívoro",
            "Comprimento": 7.0,
            "Altura": 2.5,
            "Peso": 0.5,
            "Postura": "Bípede",
            "Curiosidade": "Possuía um chifre no nariz e dois chifres sobre os olhos, além de placas ósseas ao longo do dorso.",
            "Arquivo": "real_ceratosaurus_nasicornis.png"
        },
        {
            "Nome": "Edmontosaurus annectens",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 13.0,
            "Altura": 3.0,
            "Peso": 4.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Um dos dinossauros de bico de pato mais comuns, com baterias dentárias para mastigar plantas duras.",
            "Arquivo": "real_edmontosaurus_annectens.png"
        },
        {
            "Nome": "Lambeosaurus lambei",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 9.0,
            "Altura": 2.5,
            "Peso": 3.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Sua crista oca em formato de machado era maior nos machos e podia servir para emitir sons e se comunicar.",
            "Arquivo": "real_lambeosaurus_lambei.png"
        },
        {
            "Nome": "Corythosaurus casuarius",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 9.0,
            "Altura": 2.5,
            "Peso": 2.8,
            "Postura": "Quadrúpede",
            "Curiosidade": "Tinha uma crista arredondada que lembra um capacete coríntio. A função da crista permanece debatida (ressonância ou exibição).",
            "Arquivo": "real_corythosaurus_casuarius.png"
        },
        {
            "Nome": "Styracosaurus albertensis",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 5.5,
            "Altura": 2.0,
            "Peso": 2.7,
            "Postura": "Quadrúpede",
            "Curiosidade": "Possuía um longo chifre nasal e espigões em forma de gancho na borda do folho, formando uma impressionante coroa defensiva.",
            "Arquivo": "real_styracosaurus_albertensis.png"
        },
        {
            "Nome": "Chasmosaurus belli",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 5.0,
            "Altura": 1.8,
            "Peso": 1.5,
            "Postura": "Quadrúpede",
            "Curiosidade": "Seu folho craniano era enorme, com grandes aberturas (fenestras) que o tornavam mais leve e talvez colorido para exibição.",
            "Arquivo": "real_chasmosaurus_belli.png"
        },
        {
            "Nome": "Protoceratops andrewsi",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 2.0,
            "Altura": 0.7,
            "Peso": 0.2,
            "Postura": "Quadrúpede",
            "Curiosidade": "Fóssil de Protocerátops foi encontrado abraçado a um Velociraptor, evidenciando uma luta até a morte preservada na areia.",
            "Arquivo": "real_protoceratops_andrewsi.png"
        },
        {
            "Nome": "Psittacosaurus mongoliensis",
            "Período": "Cretáceo Inferior",
            "Dieta": "Herbívoro",
            "Comprimento": 2.0,
            "Altura": 0.7,
            "Peso": 0.02,
            "Postura": "Bípede/Quadrúpede",
            "Curiosidade": "Um dos ceratopsianos mais basais, tinha um bico semelhante ao de um papagaio e cerdas alongadas na cauda, sugerindo penas primitivas.",
            "Arquivo": "real_psittacosaurus_mongoliensis.png"
        },
        {
            "Nome": "Euoplocephalus tutus",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 6.0,
            "Altura": 1.8,
            "Peso": 2.5,
            "Postura": "Quadrúpede",
            "Curiosidade": "Seu corpo era coberto por placas ósseas e até as pálpebras tinham armadura. Usava uma clava óssea na ponta da cauda.",
            "Arquivo": "real_euoplocephalus_tutus.png"
        },
        {
            "Nome": "Gallimimus bullatus",
            "Período": "Cretáceo Superior",
            "Dieta": "Onívoro",
            "Comprimento": 6.0,
            "Altura": 2.0,
            "Peso": 0.5,
            "Postura": "Bípede",
            "Curiosidade": "O mais famoso dos 'dinossauros-avestruz', rápido e possivelmente onívoro, filtrador ou comedor de pequenas presas.",
            "Arquivo": "real_gallimimus_bullatus.png"
        },
        {
            "Nome": "Ornithomimus velox",
            "Período": "Cretáceo Superior",
            "Dieta": "Onívoro",
            "Comprimento": 4.0,
            "Altura": 1.5,
            "Peso": 0.1,
            "Postura": "Bípede",
            "Curiosidade": "Semelhante a uma avestruz moderna, corria a cerca de 60 km/h. Evidências mostram que possuía penas no corpo e asas rudimentares.",
            "Arquivo": "real_ornithomimus_velox.png"
        },
        {
            "Nome": "Struthiomimus altus",
            "Período": "Cretáceo Superior",
            "Dieta": "Onívoro",
            "Comprimento": 4.3,
            "Altura": 1.5,
            "Peso": 0.15,
            "Postura": "Bípede",
            "Curiosidade": "Seu nome significa 'imitador de avestruz'. Tinha pernas longas e provavelmente usava o bico para bicar plantas e pequenos animais.",
            "Arquivo": "real_struthiomimus_altus.png"
        },
        {
            "Nome": "Oviraptor philoceratops",
            "Período": "Cretáceo Superior",
            "Dieta": "Onívoro",
            "Comprimento": 2.0,
            "Altura": 0.6,
            "Peso": 0.04,
            "Postura": "Bípede",
            "Curiosidade": "Originalmente acusado de roubar ovos, hoje sabe-se que chocava seus próprios ovos, preservado em posição de incubação sobre o ninho.",
            "Arquivo": "real_oviraptor_philoceratops.png"
        },
        {
            "Nome": "Citipati osmolskae",
            "Período": "Cretáceo Superior",
            "Dieta": "Onívoro",
            "Comprimento": 3.0,
            "Altura": 1.2,
            "Peso": 0.08,
            "Postura": "Bípede",
            "Curiosidade": "Encontrado em posição de sentar sobre o ninho, com os braços abertos para proteger os ovos, como as aves modernas.",
            "Arquivo": "real_citipati_osmolskae.png"
        },
        {
            "Nome": "Maiasaura peeblesorum",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 9.0,
            "Altura": 2.5,
            "Peso": 3.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "O 'lagarto boa mãe' evidenciava cuidado parental; ninhos com ovos e filhotes foram encontrados em colônias, sugerindo comportamento social.",
            "Arquivo": "real_maiasaura_peeblesorum.png"
        },
        {
            "Nome": "Shantungosaurus giganteus",
            "Período": "Cretáceo Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 15.0,
            "Altura": 5.0,
            "Peso": 13.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Um dos maiores hadrossauros já descobertos, com um crânio de 1,6 metro e dentes perfeitamente adaptados para triturar folhas.",
            "Arquivo": "real_shantungosaurus_giganteus.png"
        },
        {
            "Nome": "Mamenchisaurus hochuanensis",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 22.0,
            "Altura": 6.0,
            "Peso": 15.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "O dinossauro de pescoço mais longo já registrado: seu pescoço atingia 14 metros, mais da metade do comprimento total.",
            "Arquivo": "real_mamenchisaurus_hochuanensis.png"
        },
        {
            "Nome": "Sauroposeidon proteles",
            "Período": "Cretáceo Inferior",
            "Dieta": "Herbívoro",
            "Comprimento": 30.0,
            "Altura": 18.0,
            "Peso": 50.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Possivelmente o dinossauro mais alto que existiu: com o pescoço erguido, alcançava uma altura de 18 metros, como um prédio de 6 andares.",
            "Arquivo": "real_sauroposeidon_proteles.png"
        },
        {
            "Nome": "Amargasaurus cazaui",
            "Período": "Cretáceo Inferior",
            "Dieta": "Herbívoro",
            "Comprimento": 10.0,
            "Altura": 2.0,
            "Peso": 2.6,
            "Postura": "Quadrúpede",
            "Curiosidade": "Possuía duas fileiras de espinhos neurais alongados ao longo do pescoço, formando uma vela dupla ou suporte para espinhos queratinosos.",
            "Arquivo": "real_amargasaurus_cazaui.png"
        },
        {
            "Nome": "Kentrosaurus aethiopicus",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 5.0,
            "Altura": 1.2,
            "Peso": 0.5,
            "Postura": "Quadrúpede",
            "Curiosidade": "Parente do Stegossauro, tinha espinhos afiados na metade posterior do corpo e placas apenas na parte dianteira, sendo bem espinhoso.",
            "Arquivo": "real_kentrosaurus_aethiopicus.png"
        },
        {
            "Nome": "Tuojiangosaurus multispinus",
            "Período": "Jurássico Superior",
            "Dieta": "Herbívoro",
            "Comprimento": 7.0,
            "Altura": 2.0,
            "Peso": 2.8,
            "Postura": "Quadrúpede",
            "Curiosidade": "Mais um estegossauro chinês, com placas nas costas e dois grandes espinhos nos ombros, além da cauda espinhosa (talo).",
            "Arquivo": "real_tuojiangosaurus_multispinus.png"
        },
        {
            "Nome": "Euhelopus zdanskyi",
            "Período": "Cretáceo Inferior",
            "Dieta": "Herbívoro",
            "Comprimento": 12.0,
            "Altura": 4.0,
            "Peso": 5.0,
            "Postura": "Quadrúpede",
            "Curiosidade": "Um saurópode de pescoço relativamente curto, encontrado na China, com dentes espatulados que indicam uma dieta de vegetação tenra.",
            "Arquivo": "real_euhelopus_zdanskyi.png"
        },
    ]
