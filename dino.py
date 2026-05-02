# dino.py
import streamlit as st
from data import carregar_dados_dinossauros
from components import (
    aba_escala_real,
    aba_deriva_continental,
    aba_extincao_kpg,
    aba_icnofosseis,
    aba_etimologia,
    aba_massa_corporal
)

# Configuração da página
st.set_page_config(page_title="PaleoLab Científico", layout="wide")

# Carregar dados
df = carregar_dados_dinossauros()

# Interface principal
st.title("🦴 PaleoLab Científico - Edição Ensino Fundamental/Médio")
st.markdown("Explorando dinossauros com dados reais e modelos matemáticos da paleontologia.")

abas = st.tabs([
    "📏 Escala Real",
    "🗺️ Deriva Continental",
    "🦠 Extinção K-Pg",
    "👣 Icnofósseis",
    "📖 Etimologia",
    "⚖️ Massa Corporal"
])

# Chamar as funções de componente para cada aba
with abas[0]:
    aba_escala_real(df)

with abas[1]:
    aba_deriva_continental(df)

with abas[2]:
    aba_extincao_kpg()

with abas[3]:
    aba_icnofosseis()

with abas[4]:
    aba_etimologia()

with abas[5]:
    aba_massa_corporal()
