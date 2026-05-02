import streamlit as st
from data import load_dino_data
from components import (
    escala_real_tab,
    deriva_continental_tab,
    extincao_kpg_tab,
    pegadas_tab,
    etimologia_tab,
    massa_corporal_tab
)

# Configuração da página
st.set_page_config(page_title="PaleoLab Científico", layout="wide")

# Carregar dados
df = load_dino_data()

# Interface principal
st.title("🦴 PaleoLab Científico - Edição Ensino Fundamental/Médio")
st.markdown("Explorando dinossauros com dados reais e modelos matemáticos da paleontologia.")

tabs = st.tabs([
    "📏 Escala Real",
    "🗺️ Deriva Continental",
    "🦠 Extinção K-Pg",
    "👣 Icnofósseis",
    "📖 Etimologia",
    "⚖️ Massa Corporal"
])

# Chamar as funções de componente para cada aba
with tabs[0]:
    escala_real_tab(df)

with tabs[1]:
    deriva_continental_tab(df)

with tabs[2]:
    extincao_kpg_tab()

with tabs[3]:
    pegadas_tab()

with tabs[4]:
    etimologia_tab()

with tabs[5]:
    massa_corporal_tab()
