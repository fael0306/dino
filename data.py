import pandas as pd

def load_dino_data():
    """Retorna o DataFrame com os dados dos dinossauros."""
    data = [
        ["Tyrannosaurus rex", "Cretáceo", "Carnívoro", 12.3, 4.0, 8.4, "Bípede"],
        ["Triceratops", "Cretáceo", "Herbívoro", 9.0, 3.0, 6.0, "Quadrúpede"],
        ["Velociraptor", "Cretáceo", "Carnívoro", 2.0, 0.5, 0.015, "Bípede"],
        ["Brachiosaurus", "Jurássico", "Herbívoro", 25.0, 12.0, 50.0, "Quadrúpede"],
        ["Stegosaurus", "Jurássico", "Herbívoro", 9.0, 4.0, 7.0, "Quadrúpede"],
        ["Spinosaurus", "Cretáceo", "Piscívoro", 15.0, 5.0, 7.5, "Bípede"],
        ["Patagotitan", "Cretáceo", "Herbívoro", 37.0, 8.0, 70.0, "Quadrúpede"],
    ]
    return pd.DataFrame(data, columns=["Nome", "Período", "Dieta", "Comprimento (m)", "Altura (m)", "Peso (ton)", "Postura"])


def get_pegadas_info():
    """Retorna o dicionário com informações das pegadas (icnofósseis)."""
    return {
        "Grallator": {
            "dedos": 3, "garras": True, "tamanho": "Pequeno (10-20cm)",
            "dieta": "Carnívoro (Terópode)",
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Grallator.jpg/320px-Grallator.jpg"
        },
        "Eubrontes": {
            "dedos": 3, "garras": True, "tamanho": "Grande (30-50cm)",
            "dieta": "Carnívoro (Dilofossauro?)",
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Eubrontes01.jpg/320px-Eubrontes01.jpg"
        },
        "Brontopodus": {
            "dedos": 4, "garras": False, "tamanho": "Enorme (>1m)",
            "dieta": "Herbívoro (Saurópode)",
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Brontopodus.jpg/320px-Brontopodus.jpg"
        },
        "Anomoepus": {
            "dedos": 4, "garras": True, "tamanho": "Médio",
            "dieta": "Herbívoro (Ornitísquio)",
            "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Anomoepus.jpg/320px-Anomoepus.jpg"
        }
    }
