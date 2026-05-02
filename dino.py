import streamlit as st
import pandas as pd
import numpy as np
import random
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Ellipse
from PIL import Image
import io
import os
from typing import Tuple

# =============================================================================
# CONFIGURAÇÃO INICIAL E DADOS (Cientificamente embasados)
# =============================================================================
st.set_page_config(page_title="PaleoLab Científico", layout="wide")

# Dataset enriquecido com período e dieta (dados estáticos, sem necessidade de cache)
def load_dino_data():
    data = [
        ["Tyrannosaurus rex", "Cretáceo", "Carnívoro", 12.3, 4.0, 8.4, "Bípede"],
        ["Triceratops", "Cretáceo", "Herbívoro", 9.0, 3.0, 6.0, "Quadrúpede"],
        ["Velociraptor", "Cretáceo", "Carnívoro", 2.0, 0.5, 0.015, "Bípede"],
        ["Brachiosaurus", "Jurássico", "Herbívoro", 25.0, 12.0, 50.0, "Quadrúpede"],
        ["Stegosaurus", "Jurássico", "Herbívoro", 9.0, 4.0, 7.0, "Quadrúpede"],
        ["Spinosaurus", "Cretáceo", "Piscívoro", 15.0, 5.0, 7.5, "Bípede"],
        ["Patagotitan", "Cretáceo", "Herbívoro", 37.0, 8.0, 70.0, "Quadrúpede"],
    ]
    return pd.DataFrame(data, columns=["Nome", "Período", "Dieta", "Comprimento (m)", "Altura (m)", "Peso (ton)", "Postura"])

df = load_dino_data()

# =============================================================================
# FUNÇÕES AUXILIARES CENTRALIZADAS
# =============================================================================

def get_referencia(ref_sel: str) -> Tuple[str, float, float]:
    """Centraliza a lógica de seleção de referência (nome, comprimento, altura)."""
    if "Humano" in ref_sel:
        return "Humano", 1.7, 1.7
    elif "Elefante" in ref_sel:
        return "Elefante", 6.0, 3.3
    elif "Ônibus" in ref_sel:
        return "Ônibus", 12.0, 3.2
    else:
        raise ValueError(f"Referência inválida: {ref_sel}")

def gerar_silhueta_local(nome: str) -> Image.Image:
    """
    Desenha uma silhueta simplificada usando matplotlib.
    Usado como fallback quando a imagem não está em assets/.
    """
    fig, ax = plt.subplots(figsize=(3, 2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    formas = {
        "Tyrannosaurus rex": [(2,1), (8,1), (9,4), (7,6), (5,7), (3,6), (1,4)],
        "Triceratops": [(1,2), (8,2), (9,5), (7,8), (3,8), (1,5)],
        "Velociraptor": [(3,1), (7,1), (8,3), (6,5), (4,5), (2,3)],
        "Brachiosaurus": [(1,2), (9,2), (9,5), (8,7), (6,9), (4,9), (2,7), (1,5)],
        "Humano": [(4,0), (6,0), (6,7), (5,9), (4,7), (4,0)],
        "Elefante": [(1,2), (8,2), (9,5), (7,7), (3,7), (1,5)],
        "Ônibus": [(1,4), (9,4), (9,6), (1,6)]
    }
    
    if nome not in formas:
        formas[nome] = [(2,2), (8,2), (8,7), (2,7)]
    
    poly = Polygon(formas[nome], closed=True, facecolor='#4a4a4a', edgecolor='black', linewidth=1.5)
    ax.add_patch(poly)
    
    # Olho para humanizar (opcional)
    if nome in ["Tyrannosaurus rex", "Velociraptor", "Triceratops", "Brachiosaurus", "Humano", "Elefante"]:
        olho_x = 7.5 if nome != "Humano" else 5.2
        olho_y = 7.0 if nome != "Humano" else 8.0
        eye = Ellipse((olho_x, olho_y), 0.8, 0.8, color='white', zorder=5)
        ax.add_patch(eye)
        pupila = Ellipse((olho_x+0.1, olho_y-0.1), 0.3, 0.3, color='black', zorder=6)
        ax.add_patch(pupila)
    
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0.1, transparent=True)
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert("RGBA")

def carregar_imagem(nome: str) -> Image.Image:
    """
    Carrega a imagem da silhueta:
    1. Tenta carregar de assets/ (nome em minúsculas, sem espaços, .png)
    2. Se não encontrar, gera uma silhueta local com matplotlib.
    """
    # Mapeamento de nomes para nomes de arquivo conhecidos
    mapa_arquivos = {
        "Tyrannosaurus rex": "trex.png",
        "Triceratops": "triceratops.png",
        "Velociraptor": "velociraptor.png",
        "Brachiosaurus": "brachiosaurus.png",
        "Humano": "human.png",
        "Elefante": "elephant.png",
        "Ônibus": "onibus.png"  # Caso adicione depois
    }
    
    nome_arquivo = mapa_arquivos.get(nome, nome.lower().replace(" ", "_") + ".png")
    caminho = os.path.join("assets", nome_arquivo)
    
    if os.path.exists(caminho):
        return Image.open(caminho).convert("RGBA")
    else:
        return gerar_silhueta_local(nome)

def resize_by_height(img: Image.Image, altura_real: float, altura_ref_real: float, 
                     altura_base_px: int = 220) -> Image.Image:
    """Redimensiona a imagem proporcionalmente, com compressão log para extremos."""
    if altura_ref_real <= 0:
        raise ValueError("Altura de referência deve ser positiva.")
    
    proporcao = altura_real / altura_ref_real
    
    # Compressão logarítmica para diferenças extremas (>15x)
    if proporcao > 15:
        proporcao = 15 + np.log(proporcao - 14)
    elif proporcao < 1/15:
        proporcao = 1/15 - np.log(1/proporcao - 14)
    
    new_height = int(altura_base_px * proporcao)
    new_height = max(20, min(new_height, 700))  # limites suaves
    
    h_percent = new_height / float(img.size[1])
    new_width = int(img.size[0] * h_percent)
    
    return img.resize((new_width, new_height), Image.LANCZOS)

def plot_comparacao_escala(dino_nome: str, referencia_nome: str, 
                           tamanho_dino: float, tamanho_ref: float) -> plt.Figure:
    """Gráfico de barras horizontais para comparação de tamanhos."""
    fig, ax = plt.subplots(figsize=(8, 3))
    categorias = [referencia_nome, dino_nome]
    valores = [tamanho_ref, tamanho_dino]
    bars = ax.barh(categorias, valores, color=['gray', 'green'])
    
    for bar, val in zip(bars, valores):
        ax.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2, 
                f'{val:.1f} m', va='center')
    
    ax.set_xlabel('Comprimento (metros)')
    ax.set_title(f'Comparação de Escala: {dino_nome} vs {referencia_nome}')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    return fig

# =============================================================================
# INTERFACE STREAMLIT
# =============================================================================
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

# =============================================================================
# 1. ESCALA REAL (COM SILHUETAS)
# =============================================================================
with tabs[0]:
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.header("📏 Compare a Escala")
        dino_sel = st.selectbox("Escolha um dinossauro:", df["Nome"])
        ref_sel = st.radio("Comparar com:", ["Humano (1.7m)", "Elefante Africano (6m)", "Ônibus Escolar (12m)"])
        
        # Centralizado: obtém referência (nome, comprimento, altura)
        ref_nome, tamanho_ref, altura_ref = get_referencia(ref_sel)
        
        # Validação da altura de referência
        if altura_ref <= 0:
            st.error("Altura de referência inválida. Contate o suporte.")
            st.stop()
        
        # Dados do dinossauro
        dino_data = df[df["Nome"] == dino_sel].iloc[0]
        tamanho_dino = dino_data["Comprimento (m)"]
        altura_dino = dino_data["Altura (m)"]
        
        # Proporção
        razao = altura_dino / altura_ref
        st.metric(label="Proporção (altura)", value=f"{razao:.1f}x", delta=f"{altura_dino:.1f}m")
        
        if st.checkbox("🔬 Por que ossos ocos?"):
            st.info("""
            **Adaptação Evolutiva:** Dinossauros Saurísquios (como o T-Rex e Braquiossauro) 
            possuíam ossos pneumáticos (ocos), conectados a sacos aéreos. Isso reduzia o peso 
            sem sacrificar a resistência, permitindo tamanhos gigantescos. As aves modernas 
            herdaram essa característica!
            """)
    
    with col2:
        try:
            # Carregamento robusto: assets/ ou fallback local
            img_dino = carregar_imagem(dino_sel)
            img_ref = carregar_imagem(ref_nome)
            
            # Redimensionamento proporcional
            base_px = 220
            img_ref_resized = resize_by_height(img_ref, altura_ref, altura_ref, base_px)
            img_dino_resized = resize_by_height(img_dino, altura_dino, altura_ref, base_px)
            
            st.markdown("### Comparação Visual")
            col_img1, col_img2 = st.columns(2)
            
            with col_img1:
                st.image(img_ref_resized)
                st.caption(f"{ref_nome} ({altura_ref} m)")
            
            with col_img2:
                st.image(img_dino_resized)
                st.caption(f"{dino_sel} ({altura_dino} m)")
            
            # Nota sobre compressão logarítmica
            if altura_dino / altura_ref > 10:
                st.info("📐 **Nota:** Para diferenças extremas, a escala visual usa compressão logarítmica para manter a comparabilidade.")
                
        except Exception as e:
            st.warning("⚠️ Erro ao processar silhuetas. Mostrando gráfico alternativo.")
            fig = plot_comparacao_escala(dino_sel, ref_nome, tamanho_dino, tamanho_ref)
            st.pyplot(fig)
            st.caption(f"Detalhe técnico: {str(e)}")

# =============================================================================
# 2. MAPA DA DERIVA CONTINENTAL
# =============================================================================
with tabs[1]:
    st.header("🗺️ Onde os Fósseis Foram Encontrados?")
    
    @st.cache_data(ttl=3600)
    def get_fossil_data(dino_nome):
        fossil_sites = {
            "Tyrannosaurus rex": [(47.5, -106.0), (44.0, -103.0)],
            "Spinosaurus": [(30.0, 31.0), (28.0, 33.0)],
            "Brachiosaurus": [(39.0, -108.0)],
            "Triceratops": [(47.5, -106.0)],
            "Velociraptor": [(44.0, 102.0)],
        }
        return pd.DataFrame(fossil_sites.get(dino_nome, [(0, 0)]), columns=["lat", "lon"])
    
    dino_mapa = st.selectbox("Selecione um dinossauro para ver suas descobertas:", df["Nome"], key="mapa_select")
    
    modo_mapa = st.radio("Linha do Tempo Geológico:", 
                         ["Mundo Atual (Holoceno)", "Cretáceo Superior (66 Ma)"],
                         help="No Cretáceo, a América do Sul e África estavam unidas, e a Índia era uma ilha.")
    
    df_mapa = get_fossil_data(dino_mapa)
    
    if modo_mapa == "Cretáceo Superior (66 Ma)":
        df_mapa["lon"] = df_mapa["lon"].apply(lambda x: x - 20 if x < 0 else x + 30)
        df_mapa["lat"] = df_mapa["lat"].apply(lambda y: y - 10)
        st.caption("🌍 Os continentes estavam mais próximos. Isso explica por que encontramos fósseis iguais no Brasil e na África!")
    
    st.map(df_mapa, zoom=2)
    
    st.markdown("---")
    st.markdown("**Dados Científicos:** As coordenadas são baseadas no [Paleobiology Database](https://paleobiodb.org/). O mapa do Cretáceo é uma aproximação visual da movimentação das placas tectônicas.")

# =============================================================================
# 3. SIMULADOR DE EXTINÇÃO K-PG
# =============================================================================
with tabs[2]:
    st.header("🦠 Simulador do Fim do Cretáceo")
    st.markdown("Baseado no modelo **Lotka-Volterra** (Presas-Predadores) e nos efeitos do Inverno de Impacto.")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        bloqueio_solar = st.slider("🌑 Bloqueio Solar (%)", 0, 100, 15)
    with col2:
        chuva_acida = st.slider("☔ Intensidade da Chuva Ácida", 0, 100, 40)
    with col3:
        anos_sim = st.slider("📅 Anos após o impacto", 1, 50, 30)
    
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
        p_next = P[-1] + (r * P[-1] - a * P[-1] * H[-1])
        h_next = H[-1] + (b * a * P[-1] * H[-1] - d * H[-1] - e * H[-1] * C[-1])
        c_next = C[-1] + (f * e * H[-1] * C[-1] - g * C[-1])
        P.append(max(p_next, 0.1 if p_next <= 0 else p_next))
        H.append(max(h_next, 0.1 if h_next <= 0 else h_next))
        C.append(max(c_next, 0.1 if c_next <= 0 else c_next))
    
    df_sim = pd.DataFrame({
        "Plantas (Base da Cadeia)": P,
        "Herbívoros (ex: Tricerátops)": H,
        "Carnívoros (ex: T-Rex)": C
    })
    st.line_chart(df_sim)
    
    if P[-1] < 1.0:
        st.error("🔥 **COLAPSO TOTAL:** A falta de luz causou a extinção das plantas. Sem comida, os herbívoros morreram, seguidos pelos grandes carnívoros. Apenas pequenos animais onívoros sobreviveram.")
    elif H[-1] < 5.0:
        st.warning("⚠️ **ECOSSISTEMA DEVASTADO:** Os grandes dinossauros não-avianos foram extintos. Mamíferos pequenos começam a ocupar os nichos vagos.")
    else:
        st.success("🌿 **ECOSSISTEMA ESTÁVEL:** O impacto não foi severo o suficiente para causar extinção em massa. (Mas lembre-se: na realidade, o bloqueio solar durou anos!)")

# =============================================================================
# 4. PEGADAS - CHAVE DICOTÔMICA INTERATIVA
# =============================================================================
with tabs[3]:
    st.header("👣 Paleo-Detetive: Identifique a Pegada")
    
    pegadas_info = {
        "Grallator": {"dedos": 3, "garras": True, "tamanho": "Pequeno (10-20cm)", "dieta": "Carnívoro (Terópode)", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Grallator.jpg/320px-Grallator.jpg"},
        "Eubrontes": {"dedos": 3, "garras": True, "tamanho": "Grande (30-50cm)", "dieta": "Carnívoro (Dilofossauro?)", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Eubrontes01.jpg/320px-Eubrontes01.jpg"},
        "Brontopodus": {"dedos": 4, "garras": False, "tamanho": "Enorme (>1m)", "dieta": "Herbívoro (Saurópode)", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Brontopodus.jpg/320px-Brontopodus.jpg"},
        "Anomoepus": {"dedos": 4, "garras": True, "tamanho": "Médio", "dieta": "Herbívoro (Ornitísquio)", "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Anomoepus.jpg/320px-Anomoepus.jpg"}
    }
    
    col1, col2 = st.columns(2)
    with col1:
        dedos = st.radio("1. Quantos dedos tocam o chão?", [3, 4])
        garras = st.radio("2. Marcas de garras afiadas?", ["Sim", "Não"])
        if dedos == 3 and garras == "Sim":
            tamanho = st.radio("3. Tamanho da pegada?", ["Pequeno (<25cm)", "Grande (>25cm)"])
            resultado = "Grallator" if tamanho == "Pequeno (<25cm)" else "Eubrontes"
        elif dedos == 4 and garras == "Sim":
            resultado = "Anomoepus"
        else:
            resultado = "Brontopodus"
    
    with col2:
        st.subheader(f"🔍 Resultado: Icnogênero *{resultado}*")
        try:
            st.image(pegadas_info[resultado]["img"], caption=f"Fóssil de {resultado}", width=300)
        except:
            st.warning("Imagem não disponível")
        st.markdown(f"""
        - **Dieta provável:** {pegadas_info[resultado]['dieta']}
        - **Tamanho típico:** {pegadas_info[resultado]['tamanho']}
        """)
        st.caption("Icnofósseis são vestígios de atividade biológica. Eles nos ajudam a entender o comportamento sem precisar de ossos!")

# =============================================================================
# 5. GERADOR DE NOMES COM ETIMOLOGIA
# =============================================================================
with tabs[4]:
    st.header("📖 Gerador de Nomes Científicos (Etimologia Grega/Latina)")
    
    radicais = {
        "Micro": "Pequeno", "Mega": "Grande", "Pachy": "Grosso / Espesso",
        "Brachy": "Curto", "Elasmo": "Placa / Chapa", "Cephalo": "Cabeça",
        "Dont": "Dente", "Raptor": "Ladrão / Caçador", "Saurus": "Lagarto / Réptil",
        "Ops": "Rosto / Face"
    }
    
    if st.button("🧬 Gerar Novo Dinossauro Fictício", type="primary"):
        prefixo = random.choice(list(radicais.keys())[:5])
        sufixo = random.choice(list(radicais.keys())[5:])
        nome_completo = prefixo + sufixo.lower()
        significado_pref = radicais[prefixo]
        significado_suf = radicais[sufixo]
        
        st.success(f"### *{nome_completo}*")
        st.markdown(f"**Significado Científico:** **{significado_pref}** + **{significado_suf}**")
        
        if "Raptor" in sufixo:
            habito = "provavelmente um predador ágil"
        elif "Saurus" in sufixo:
            habito = "um réptil de grande porte"
        else:
            habito = "um dinossauro de características mistas"
        st.info(f"💡 **Interpretação Paleontológica:** {habito} cujo nome reflete {significado_pref.lower()} e {significado_suf.lower()}. Exemplo real similar: *Pachycephalosaurus* (Lagarto de Cabeça Grossa).")

# =============================================================================
# 6. ESTIMATIVA DE MASSA (BIOMECÂNICA)
# =============================================================================
with tabs[5]:
    st.header("⚖️ Estimativa de Massa Corporal por Circunferência Femoral")
    st.markdown("Baseado no estudo de **Campione & Evans (2012)** - *BMC Biology*.")
    
    col1, col2 = st.columns(2)
    with col1:
        postura = st.radio("Tipo de Locomoção do Dinossauro:", ["Bípede (ex: T-Rex)", "Quadrúpede (ex: Braquiossauro)"])
        circ_femur = st.number_input("📏 Circunferência do Fêmur (cm):", min_value=1.0, max_value=200.0, value=50.0, step=1.0)
        
        if postura == "Bípede (ex: T-Rex)":
            a, b = 0.00016, 2.73
        else:
            a, b = 0.00049, 2.75
        
        massa_kg = a * (circ_femur ** b)
        massa_ton = massa_kg / 1000
        st.metric(label="🐘 Massa Estimada", value=f"{massa_ton:.2f} toneladas", delta=f"{massa_kg:.0f} kg")
    
    with col2:
        st.markdown("""
        ### Como funciona?
        A circunferência do osso da coxa (fêmur) é o melhor indicador do peso que o animal suportava. 
        A equação é:
        """)
        st.latex(r"Massa = a \times (Circunferência)^{b}")
        st.markdown(f"""
        - **a = {a:.6f}**
        - **b = {b:.2f}**
        
        *Exemplo real:* O fêmur do *Tyrannosaurus rex* "Sue" (FMNH PR 2081) tem cerca de 58 cm de circunferência.
        Isso resulta em aproximadamente **9.5 toneladas**.
        """)
        st.caption("Referência: Campione, N. E., & Evans, D. C. (2012). A universal scaling relationship between body mass and proximal limb bone dimensions in quadrupedal terrestrial tetrapods.")
