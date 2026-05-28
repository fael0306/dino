# dino.py
import streamlit as st
from data import carregar_dados_dinossauros
from components import (
    aba_escala_real,
    aba_deriva_continental,
    aba_extincao_kpg,
    aba_icnofosseis,
    aba_fosseis_reais,
    aba_massa_corporal,
    aba_quiz,
    aba_linha_tempo,
    aba_clima_mesozoico,
    aba_conquistas,
    aba_exportar_relatorio,
    aba_arvore_evolutiva,
)

st.set_page_config(page_title="PaleoLab Científico", layout="wide")

df = carregar_dados_dinossauros()

st.title("🦴 PaleoLab Científico - Edição Ensino Fundamental/Médio")
st.markdown("Explorando dinossauros com dados reais e modelos matemáticos da paleontologia.")

# Inicializa sistema de conquistas
if "conquistas" not in st.session_state:
    st.session_state.conquistas = {
        "quiz_facil": False,
        "quiz_medio": False,
        "quiz_dificil": False,
        "explorador_escala": False,
        "detetive_icno": False,
        "climaturista": False,
    }

abas = st.tabs([
    "📏 Escala Real",
    "🗺️ Deriva Continental",
    "🦠 Extinção K-Pg",
    "👣 Icnofósseis",
    "🦴 Fósseis Reais",
    "⚖️ Massa Corporal",
    "📝 Quiz",
    "⏳ Linha do Tempo",      # novo
    "🌍 Clima Mesozóico",     # novo
    "🏆 Conquistas",          # novo
    "📄 Exportar PDF",        # novo
    "🌳 Árvore Evolutiva",    # novo
])

with abas[0]:
    aba_escala_real(df)
with abas[1]:
    aba_deriva_continental()
with abas[2]:
    aba_extincao_kpg()
with abas[3]:
    aba_icnofosseis()
with abas[4]:
    aba_fosseis_reais()
with abas[5]:
    aba_massa_corporal()
with abas[6]:
    aba_quiz()
with abas[7]:
    aba_linha_tempo()
with abas[8]:
    aba_clima_mesozoico()
with abas[9]:
    aba_conquistas()
with abas[10]:
    aba_exportar_relatorio()
with abas[11]:
    aba_arvore_evolutiva()