import pandas as pd
from data import (
    carregar_dados_dinossauros,
    obter_info_pegadas,
    obter_coordenadas,
    obter_banco_dinossauros_reais,
    obter_quiz_perguntas
)

def test_carregar_dados_dinossauros():
    df = carregar_dados_dinossauros()
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 7
    assert list(df.columns) == ["Nome", "Período", "Dieta", "Comprimento (m)", "Altura (m)", "Peso (ton)", "Postura"]
    t_rex = df[df["Nome"] == "Tyrannosaurus rex"].iloc[0]
    assert t_rex["Período"] == "Cretáceo"
    assert t_rex["Comprimento (m)"] == 12.3

def test_obter_info_pegadas():
    info = obter_info_pegadas()
    assert isinstance(info, dict)
    # Verifica se os icnogêneros adicionados estão presentes
    assert "Grallator" in info
    assert "Eubrontes" in info
    assert "Megalosauripus" in info
    assert "Wintonopus" in info
    assert "Amblydactylus" in info
    assert "Anomoepus" in info
    assert "Brontopodus" in info
    assert "Parabrontopodus" in info
    # Confere atributos de um exemplar
    assert info["Grallator"]["dedos"] == 3
    assert info["Grallator"]["garras"] is True
    assert info["Brontopodus"]["tamanho"] == "Enorme (>1 m, largo)"

def test_obter_coordenadas_existente():
    coords = obter_coordenadas("Tyrannosaurus rex")
    assert len(coords) >= 1
    assert all(isinstance(c, tuple) and len(c) == 2 for c in coords)

def test_obter_coordenadas_inexistente():
    coords = obter_coordenadas("Dinossauro Inexistente")
    assert coords == [(0.0, 0.0)]

def test_obter_banco_dinossauros_reais():
    banco = obter_banco_dinossauros_reais()
    assert isinstance(banco, list)
    assert len(banco) == 50  # exatamente 50 dinossauros
    # Verifica estrutura do primeiro item
    dino = banco[0]
    for chave in ["Nome", "Período", "Dieta", "Comprimento", "Altura", "Peso", "Postura", "Curiosidade", "Arquivo"]:
        assert chave in dino
    assert isinstance(dino["Comprimento"], (int, float))
    assert isinstance(dino["Peso"], (int, float))

def test_obter_quiz_perguntas():
    quiz = obter_quiz_perguntas()
    assert isinstance(quiz, dict)
    for nivel in ["Fácil", "Médio", "Difícil"]:
        assert nivel in quiz
        perguntas = quiz[nivel]
        assert isinstance(perguntas, list)
        assert len(perguntas) == 20
        for p in perguntas:
            assert "pergunta" in p
            assert "opcoes" in p
            assert "resposta" in p
            assert isinstance(p["opcoes"], list) and len(p["opcoes"]) == 4
            assert 0 <= p["resposta"] <= 3
