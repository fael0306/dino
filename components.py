# components.py
import streamlit as st
import pandas as pd
import random
from utils import (
    get_referencia, carregar_imagem, redimensionar_para_altura,
    plot_comparacao_escala, combinar_imagens_lado_a_lado
)
from data import obter_info_pegadas


def aba_escala_real(df):
    """Conteúdo da aba 'Escala Real'."""
    col1, col2 = st.columns([1, 2])

    with col1:
        st.header("📏 Compare a Escala")
        dino_sel = st.selectbox("Escolha um dinossauro:", df["Nome"])
        ref_sel = st.radio("Comparar com:", ["Humano (1.7m)", "Elefante Africano (3.3m)", "Ônibus Escolar (12m)"])

        ref_nome, comprimento_ref, altura_ref = get_referencia(ref_sel)
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
    """Conteúdo da aba 'Deriva Continental'."""
    st.header("🗺️ Onde os Fósseis Foram Encontrados?")

    dino_mapa = st.selectbox("Selecione um dinossauro para ver suas descobertas:",
                             df["Nome"], key="mapa_select")

    modo_mapa = st.radio("Linha do Tempo Geológico:",
                         ["Mundo Atual (Holoceno)", "Cretáceo Superior (66 Ma)"],
                         help="No Cretáceo, a América do Sul e África estavam unidas, e a Índia era uma ilha.")

    dados_mapa = obter_dados_fosseis(dino_mapa)

    if modo_mapa == "Cretáceo Superior (66 Ma)":
        dados_mapa["lon"] = dados_mapa["lon"].apply(lambda x: x - 20 if x < 0 else x + 30)
        dados_mapa["lat"] = dados_mapa["lat"].apply(lambda y: y - 10)
        st.caption("🌍 Os continentes estavam mais próximos. Isso explica por que encontramos fósseis iguais no Brasil e na África!")

    st.map(dados_mapa, zoom=2)
    st.markdown("---")
    st.markdown("**Dados Científicos:** As coordenadas são baseadas no [Paleobiology Database](https://paleobiodb.org/). O mapa do Cretáceo é uma aproximação visual da movimentação das placas tectônicas.")


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

    # Simulação
    P, H, C = [P0], [H0], [C0]
    for _ in range(anos_sim):
        p_prox = P[-1] + (r * P[-1] - a * P[-1] * H[-1])
        h_prox = H[-1] + (b * a * P[-1] * H[-1] - d * H[-1] - e * H[-1] * C[-1])
        c_prox = C[-1] + (f * e * H[-1] * C[-1] - g_val * C[-1])
        P.append(max(p_prox, 0.1))
        H.append(max(h_prox, 0.1))
        C.append(max(c_prox, 0.1))

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
        except Exception:
            st.warning("Imagem não disponível")
        st.markdown(f"""
        - **Dieta provável:** {pegadas_info[resultado]['dieta']}
        - **Tamanho típico:** {pegadas_info[resultado]['tamanho']}
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
        circ_femur_cm = st.number_input("📏 Circunferência do Fêmur (cm):", min_value=1.0, max_value=200.0, value=50.0, step=1.0)
        circ_femur_mm = circ_femur_cm * 10   # conversão para milímetros

        # Coeficientes de Campione & Evans (2012) – circunferência em mm
        if postura == "Bípede (ex: T-Rex)":
            a, b = 0.00016, 2.73
        else:
            a, b = 0.00049, 2.75

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

def classificar_pegada(dedos, garras, tamanho=None):
    """Retorna o icnogênero baseado nas respostas."""
    if dedos == 3 and garras == "Sim":
        return "Grallator" if tamanho == "Pequeno (<25cm)" else "Eubrontes"
    elif dedos == 4 and garras == "Sim":
        return "Anomoepus"
    else:
        return "Brontopodus"

def estimar_massa_corporal(postura, circ_femur_mm):
    """Retorna massa em kg usando Campione & Evans."""
    if postura == "Bípede (ex: T-Rex)":
        a, b = 0.00016, 2.73   # Nota: verificar coeficientes
    else:
        a, b = 0.00049, 2.75
    return a * (circ_femur_mm ** b)
