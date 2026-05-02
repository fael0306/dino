# tests/test_data.py
import pandas as pd
from data import carregar_dados_dinossauros, obter_info_pegadas

def test_carregar_dados_dinossauros():
    df = carregar_dados_dinossauros()
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 7
    assert list(df.columns) == ["Nome", "Período", "Dieta", "Comprimento (m)", "Altura (m)", "Peso (ton)", "Postura"]
    # Verifica alguns valores
    t_rex = df[df["Nome"] == "Tyrannosaurus rex"].iloc[0]
    assert t_rex["Período"] == "Cretáceo"
    assert t_rex["Comprimento (m)"] == 12.3

def test_obter_info_pegadas():
    info = obter_info_pegadas()
    assert isinstance(info, dict)
    assert "Grallator" in info
    assert info["Grallator"]["dedos"] == 3
    assert info["Brontopodus"]["tamanho"] == "Enorme (>1m)"
