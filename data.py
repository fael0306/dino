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
    """Retorna o dicionário com informações das pegadas (icnofósseis).
    As imagens são carregadas localmente da pasta assets/.
    """
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
