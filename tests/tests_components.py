# tests/test_components.py
import pandas as pd
import pytest

# Simulação exatamente igual à usada no app (aba_extincao_kpg)
def simular_extincao(bloqueio_solar, chuva_acida, anos_sim):
    P0, H0, C0 = 100.0, 50.0, 20.0
    r = 0.4 * (1 - bloqueio_solar/100)
    a = 0.01
    b = 0.6
    d = 0.1 + (chuva_acida/100)*0.05
    e = 0.02
    f = 0.3
    g = 0.15 + (chuva_acida/100)*0.02

    dt = 1.0
    P, H, C = [P0], [H0], [C0]
    for _ in range(anos_sim):
        p_prox = P[-1] * (1 + r * dt) / (1 + a * H[-1] * dt)
        h_prox = H[-1] * (1 + b * a * p_prox * dt) / (1 + d * dt + e * C[-1] * dt)
        c_prox = C[-1] * (1 + f * e * h_prox * dt) / (1 + g * dt)
        P.append(p_prox)
        H.append(h_prox)
        C.append(c_prox)
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
