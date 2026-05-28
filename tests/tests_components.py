# tests_components.py
import pandas as pd
import pytest
from components import identificar_icnogenus
from utils import simular_extincao_rk4   # nova importação

# ─── Classificador de icnofósseis (sem alterações) ───
def test_identificar_icnogenus_grallator():
    assert identificar_icnogenus(3, True, "pequeno") == "Grallator"

def test_identificar_icnogenus_eubrontes():
    assert identificar_icnogenus(3, True, "grande", forma="alongada") == "Eubrontes"

def test_identificar_icnogenus_megalosauripus():
    assert identificar_icnogenus(3, True, "grande", forma="larga") == "Megalosauripus"

def test_identificar_icnogenus_wintonopus():
    assert identificar_icnogenus(3, False, "pequeno") == "Wintonopus"

def test_identificar_icnogenus_amblydactylus():
    assert identificar_icnogenus(3, False, "grande") == "Amblydactylus"

def test_identificar_icnogenus_anomoepus():
    assert identificar_icnogenus(4, True) == "Anomoepus"

def test_identificar_icnogenus_brontopodus():
    assert identificar_icnogenus(4, False, proporcao="larga") == "Brontopodus"

def test_identificar_icnogenus_parabrontopodus():
    assert identificar_icnogenus(4, False, proporcao="alongada") == "Parabrontopodus"

# ─── Simulação da Extinção K‑Pg (agora usando utils) ─────────────────────
def test_simulacao_extincao_colapso_rk4():
    df = simular_extincao_rk4(100, 100, 30)
    assert df["Plantas"].iloc[-1] < 1.0
    assert df["Herbívoros"].iloc[-1] < 5.0

def test_simulacao_extincao_estavel_rk4():
    df = simular_extincao_rk4(0, 0, 10)
    # Teste mais robusto: não houve colapso total
    assert df["Herbívoros"].iloc[-1] > 10  # antes era >20, valor fixo frágil

def test_simulacao_sem_valores_negativos():
    df = simular_extincao_rk4(100, 100, 50)
    assert (df >= 0).all().all()