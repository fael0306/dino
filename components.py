# components.py
import streamlit as st
import pandas as pd
import random
import os
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from PIL import Image
from utils import (
    carregar_imagem, redimensionar_para_altura,
    plot_comparacao_escala, combinar_imagens_lado_a_lado
)
from data import obter_info_pegadas
import streamlit.components.v1 as components

def aba_escala_real(df):
    """Conteúdo da aba 'Escala Real'."""
    col1, col2 = st.columns([1, 2])

    with col1:
        st.header("📏 Compare a Escala")
        dino_sel = st.selectbox("Escolha um dinossauro:", df["Nome"])

        # Opções de referência apenas biológicas (Issue #17)
        opcoes_ref = [
            "Humano (1.7m)",
            "Elefante Africano (3.3m)",
            "Comparar com outro dinossauro..."
        ]
        ref_sel = st.radio("Comparar com:", opcoes_ref)

        # Determina os dados da referência
        if ref_sel == "Comparar com outro dinossauro...":
            outros_dinos = df[df["Nome"] != dino_sel]["Nome"].tolist()
            if not outros_dinos:
                st.warning("Não há outros dinossauros para comparar.")
                st.stop()
            outro_dino = st.selectbox("Selecione o dinossauro para comparação:", outros_dinos)
            ref_nome = outro_dino
            dados_ref = df[df["Nome"] == outro_dino].iloc[0]
            altura_ref = dados_ref["Altura (m)"]
            comprimento_ref = dados_ref["Comprimento (m)"]
        elif "Humano" in ref_sel:
            ref_nome = "Humano"
            altura_ref = 1.7
            comprimento_ref = 1.7
        elif "Elefante" in ref_sel:
            ref_nome = "Elefante"
            altura_ref = 3.3
            comprimento_ref = 6.0
        else:
            st.error("Referência inválida.")
            st.stop()

        if altura_ref <= 0:
            st.error("Altura de referência inválida.")
            st.stop()

        dados_dino = df[df["Nome"] == dino_sel].iloc[0]
        comprimento_dino = dados_dino["Comprimento (m)"]
        altura_dino = dados_dino["Altura (m)"]

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
            imagem_dino = carregar_imagem(dino_sel)
            imagem_ref = carregar_imagem(ref_nome)

            altura_maxima_px = 400
            if altura_dino >= altura_ref:
                altura_dino_px = altura_maxima_px
                altura_ref_px = int(altura_maxima_px * (altura_ref / altura_dino))
            else:
                altura_ref_px = altura_maxima_px
                altura_dino_px = int(altura_maxima_px * (altura_dino / altura_ref))

            img_dino_redim = redimensionar_para_altura(imagem_dino, altura_dino_px)
            img_ref_redim = redimensionar_para_altura(imagem_ref, altura_ref_px)

            # Combina as imagens lado a lado, alinhadas pela base
            img_comparacao = combinar_imagens_lado_a_lado(img_ref_redim, img_dino_redim)

            st.markdown("### Comparação Visual")
            st.image(img_comparacao, caption=f"{ref_nome} ({altura_ref}m)   |   {dino_sel} ({altura_dino}m)",
                     use_container_width=True)

            if altura_dino / altura_ref > 10:
                st.info("📐 **Nota:** Para diferenças extremas, a altura foi limitada para manter a visualização. A proporção ainda é fiel.")
        except Exception as e:
            st.warning("⚠️ Erro ao processar silhuetas. Mostrando gráfico alternativo.")
            fig = plot_comparacao_escala(dino_sel, ref_nome, comprimento_dino, comprimento_ref)
            st.pyplot(fig)
            st.caption(f"Detalhe técnico: {str(e)}")


@st.cache_data(ttl=3600)
def obter_dados_fosseis(dino_nome):
    """Retorna DataFrame com coordenadas de sítios fósseis."""
    sitios_fosseis = {
        "Tyrannosaurus rex": [(47.5, -106.0), (44.0, -103.0)],
        "Spinosaurus": [(30.0, 31.0), (28.0, 33.0)],
        "Brachiosaurus": [(39.0, -108.0)],
        "Triceratops": [(47.5, -106.0)],
        "Velociraptor": [(44.0, 102.0)],
    }
    return pd.DataFrame(sitios_fosseis.get(dino_nome, [(0, 0)]), columns=["lat", "lon"])

def aba_deriva_continental(df):
    """Conteúdo da aba 'Deriva Continental' com Globo Interativo."""
    st.header("🗺️ Globo Interativo da Terra Antiga")
    st.markdown(
        "Viaje no tempo geológico e veja como os continentes se movimentaram. "
        "O globo abaixo é fornecido pelo [Ancient Earth](https://dinosaurpictures.org/ancient-earth)."
    )

    # Seletor de era geológica
    era_opcoes = {
        "Mundo Atual (Holoceno, 0 Ma)": 0,
        "Cretáceo Superior (66 Ma)": 66,
        "Jurássico Superior (150 Ma)": 150,
        "Triássico Médio (240 Ma)": 240,
    }
    era_selecionada = st.radio(
        "Selecione a era geológica:",
        options=list(era_opcoes.keys()),
        index=1,  # padrão: Cretáceo Superior
        key="era_globo"
    )
    idade_ma = era_opcoes[era_selecionada]

    # URL do globo (parâmetro #idade)
    url_globo = f"https://dinosaurpictures.org/ancient-earth#{idade_ma}"

    # Exibe o iframe com key dinâmica para forçar recriação ao mudar a era
    st.iframe(
        url_globo,
        height=600,
        key=f"globo_era_{idade_ma}"   # ESSA É A CHAVE PARA ATUALIZAR
    )

    st.caption(
        "Se o globo não aparecer, clique no link abaixo para abri-lo em uma nova aba. "
        "Alguns navegadores bloqueiam a incorporação por questões de segurança."
    )
    st.markdown(f"[🔗 Abrir globo em nova aba]({url_globo})")

    st.markdown("---")
    st.subheader("📍 Localização dos Fósseis")

    # Seletor de dinossauro para visualizar os sítios fósseis
    dino_mapa = st.selectbox(
        "Selecione um dinossauro para ver onde seus fósseis foram encontrados:",
        df["Nome"],
        key="mapa_select_fosseis"
    )

    dados_mapa = obter_dados_fosseis(dino_mapa)

    # Opção de visualização: mapa 2D com pontos ou lista de coordenadas
    modo_visualizacao = st.radio(
        "Como deseja ver as localizações?",
        ["Mapa 2D (mundo atual)", "Lista de coordenadas"],
        horizontal=True
    )

    if modo_visualizacao == "Mapa 2D (mundo atual)":
        st.map(dados_mapa, zoom=2)
        st.caption("🌍 Mapa baseado no mundo moderno. As coordenadas indicam os sítios paleontológicos.")
    else:
        if not dados_mapa.empty:
            st.write("**Coordenadas (latitude, longitude):**")
            for _, linha in dados_mapa.iterrows():
                st.write(f"- {linha['lat']:.2f}, {linha['lon']:.2f}")
        else:
            st.info("Nenhuma coordenada registrada para este dinossauro.")
    
    st.markdown("---")
    st.markdown(
        "**Dados Científicos:** As coordenadas são baseadas no [Paleobiology Database](https://paleobiodb.org/). "
        "O globo do Ancient Earth é uma reconstrução das placas tectônicas pelo projeto [Paleomap](https://www.earthbyte.org/)."
    )

def aba_extincao_kpg():
    """Conteúdo da aba 'Extinção K-Pg'."""
    st.header("🦠 Simulador do Fim do Cretáceo")
    st.markdown("""
    Baseado no modelo **Lotka-Volterra** (Presas-Predadores) e nos efeitos do Inverno de Impacto.
    
    📘 **O que este modelo representa?**  
    Após o impacto do asteroide, a luz solar foi bloqueada, reduzindo a fotossíntese. Isso afetou toda a cadeia alimentar:
    *Plantas → Herbívoros → Carnívoros*. O modelo matemático mostra como essas populações mudam ao longo do tempo.
    """)

    col1, col2, col3 = st.columns(3)
    with col1:
        bloqueio_solar = st.slider("🌑 Bloqueio Solar (%)", 0, 100, 15,
                                   help="Quanto maior, menos luz chega às plantas, reduzindo sua taxa de crescimento (r).")
    with col2:
        chuva_acida = st.slider("☔ Intensidade da Chuva Ácida", 0, 100, 40,
                                help="Afeta a mortalidade dos herbívoros (d) e dos carnívoros (g).")
    with col3:
        anos_sim = st.slider("📅 Anos após o impacto", 1, 50, 30,
                             help="Duração da simulação.")

    # Equações do modelo
    st.markdown("---")
    st.markdown("### 🧮 Equações do Modelo (Lotka-Volterra)")
    st.latex(r"\begin{aligned}"
             r"\frac{dP}{dt} &= rP - aPH \\"
             r"\frac{dH}{dt} &= b a P H - d H - e H C \\"
             r"\frac{dC}{dt} &= f e H C - g C"
             r"\end{aligned}")
    st.caption("P = Plantas, H = Herbívoros, C = Carnívoros | Coeficientes explicados abaixo")

    # Explicação dos parâmetros
    with st.expander("🔍 O que significam essas letras?"):
        st.markdown(f"""
        | Símbolo | Significado ecológico | Valor na simulação |
        |---------|-----------------------|---------------------|
        | **P** | População de plantas (base da cadeia) | Inicia em 100 (unidades arbitrárias) |
        | **H** | Herbívoros (ex: Tricerátops) | Inicia em 50 |
        | **C** | Carnívoros (ex: T-Rex) | Inicia em 20 |
        | **r** | Taxa de crescimento das plantas | `0.4 × (1 - {bloqueio_solar}/100) = {0.4 * (1 - bloqueio_solar/100):.2f}` |
        | **a** | Taxa de consumo de plantas por herbívoro | Fixo: 0.01 |
        | **b** | Eficiência de conversão (plantas → novos herbívoros) | Fixo: 0.6 |
        | **d** | Mortalidade natural dos herbívoros | `0.1 + ({chuva_acida}/100)×0.05 = {0.1 + (chuva_acida/100)*0.05:.2f}` |
        | **e** | Taxa de predação (herbívoros comidos por carn.) | Fixo: 0.02 |
        | **f** | Eficiência de conversão (herbívoros → novos carn.) | Fixo: 0.3 |
        | **g** | Mortalidade natural dos carnívoros | `0.15 + ({chuva_acida}/100)×0.02 = {0.15 + (chuva_acida/100)*0.02:.2f}` |
        """)
        st.info("🌞 **O bloqueio solar reduz r** (crescimento das plantas).\n\n☔ **A chuva ácida aumenta d e g** (mortes de herbívoros e carnívoros).")

    # Inicialização dos parâmetros
    P0, H0, C0 = 100.0, 50.0, 20.0
    r = 0.4 * (1 - bloqueio_solar/100)
    a = 0.01
    b = 0.6
    d = 0.1 + (chuva_acida/100)*0.05
    e = 0.02
    f = 0.3
    g_val = 0.15 + (chuva_acida/100)*0.02   # renomeado para não conflitar com g da explicação

    # Simulação numérica (agora com esquema semi-implícito para estabilidade)
    dt = 1.0  # passo de 1 ano
    P, H, C = [P0], [H0], [C0]
    for _ in range(anos_sim):
        # Plantas: crescimento explícito, consumo implícito (evita negatividade)
        p_prox = P[-1] * (1 + r * dt) / (1 + a * H[-1] * dt)
        # Herbívoros: nascimento usando plantas atualizadas, mortes implícitas
        h_prox = H[-1] * (1 + b * a * p_prox * dt) / (1 + d * dt + e * C[-1] * dt)
        # Carnívoros: nascimento usando herbívoros atualizados, morte implícita
        c_prox = C[-1] * (1 + f * e * h_prox * dt) / (1 + g_val * dt)

        P.append(p_prox)
        H.append(h_prox)
        C.append(c_prox)

    dados_simulacao = pd.DataFrame({
        "Plantas (Base da Cadeia)": P,
        "Herbívoros (ex: Tricerátops)": H,
        "Carnívoros (ex: T-Rex)": C
    })
    st.markdown("---")
    st.markdown("### 📊 Resultado da Simulação")
    st.line_chart(dados_simulacao)

    # Interpretação automática
    if P[-1] < 1.0:
        st.error("🔥 **COLAPSO TOTAL:** A falta de luz causou a extinção das plantas. Sem comida, os herbívoros morreram, seguidos pelos grandes carnívoros. Apenas pequenos animais onívoros sobreviveram.")
    elif H[-1] < 5.0:
        st.warning("⚠️ **ECOSSISTEMA DEVASTADO:** Os grandes dinossauros não-avianos foram extintos. Mamíferos pequenos começam a ocupar os nichos vagos.")
    else:
        st.success("🌿 **ECOSSISTEMA ESTÁVEL:** O impacto não foi severo o suficiente para causar extinção em massa. (Mas lembre-se: na realidade, o bloqueio solar durou anos!)")


def aba_icnofosseis():
    """Conteúdo da aba 'Icnofósseis'."""
    st.header("👣 Paleo-Detetive: Identifique a Pegada")
    pegadas_info = obter_info_pegadas()

    col1, col2 = st.columns(2)
    with col1:
        dedos = st.radio("1. Quantos dedos tocam o chão?", [3, 4])
        garras = st.radio("2. Marcas de garras afiadas?", ["Sim", "Não"])
        tamanho = None  # inicializa
        if dedos == 3 and garras == "Sim":
            tamanho = st.radio("3. Tamanho da pegada?", ["Pequeno (<25cm)", "Grande (>25cm)"])
            resultado = "Grallator" if tamanho == "Pequeno (<25cm)" else "Eubrontes"
        elif dedos == 4 and garras == "Sim":
            resultado = "Anomoepus"
        else:
            resultado = "Brontopodus"

    with col2:
        st.subheader(f"🔍 Resultado: Icnogénero *{resultado}*")
        info_pegada = pegadas_info[resultado]
        # Tenta carregar imagem local
        caminho_imagem = os.path.join("assets", info_pegada["arquivo"])
        try:
            if os.path.exists(caminho_imagem):
                img = Image.open(caminho_imagem)
                st.image(img, caption=f"Fóssil de {resultado}", width=300)
            else:
                raise FileNotFoundError  # força fallback
        except Exception:
            # Fallback: desenha uma pegada genérica com matplotlib
            fig, ax = plt.subplots(figsize=(2, 2))
            ax.set_xlim(0, 10)
            ax.set_ylim(0, 10)
            ax.axis('off')
            if resultado == "Brontopodus":
                # Pegada arredondada de saurópode
                dedos_coords = [(3, 2), (4, 1), (6, 1), (7, 2), (6, 3), (5, 4), (4, 4), (3, 3)]
            elif resultado == "Anomoepus":
                # Quatro dedos, garras
                dedos_coords = [(2, 2), (3, 1), (5, 1.5), (7, 1), (8, 2), (7, 3), (6, 4), (4, 4), (3, 3)]
            else:
                # Grallator / Eubrontes (3 dedos)
                dedos_coords = [(3, 1), (4, 1), (5, 2), (5.5, 3), (5, 4), (4, 4), (3, 3), (2.5, 2)]
            poly = Polygon(dedos_coords, closed=True, facecolor='#6b5b4f', edgecolor='black', linewidth=1)
            ax.add_patch(poly)
            ax.text(5, 5, "?", fontsize=20, ha='center', va='center', color='white')
            st.pyplot(fig)
            st.caption("(Imagem ilustrativa – imagem real não encontrada em assets/)")
        st.markdown(f"""
        - **Dieta provável:** {info_pegada['dieta']}
        - **Tamanho típico:** {info_pegada['tamanho']}
        """)
        st.caption("Icnofósseis são vestígios de atividade biológica. Eles nos ajudam a entender o comportamento sem precisar de ossos!")


def aba_etimologia():
    """Conteúdo da aba 'Etimologia'."""
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


def aba_massa_corporal():
    """Conteúdo da aba 'Massa Corporal'."""
    st.header("⚖️ Estimativa de Massa Corporal por Circunferência Femoral")
    st.markdown("Baseado no estudo de **Campione & Evans (2012)** - *BMC Biology*.")

    col1, col2 = st.columns(2)
    with col1:
        postura = st.radio("Tipo de Locomoção do Dinossauro:", ["Bípede (ex: T-Rex)", "Quadrúpede (ex: Braquiossauro)"])
        circ_femur_cm = st.number_input(
            "📏 Circunferência do Fêmur (cm):",
            min_value=0.5,
            max_value=300.0,
            value=50.0,
            step=1.0,
            help="Insira um valor entre 2 e 90 cm para bípedes, ou entre 15 e 250 cm para quadrúpedes."
        )

        # Validação baseada em dados reais
        if postura == "Bípede (ex: T-Rex)":
            limite_min, limite_max = 2.0, 90.0
            a, b = 0.00016, 2.73
        else:  # Quadrúpede
            limite_min, limite_max = 15.0, 250.0
            a, b = 0.00049, 2.75

        if circ_femur_cm < limite_min or circ_femur_cm > limite_max:
            st.error(
                f"❌ **Valor fora do padrão realista para {postura.split('(')[0].strip()}.**\n"
                f"A circunferência femoral de dinossauros {postura.split('(')[0].strip().lower()}s "
                f"varia tipicamente entre **{limite_min:.0f} cm e {limite_max:.0f} cm**."
            )
            st.stop()

        circ_femur_mm = circ_femur_cm * 10   # conversão para milímetros
        massa_kg = a * (circ_femur_mm ** b)
        massa_ton = massa_kg / 1000
        st.metric(label="🐘 Massa Estimada", value=f"{massa_ton:.2f} toneladas", delta=f"{massa_kg:.0f} kg")

    with col2:
        st.markdown("""
        ### Como funciona?
        A circunferência do osso da coxa (fêmur) é o melhor indicador do peso que o animal suportava. 
        A equação é:
        """)
        st.latex(r"Massa = a \times (Circunferência_{mm})^{b}")
        st.markdown(f"""
        - **a = {a:.6f}**
        - **b = {b:.2f}**
        
        *Exemplo real:* O fêmur do *Tyrannosaurus rex* "Sue" (FMNH PR 2081) tem cerca de 58 cm de circunferência (580 mm).
        Isso resulta em aproximadamente **9.5 toneladas**.
        """)
        st.caption("Referência: Campione, N. E., & Evans, D. C. (2012). A universal scaling relationship between body mass and proximal limb bone dimensions in quadrupedal terrestrial tetrapods.")

    # 🔁 Comparação automática com animais reais (Issue #13)
    st.markdown("---")
    st.subheader("🔁 Equivalência de Massa")
    massa_elefante = 6.0      # toneladas (elefante africano médio)
    massa_trex = 8.4          # Tyrannosaurus rex médio
    massa_patagotitan = 70.0  # Patagotitan mayorum

    elefantes = massa_ton / massa_elefante
    trexes = massa_ton / massa_trex
    patagos = massa_ton / massa_patagotitan

    col3, col4, col5 = st.columns(3)
    col3.metric("🐘 Elefantes Africanos", f"{elefantes:.1f}", "6 ton cada")
    col4.metric("🦖 T-Rex", f"{trexes:.1f}", "8.4 ton cada")
    col5.metric("🦕 Patagotitan", f"{patagos:.1f}", "70 ton cada")

    st.caption("Comparação com animais reais para contextualizar a massa estimada.")
