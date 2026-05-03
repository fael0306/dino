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
            "tamanho": "Pequeno (10-20cm)",
            "dieta": "Carnívoro (Terópode)",
            "arquivo": "grallator.png"
        },
        "Eubrontes": {
            "dedos": 3,
            "garras": True,
            "tamanho": "Grande (30-50cm)",
            "dieta": "Carnívoro (Dilofossauro?)",
            "arquivo": "eubrontes.png"
        },
        "Brontopodus": {
            "dedos": 4,
            "garras": False,
            "tamanho": "Enorme (>1m)",
            "dieta": "Herbívoro (Saurópode)",
            "arquivo": "brontopodus.png"
        },
        "Anomoepus": {
            "dedos": 4,
            "garras": True,
            "tamanho": "Médio",
            "dieta": "Herbívoro (Ornitísquio)",
            "arquivo": "anomoepus.png"
        }
    }
