# tests/test_components.py
import pandas as pd
import pytest
from components import classificar_pegada, estimar_massa_corporal

# Testes da classificação de pegadas
def test_classificar_pegada_grallator():
    assert classificar_pegada(3, "Sim", "Pequeno (<25cm)") == "Grallator"

def test_classificar_pegada_eubrontes():
    assert classificar_pegada(3, "Sim", "Grande (>25cm)") == "Eubrontes"

def test_classificar_pegada_anomoepus():
    assert classificar_pegada(4, "Sim") == "Anomoepus"

def test_classificar_pegada_brontopodus():
    assert classificar_pegada(4, "Não") == "Brontopodus"
    assert classificar_pegada(3, "Não") == "Brontopodus"

# Testes da estimativa de massa
def test_estimar_massa_bipede():
    massa = estimar_massa_corporal("Bípede (ex: T-Rex)", 580)  # 58 cm em mm
    assert massa == pytest.approx(0.00016 * (580**2.73), rel=1e-5)

def test_estimar_massa_quadrupede():
    massa = estimar_massa_corporal("Quadrúpede (ex: Braquiossauro)", 1000)
    assert massa == pytest.approx(0.00049 * (1000**2.75), rel=1e-5)

# Teste da simulação K-Pg
def simular_extincao(bloqueio_solar, chuva_acida, anos_sim):
    # Mesma lógica do componente, retornando DataFrame
    P0, H0, C0 = 100.0, 50.0, 20.0
    r = 0.4 * (1 - bloqueio_solar/100)
    a = 0.01
    b = 0.6
    d = 0.1 + (chuva_acida/100)*0.05
    e = 0.02
    f = 0.3
    g = 0.15 + (chuva_acida/100)*0.02
    P, H, C = [P0], [H0], [C0]
    for _ in range(anos_sim):
        p_prox = P[-1] + (r * P[-1] - a * P[-1] * H[-1])
        h_prox = H[-1] + (b * a * P[-1] * H[-1] - d * H[-1] - e * H[-1] * C[-1])
        c_prox = C[-1] + (f * e * H[-1] * C[-1] - g * C[-1])
        P.append(max(p_prox, 0.1))
        H.append(max(h_prox, 0.1))
        C.append(max(c_prox, 0.1))
    return pd.DataFrame({
        "Plantas": P,
        "Herbívoros": H,
        "Carnívoros": C
    })

def test_simulacao_extincao_colapso():
    df = simular_extincao(100, 100, 30)
    assert df["Plantas"].iloc[-1] < 1.0
    assert df["Herbívoros"].iloc[-1] < 5.0

def test_simulacao_extincao_estavel():
    df = simular_extincao(0, 0, 10)
    # Sem estresse, populações devem continuar altas
    assert df["Plantas"].iloc[-1] > 10
    assert df["Herbívoros"].iloc[-1] > 20
