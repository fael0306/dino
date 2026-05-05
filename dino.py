# dino.py
import streamlit as st
from data import carregar_dados_dinossauros
from components import (
    aba_escala_real,
    aba_deriva_continental,
    aba_extincao_kpg,
    aba_icnofosseis,
    aba_fosseis_reais,
    aba_massa_corporal
)

st.set_page_config(page_title="PaleoLab Científico", layout="wide")

df = carregar_dados_dinossauros()

st.title("🦴 PaleoLab Científico - Edição Ensino Fundamental/Médio")
st.markdown("Explorando dinossauros com dados reais e modelos matemáticos da paleontologia.")

abas = st.tabs([
    "📏 Escala Real",
    "🗺️ Deriva Continental",
    "🦠 Extinção K-Pg",
    "👣 Icnofósseis",
    "🦴 Fósseis Reais",
    "⚖️ Massa Corporal"
])

with abas[0]:
    aba_escala_real(df)

with abas[1]:
    aba_deriva_continental()  # não precisa mais passar df

with abas[2]:
    aba_extincao_kpg()

with abas[3]:
    aba_icnofosseis()

with abas[4]:
    aba_fosseis_reais()

with abas[5]:
    aba_massa_corporal()
