# utils.py
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Ellipse
from PIL import Image, ImageOps
import io
import os
from typing import Tuple

# --- Funções gerais de imagem (agora em português) ---
def abrir_imagem(caminho_imagem):
    """Carrega uma imagem a partir do caminho especificado."""
    return Image.open(caminho_imagem)


def salvar_imagem(imagem, caminho_salvar):
    """Salva a imagem fornecida no caminho especificado."""
    imagem.save(caminho_salvar)


def extrair_silhueta(imagem):
    """Gera uma silhueta a partir da imagem fornecida."""
    imagem_cinza = imagem.convert('L')
    silhueta = ImageOps.invert(imagem_cinza)
    return silhueta


def visualizar_comparacao(imagem_original, imagem_processada):
    """Exibe a comparação entre a imagem original e a processada."""
    fig, eixos = plt.subplots(1, 2)
    eixos[0].imshow(imagem_original)
    eixos[0].set_title('Imagem Original')
    eixos[1].imshow(imagem_processada)
    eixos[1].set_title('Imagem Processada')
    plt.show()


def calcular_escalas(tamanho_original, tamanho_alvo):
    """Calcula fatores de escala para redimensionamento de imagens."""
    escala_x = tamanho_alvo[0] / tamanho_original[0]
    escala_y = tamanho_alvo[1] / tamanho_original[1]
    return escala_x, escala_y


# --- Funções específicas do PaleoLab ---
def get_referencia(ref_sel: str) -> Tuple[str, float, float]:
    """Traduz a seleção de referência em (nome, comprimento_m, altura_m)."""
    if "Humano" in ref_sel:
        return "Humano", 1.7, 1.7
    elif "Elefante" in ref_sel:
        return "Elefante", 6.0, 3.3
    elif "Ônibus" in ref_sel:
        return "Ônibus", 12.0, 3.2
    else:
        raise ValueError(f"Referência inválida: {ref_sel}")


def criar_silhueta_placeholder(nome: str) -> Image.Image:
    """Desenha uma silhueta com matplotlib quando a imagem real não existe."""
    fig, ax = plt.subplots(figsize=(3, 2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    formas = {
        "Tyrannosaurus rex": [(2,1), (8,1), (9,4), (7,6), (5,7), (3,6), (1,4)],
        "Triceratops": [(1,2), (8,2), (9,5), (7,8), (3,8), (1,5)],
        "Velociraptor": [(3,1), (7,1), (8,3), (6,5), (4,5), (2,3)],
        "Brachiosaurus": [(1,2), (9,2), (9,5), (8,7), (6,9), (4,9), (2,7), (1,5)],
        "Humano": [(4,0), (6,0), (6,7), (5,9), (4,7), (4,0)],
        "Elefante": [(1,2), (8,2), (9,5), (7,7), (3,7), (1,5)],
        "Ônibus": [(1,4), (9,4), (9,6), (1,6)]
    }

    if nome not in formas:
        formas[nome] = [(2,2), (8,2), (8,7), (2,7)]

    poly = Polygon(formas[nome], closed=True, facecolor='#4a4a4a', edgecolor='black', linewidth=1.5)
    ax.add_patch(poly)

    if nome in ["Tyrannosaurus rex", "Velociraptor", "Triceratops", "Brachiosaurus", "Humano", "Elefante"]:
        olho_x = 7.5 if nome != "Humano" else 5.2
        olho_y = 7.0 if nome != "Humano" else 8.0
        eye = Ellipse((olho_x, olho_y), 0.8, 0.8, color='white', zorder=5)
        ax.add_patch(eye)
        pupila = Ellipse((olho_x+0.1, olho_y-0.1), 0.3, 0.3, color='black', zorder=6)
        ax.add_patch(pupila)

    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1, transparent=True)
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert("RGBA")


def carregar_imagem(nome: str) -> Image.Image:
    """Carrega imagem da pasta assets/ ou gera fallback."""
    mapa_arquivos = {
        "Tyrannosaurus rex": "trex.png",
        "Triceratops": "triceratops.png",
        "Velociraptor": "velociraptor.png",
        "Brachiosaurus": "brachiosaurus.png",
        "Humano": "human.png",
        "Elefante": "elephant.png",
        "Ônibus": "onibus.png"
    }
    nome_arquivo = mapa_arquivos.get(nome, nome.lower().replace(" ", "_") + ".png")
    caminho = os.path.join("assets", nome_arquivo)

    if os.path.exists(caminho):
        return Image.open(caminho).convert("RGBA")
    else:
        return criar_silhueta_placeholder(nome)


def redimensionar_para_altura(imagem: Image.Image, altura_alvo: int) -> Image.Image:
    """Redimensiona a imagem para uma altura específica mantendo a proporção."""
    percentual_altura = altura_alvo / float(imagem.size[1])
    nova_largura = int(imagem.size[0] * percentual_altura)
    return imagem.resize((nova_largura, altura_alvo), Image.LANCZOS)


def plot_comparacao_escala(dino_nome: str, referencia_nome: str,
                           comprimento_dino: float, comprimento_ref: float) -> plt.Figure:
    """Gráfico de barras horizontal para comparação de tamanhos."""
    fig, ax = plt.subplots(figsize=(8, 3))
    categorias = [referencia_nome, dino_nome]
    valores = [comprimento_ref, comprimento_dino]
    barras = ax.barh(categorias, valores, color=['gray', 'green'])
    for bar, val in zip(barras, valores):
        ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
                f'{val:.1f} m', va='center')
    ax.set_xlabel('Comprimento (metros)')
    ax.set_title(f'Comparação de Escala: {dino_nome} vs {referencia_nome}')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    return fig
