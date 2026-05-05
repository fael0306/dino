import pandas as pd
import pytest
from components import identificar_icnogenus

# ─── Classificador de icnofósseis ────────────────────────────────────
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

# ─── Simulação da Extinção K‑Pg (Runge‑Kutta 4) ─────────────────────
def simular_extincao_rk4(bloqueio_solar, chuva_acida, anos_sim):
    P0, H0, C0 = 100.0, 50.0, 20.0
    r = 0.4 * (1 - bloqueio_solar / 100)
    a = 0.01
    b = 0.6
    d = 0.1 + (chuva_acida / 100) * 0.05
    e = 0.02
    f = 0.3
    g = 0.15 + (chuva_acida / 100) * 0.02

    def lotka_volterra(state):
        P, H, C = state
        dP = r * P - a * P * H
        dH = b * a * P * H - d * H - e * H * C
        dC = f * e * H * C - g * C
        return dP, dH, dC

    dt = 0.5
    n_steps = int(anos_sim / dt)
    P, H, C = [P0], [H0], [C0]
    state = [P0, H0, C0]
    for _ in range(n_steps):
        k1 = lotka_volterra(state)
        k2 = lotka_volterra([state[0] + dt/2 * k1[0],
                             state[1] + dt/2 * k1[1],
                             state[2] + dt/2 * k1[2]])
        k3 = lotka_volterra([state[0] + dt/2 * k2[0],
                             state[1] + dt/2 * k2[1],
                             state[2] + dt/2 * k2[2]])
        k4 = lotka_volterra([state[0] + dt * k3[0],
                             state[1] + dt * k3[1],
                             state[2] + dt * k3[2]])
        state[0] += dt / 6 * (k1[0] + 2*k2[0] + 2*k3[0] + k4[0])
        state[1] += dt / 6 * (k1[1] + 2*k2[1] + 2*k3[1] + k4[1])
        state[2] += dt / 6 * (k1[2] + 2*k2[2] + 2*k3[2] + k4[2])
        state[0] = max(0.0, state[0])
        state[1] = max(0.0, state[1])
        state[2] = max(0.0, state[2])
        P.append(state[0])
        H.append(state[1])
        C.append(state[2])
    return pd.DataFrame({"Plantas": P, "Herbívoros": H, "Carnívoros": C})


def test_simulacao_extincao_colapso_rk4():
    df = simular_extincao_rk4(100, 100, 30)
    assert df["Plantas"].iloc[-1] < 1.0
    assert df["Herbívoros"].iloc[-1] < 5.0

def test_simulacao_extincao_estavel_rk4():
    df = simular_extincao_rk4(0, 0, 10)
    assert df["Plantas"].iloc[-1] > 10
    assert df["Herbívoros"].iloc[-1] > 20

def test_simulacao_sem_valores_negativos():
    df = simular_extincao_rk4(100, 100, 50)
    assert (df >= 0).all().all()
