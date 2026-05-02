# tests/test_utils.py
import pytest
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
from utils import (
    get_referencia, calcular_escalas, redimensionar_para_altura,
    criar_silhueta_placeholder, plot_comparacao_escala, carregar_imagem
)

# Teste da função get_referencia
def test_get_referencia_humano():
    nome, comp, alt = get_referencia("Humano (1.7m)")
    assert nome == "Humano"
    assert comp == 1.7
    assert alt == 1.7

def test_get_referencia_elefante():
    nome, comp, alt = get_referencia("Elefante Africano (6m)")
    assert nome == "Elefante"
    assert comp == 6.0
    assert alt == 3.3

def test_get_referencia_onibus():
    nome, comp, alt = get_referencia("Ônibus Escolar (12m)")
    assert nome == "Ônibus"
    assert comp == 12.0
    assert alt == 3.2

def test_get_referencia_invalida():
    with pytest.raises(ValueError):
        get_referencia("Cavalo")

# Teste de calcular_escalas
def test_calcular_escalas():
    esc_x, esc_y = calcular_escalas((100, 200), (200, 400))
    assert esc_x == 2.0
    assert esc_y == 2.0

    esc_x, esc_y = calcular_escalas((100, 100), (50, 200))
    assert esc_x == 0.5
    assert esc_y == 2.0

# Teste de redimensionar_para_altura
def test_redimensionar_para_altura():
    img = Image.new('RGB', (100, 200))
    img_resized = redimensionar_para_altura(img, 100)
    assert img_resized.size == (50, 100)  # mantém proporção

    img_resized2 = redimensionar_para_altura(img, 400)
    assert img_resized2.size == (200, 400)

# Teste de criar_silhueta_placeholder
def test_criar_silhueta_placeholder():
    img = criar_silhueta_placeholder("Tyrannosaurus rex")
    assert isinstance(img, Image.Image)
    assert img.mode == "RGBA"
    # Verifica que não está vazia
    assert img.size[0] > 0 and img.size[1] > 0

    # Teste com nome desconhecido
    img2 = criar_silhueta_placeholder("Dinossauro Desconhecido")
    assert isinstance(img2, Image.Image)

# Teste de plot_comparacao_escala
def test_plot_comparacao_escala():
    fig = plot_comparacao_escala("T-rex", "Humano", 12.3, 1.7)
    assert isinstance(fig, plt.Figure)
    # Verifica eixos
    ax = fig.axes[0]
    assert ax.get_title() == "Comparação de Escala: T-rex vs Humano"
    bars = ax.patches
    assert len(bars) == 2
    plt.close(fig)  # Fecha para liberar memória

# Teste de carregar_imagem (com mock para evitar dependência de arquivos)
def test_carregar_imagem_placeholder(monkeypatch):
    # Força o fallback mesmo que exista um arquivo (ignorando os.path.exists)
    monkeypatch.setattr("os.path.exists", lambda x: False)
    img = carregar_imagem("Tyrannosaurus rex")
    assert isinstance(img, Image.Image)
    assert img.mode == "RGBA"
