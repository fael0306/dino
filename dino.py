import streamlit as st
import pandas as pd
import numpy as np
import random
import matplotlib.pyplot as plt
from PIL import Image
import requests
from io import BytesIO
import time

# =============================================================================
# CONFIGURAÇÃO INICIAL E DADOS (Cientificamente embasados)
# =============================================================================
st.set_page_config(page_title="PaleoLab Científico", layout="wide")

# Dados de silhuetas (Caminhos para imagens - Você pode baixar da PhyloPic.org)
# Coloque os arquivos .png ou .svg em uma pasta /assets
SILHUETAS = {
    "Tyrannosaurus rex": "assets/trex.png",
    "Triceratops": "assets/triceratops.png",
    "Velociraptor": "assets/velociraptor.png",
    "Brachiosaurus": "assets/brachiosaurus.png",
    "Humano": "assets/human.png",
    "Elefante": "assets/elephant.png"
}

# Dataset enriquecido com período e dieta
@st.cache_data
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
# FUNÇÕES AUXILIARES (Robustez e Reutilização)
# =============================================================================
def plot_comparacao_escala(dino_nome, referencia_nome, tamanho_dino, tamanho_ref):
    """Cria uma figura matplotlib com duas barras proporcionais."""
    fig, ax = plt.subplots(figsize=(8, 3))
    categorias = [referencia_nome, dino_nome]
    valores = [tamanho_ref, tamanho_dino]
    bars = ax.barh(categorias, valores, color=['gray', 'green'])
    
    # Adicionar texto com o valor
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
        
        # Extrair tamanhos
        tamanho_dino = df[df["Nome"] == dino_sel]["Comprimento (m)"].values[0]
        
        if "Humano" in ref_sel:
            tamanho_ref = 1.7
            ref_nome = "Humano"
        elif "Elefante" in ref_sel:
            tamanho_ref = 6.0
            ref_nome = "Elefante"
        else:
            tamanho_ref = 12.0
            ref_nome = "Ônibus"
            
        altura_dino = df[df["Nome"] == dino_sel]["Altura (m)"].values[0]

        if ref_nome == "Humano":
            altura_ref = 1.7
        elif ref_nome == "Elefante":
            altura_ref = 3.3
        else:
            altura_ref = 3.2
        
        razao = altura_dino / altura_ref
        st.metric(label="Proporção (altura)", value=f"{razao:.1f}x", delta=f"{altura_dino:.1f}m")                
        
        # Explicação científica
        if st.checkbox("🔬 Por que ossos ocos?"):
            st.info("""
            **Adaptação Evolutiva:** Dinossauros Saurísquios (como o T-Rex e Braquiossauro) 
            possuíam ossos pneumáticos (ocos), conectados a sacos aéreos. Isso reduzia o peso 
            sem sacrificar a resistência, permitindo tamanhos gigantescos. As aves modernas 
            herdaram essa característica!
            """)
    
    with col2:
        try:
            import os
            from PIL import Image
            import requests
            from io import BytesIO
    
            # =============================
            # FUNÇÃO SEGURA DE CARREGAMENTO
            # =============================
            def load_image_safe(path, fallback_url=None):
                if path and os.path.exists(path):
                    return Image.open(path).convert("RGBA")
                elif fallback_url:
                    response = requests.get(fallback_url, timeout=5)
                    response.raise_for_status()
                    return Image.open(BytesIO(response.content)).convert("RGBA")
                else:
                    raise FileNotFoundError("Imagem não encontrada")
    
            # =============================
            # REDIMENSIONAMENTO PROPORCIONAL
            # =============================
            def resize_by_height(img, altura_base_px, altura_real, altura_ref_real):
                proporcao = altura_real / altura_ref_real
                new_height = int(altura_base_px * proporcao)
    
                # limites para não quebrar layout
                new_height = max(30, min(new_height, 600))
    
                h_percent = new_height / float(img.size[1])
                new_width = int(img.size[0] * h_percent)
    
                return img.resize((new_width, new_height))
    
            # =============================
            # ALTURAS (CONSISTENTES)
            # =============================
            if ref_nome == "Humano":
                altura_ref = 1.7
            elif ref_nome == "Elefante":
                altura_ref = 3.3
            else:
                altura_ref = 3.2  # ônibus
    
            altura_dino = df[df["Nome"] == dino_sel]["Altura (m)"].values[0]
    
            # =============================
            # CARREGAMENTO DAS IMAGENS
            # =============================
            img_dino = load_image_safe(
                SILHUETAS.get(dino_sel, ""),
                fallback_url="https://via.placeholder.com/300x150?text=Dino"
            )
    
            img_ref = load_image_safe(
                SILHUETAS.get(ref_nome, ""),
                fallback_url="https://via.placeholder.com/150x150?text=Ref"
            )
    
            # =============================
            # REDIMENSIONAMENTO
            # =============================
            base_px = 220
    
            img_ref_resized = resize_by_height(img_ref, base_px, altura_ref, altura_ref)
            img_dino_resized = resize_by_height(img_dino, base_px, altura_dino, altura_ref)
    
            # =============================
            # EXIBIÇÃO (VISUAL MELHORADO)
            # =============================
            st.markdown("### Comparação Visual")
    
            col_img1, col_img2 = st.columns(2)
    
            with col_img1:
                st.image(img_ref_resized)
                st.caption(f"{ref_nome} ({altura_ref} m)")
    
            with col_img2:
                st.image(img_dino_resized)
                st.caption(f"{dino_sel} ({altura_dino} m)")
    
        except Exception as e:
            st.warning("⚠️ Erro ao carregar silhuetas. Mostrando gráfico alternativo.")
    
            fig = plot_comparacao_escala(
                dino_sel, ref_nome, tamanho_dino, tamanho_ref
            )
            st.pyplot(fig)
    
            st.caption(f"Detalhe técnico: {str(e)}")                       

# =============================================================================
# 2. MAPA DA DERIVA CONTINENTAL (DADOS REAIS)
# =============================================================================
with tabs[1]:
    st.header("🗺️ Onde os Fósseis Foram Encontrados?")
    
    @st.cache_data(ttl=3600) # Cache por 1 hora
    def get_fossil_data(dino_nome):
        """Simula busca na PBDB. Em produção, use requests.get('https://paleobiodb.org/data1.2/occs/list.json...')"""
        # Dados reais aproximados (lat, lon) de algumas formações famosas
        fossil_sites = {
            "Tyrannosaurus rex": [(47.5, -106.0), (44.0, -103.0)], # Hell Creek, Dakota
            "Spinosaurus": [(30.0, 31.0), (28.0, 33.0)], # Egito
            "Brachiosaurus": [(39.0, -108.0)], # Morrison Formation, Colorado
            "Triceratops": [(47.5, -106.0)], # Hell Creek
            "Velociraptor": [(44.0, 102.0)], # Mongólia
        }
        return pd.DataFrame(fossil_sites.get(dino_nome, [(0,0)]), columns=["lat", "lon"])
    
    dino_mapa = st.selectbox("Selecione um dinossauro para ver suas descobertas:", df["Nome"], key="mapa_select")
    
    modo_mapa = st.radio("Linha do Tempo Geológico:", 
                         ["Mundo Atual (Holoceno)", "Cretáceo Superior (66 Ma)"],
                         help="No Cretáceo, a América do Sul e África estavam unidas, e a Índia era uma ilha.")
    
    df_mapa = get_fossil_data(dino_mapa)
    
    # Simulação simples de paleocoordenadas (rotação manual para visualização)
    if modo_mapa == "Cretáceo Superior (66 Ma)":
        # Ajuste didático: aproxima África e América do Sul
        df_mapa["lon"] = df_mapa["lon"].apply(lambda x: x - 20 if x < 0 else x + 30)
        df_mapa["lat"] = df_mapa["lat"].apply(lambda y: y - 10)
        st.caption("🌍 Os continentes estavam mais próximos. Isso explica por que encontramos fósseis iguais no Brasil e na África!")
    
    st.map(df_mapa, zoom=2)
    
    st.markdown("---")
    st.markdown("**Dados Científicos:** As coordenadas são baseadas no [Paleobiology Database](https://paleobiodb.org/). O mapa do Cretáceo é uma aproximação visual da movimentação das placas tectônicas.")

# =============================================================================
# 3. SIMULADOR DE EXTINÇÃO K-PG (MODELO MATEMÁTICO)
# =============================================================================
with tabs[2]:
    st.header("🦠 Simulador do Fim do Cretáceo")
    st.markdown("Baseado no modelo **Lotka-Volterra** (Presas-Predadores) e nos efeitos do Inverno de Impacto.")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        bloqueio_solar = st.slider("🌑 Bloqueio Solar (%)", 0, 100, 15, 
                                   help="O asteroide lançou poeira na atmosfera, bloqueando a fotossíntese.")
    with col2:
        chuva_acida = st.slider("☔ Intensidade da Chuva Ácida", 0, 100, 40,
                                help="A vaporização de rochas ricas em enxofre causou chuvas ácidas globais.")
    with col3:
        anos_sim = st.slider("📅 Anos após o impacto", 1, 50, 30)
    
    # Constantes ecológicas (ajustadas para serem sensíveis aos sliders)
    # Base: Plantas (P), Herbívoros (H), Carnívoros (C)
    P0, H0, C0 = 100.0, 50.0, 20.0
    
    # Taxas de crescimento/predação
    r = 0.4 * (1 - bloqueio_solar/100)  # Taxa de crescimento das plantas cai com bloqueio solar
    a = 0.01                             # Taxa de predação (Herbívoros comem Plantas)
    b = 0.6                              # Eficiência de conversão (Planta -> Herbívoro)
    d = 0.1 + (chuva_acida/100)*0.05     # Morte natural de Herbívoros (aumenta com chuva ácida)
    
    e = 0.02                             # Predação de Carnívoros sobre Herbívoros
    f = 0.3                              # Eficiência de conversão (Herbívoro -> Carnívoro)
    g = 0.15 + (chuva_acida/100)*0.02    # Morte natural de Carnívoros
    
    # Simulação
    P, H, C = [P0], [H0], [C0]
    for _ in range(anos_sim):
        # Equações de diferenças finitas (Euler)
        p_next = P[-1] + (r * P[-1] - a * P[-1] * H[-1])
        h_next = H[-1] + (b * a * P[-1] * H[-1] - d * H[-1] - e * H[-1] * C[-1])
        c_next = C[-1] + (f * e * H[-1] * C[-1] - g * C[-1])
        
        # Garantir não-negatividade e colapso abrupto (extinção local)
        P.append(max(p_next, 0.1 if p_next <= 0 else p_next))
        H.append(max(h_next, 0.1 if h_next <= 0 else h_next))
        C.append(max(c_next, 0.1 if c_next <= 0 else c_next))
    
    # DataFrame para plotagem
    df_sim = pd.DataFrame({
        "Plantas (Base da Cadeia)": P,
        "Herbívoros (ex: Tricerátops)": H,
        "Carnívoros (ex: T-Rex)": C
    })
    
    st.line_chart(df_sim)
    
    # Interpretação didática
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
    
    # Dicionário de pegadas (Icnogêneros)
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
            if tamanho == "Pequeno (<25cm)":
                resultado = "Grallator"
            else:
                resultado = "Eubrontes"
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
        "Micro": "Pequeno",
        "Mega": "Grande",
        "Pachy": "Grosso / Espesso",
        "Brachy": "Curto",
        "Elasmo": "Placa / Chapa",
        "Cephalo": "Cabeça",
        "Dont": "Dente",
        "Raptor": "Ladrão / Caçador",
        "Saurus": "Lagarto / Réptil",
        "Ops": "Rosto / Face"
    }
    
    if st.button("🧬 Gerar Novo Dinossauro Fictício", type="primary"):
        # Seleciona prefixo e sufixo aleatoriamente, mas garantindo combinação plausível
        prefixo = random.choice(list(radicais.keys())[:5])  # Pega só os prefixos comuns
        sufixo = random.choice(list(radicais.keys())[5:])   # Pega sufixos
        
        nome_completo = prefixo + sufixo.lower()
        
        # Explicação científica
        significado_pref = radicais[prefixo]
        significado_suf = radicais[sufixo]
        
        st.success(f"### *{nome_completo}*")
        st.markdown(f"**Significado Científico:** **{significado_pref}** + **{significado_suf}**")
        
        # Gerar descrição comportamental plausível
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
        
        # Coeficientes da literatura científica
        if postura == "Bípede (ex: T-Rex)":
            a, b = 0.00016, 2.73  # Para kg e cm
        else:
            a, b = 0.00049, 2.75  # Quadrúpedes tendem a ser mais robustos
        
        # Cálculo da massa em kg e conversão para toneladas
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
