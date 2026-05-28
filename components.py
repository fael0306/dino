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
    plot_comparacao_escala, combinar_imagens_lado_a_lado, criar_silhueta_placeholder
)
from data import obter_info_pegadas, obter_banco_dinossauros_reais, obter_coordenadas
import streamlit.components.v1 as components

def aba_escala_real(df):
    """Conteúdo da aba 'Escala Real'."""
    col1, col2 = st.columns([1, 2])

    with col1:
        st.header("📏 Compare a Escala")
        dino_sel = st.selectbox("Escolha um dinossauro:", df["Nome"])

        genero = dino_sel.split()[0]
        url_imagens = f"https://dinosaurpictures.org/{genero}-pictures"
        st.markdown(
            f'<a href="{url_imagens}" target="_blank" style="text-decoration:none; color:#1f77b4;">'
            f'🔍 Ver imagens no Dinosaur Pictures</a>',
            unsafe_allow_html=True
        )
        st.caption("(Link externo – abre em nova aba)")

        opcoes_ref = [
            "Humano (1.7m)",
            "Elefante Africano (3.3m)",
            "Comparar com outro dinossauro..."
        ]
        ref_sel = st.radio("Comparar com:", opcoes_ref)

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


def aba_deriva_continental(df=None):
    """Conteúdo da aba 'Deriva Continental' com Globo Interativo."""
    from data import obter_banco_dinossauros_reais, obter_coordenadas

    st.header("🗺️ Globo Interativo da Terra Antiga")
    st.markdown(
        "Viaje no tempo geológico e veja como os continentes se movimentaram. "
        "O globo abaixo é fornecido pelo [Ancient Earth](https://dinosaurpictures.org/ancient-earth)."
    )

    era_opcoes = {
        "Mundo Atual (Holoceno, 0 Ma)": 0,
        "Cretáceo Superior (66 Ma)": 66,
        "Jurássico Superior (150 Ma)": 150,
        "Triássico Médio (240 Ma)": 240,
    }
    era_selecionada = st.radio(
        "Selecione a era geológica:",
        options=list(era_opcoes.keys()),
        index=1,
        key="era_globo"
    )
    idade_ma = era_opcoes[era_selecionada]
    url_globo = f"https://dinosaurpictures.org/ancient-earth?_t={idade_ma}#{idade_ma}"

    iframe_html = (
        f'<iframe src="{url_globo}" '
        f'width="100%" height="600" '
        f'style="border:none;" '
        f'allowfullscreen '
        f'loading="lazy">'
        f'</iframe>'
    )
    st.markdown(iframe_html, unsafe_allow_html=True)

    st.caption(
        "Se o globo não aparecer, clique no link abaixo para abri-lo em uma nova aba. "
        "Alguns navegadores bloqueiam a incorporação por questões de segurança."
    )
    st.markdown(f"[🔗 Abrir globo em nova aba]({url_globo})")

    st.markdown("---")
    st.subheader("📍 Localização dos Fósseis")

    dinos_reais = obter_banco_dinossauros_reais()
    nomes_dinos = [dino["Nome"] for dino in dinos_reais]

    dino_mapa = st.selectbox(
        "Selecione um dinossauro para ver onde seus fósseis foram encontrados:",
        nomes_dinos,
        key="mapa_select_fosseis"
    )

    dados_mapa = pd.DataFrame(obter_coordenadas(dino_mapa), columns=["lat", "lon"])

    modo_visualizacao = st.radio(
        "Como deseja ver as localizações?",
        ["Mapa 2D (mundo atual)", "Lista de coordenadas"],
        horizontal=True
    )

    if modo_visualizacao == "Mapa 2D (mundo atual)":
        st.map(dados_mapa, zoom=2)
        st.caption("🌍 Mapa baseado no mundo moderno. As coordenadas indicam os sítios paleontológicos.")
    else:
        if not dados_mapa.empty and not (dados_mapa["lat"] == 0).all():
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
    """Conteúdo da aba 'Extinção K-Pg' com simulação melhorada (Runge-Kutta 4)."""
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

    st.markdown("---")
    st.markdown("### 🧮 Equações do Modelo (Lotka-Volterra)")
    st.latex(r"\begin{aligned}"
             r"\frac{dP}{dt} &= rP - aPH \\"
             r"\frac{dH}{dt} &= b a P H - d H - e H C \\"
             r"\frac{dC}{dt} &= f e H C - g C"
             r"\end{aligned}")
    st.caption("P = Plantas, H = Herbívoros, C = Carnívoros | Coeficientes explicados abaixo")

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

    # Parâmetros
    P0, H0, C0 = 100.0, 50.0, 20.0
    r = 0.4 * (1 - bloqueio_solar/100)
    a = 0.01
    b = 0.6
    d = 0.1 + (chuva_acida/100)*0.05
    e = 0.02
    f = 0.3
    g_val = 0.15 + (chuva_acida/100)*0.02

    # Função do sistema Lotka-Volterra
    def lotka_volterra(state, t=None):
        P, H, C = state
        dP = r*P - a*P*H
        dH = b*a*P*H - d*H - e*H*C
        dC = f*e*H*C - g_val*C
        return dP, dH, dC

    # Integração por Runge-Kutta 4 com passo dt=0.5 (anos)
    dt = 0.5
    n_steps = int(anos_sim / dt)
    P, H, C = [P0], [H0], [C0]
    state = [P0, H0, C0]
    for _ in range(n_steps):
        # RK4
        k1 = lotka_volterra(state)
        k2 = lotka_volterra([state[0] + dt/2*k1[0], state[1] + dt/2*k1[1], state[2] + dt/2*k1[2]])
        k3 = lotka_volterra([state[0] + dt/2*k2[0], state[1] + dt/2*k2[1], state[2] + dt/2*k2[2]])
        k4 = lotka_volterra([state[0] + dt*k3[0], state[1] + dt*k3[1], state[2] + dt*k3[2]])
        state[0] += dt/6 * (k1[0] + 2*k2[0] + 2*k3[0] + k4[0])
        state[1] += dt/6 * (k1[1] + 2*k2[1] + 2*k3[1] + k4[1])
        state[2] += dt/6 * (k1[2] + 2*k2[2] + 2*k3[2] + k4[2])
        # Garantir que populações não fiquem negativas
        state[0] = max(0.0, state[0])
        state[1] = max(0.0, state[1])
        state[2] = max(0.0, state[2])
        P.append(state[0])
        H.append(state[1])
        C.append(state[2])

    dados_simulacao = pd.DataFrame({
        "Plantas (Base da Cadeia)": P,
        "Herbívoros (ex: Tricerátops)": H,
        "Carnívoros (ex: T-Rex)": C
    })
    st.markdown("---")
    st.markdown("### 📊 Resultado da Simulação")
    st.line_chart(dados_simulacao)

    if P[-1] < 1.0:
        st.error("🔥 **COLAPSO TOTAL:** A falta de luz causou a extinção das plantas. Sem comida, os herbívoros morreram, seguidos pelos grandes carnívoros. Apenas pequenos animais onívoros sobreviveram.")
    elif H[-1] < 5.0:
        st.warning("⚠️ **ECOSSISTEMA DEVASTADO:** Os grandes dinossauros não-avianos foram extintos. Mamíferos pequenos começam a ocupar os nichos vagos.")
    else:
        st.success("🌿 **ECOSSISTEMA ESTÁVEL:** O impacto não foi severo o suficiente para causar extinção em massa. (Mas lembre-se: na realidade, o bloqueio solar durou anos!)")


def identificar_icnogenus(dedos, garras, tamanho, forma=None, proporcao=None):
    """
    Lógica de decisão para identificar o icnogênero a partir das respostas.
    Retorna o nome do icnogênero ou None.
    """
    if dedos == 3:
        if garras:
            if tamanho == "pequeno":
                return "Grallator"
            else:
                if forma == "alongada":
                    return "Eubrontes"
                else:
                    return "Megalosauripus"
        else:
            if tamanho == "pequeno":
                return "Wintonopus"
            else:
                return "Amblydactylus"
    else:  # 4 dedos
        if garras:
            return "Anomoepus"
        else:
            if proporcao == "larga":
                return "Brontopodus"
            else:
                return "Parabrontopodus"


def aba_icnofosseis():
    """Jogo Paleo‑Detetive: identifique o icnofóssil."""
    st.header("👣 Paleo-Detetive: Identifique a Pegada")
    st.markdown("""
    **Como jogar:**  
    Você verá a imagem de um icnofóssil (pegada fossilizada).  
    Responda às perguntas sobre suas características e depois clique em **"Identificar"**.  
    O sistema dirá que icnogênero você descreveu e comparará com o fóssil mostrado.  
    *Dica: observe bem a imagem e leia as explicações em cada pergunta!*  
    """)

    pegadas_info = obter_info_pegadas()

    # Inicializar estado da sessão para o jogo
    if "jogo_icno" not in st.session_state:
        st.session_state.jogo_icno = {
            "desafio": None,
            "respostas": {},
            "resultado": None
        }

    # Botão para sortear um novo desafio
    if st.button("🎲 Novo Desafio", type="primary", use_container_width=True):
        st.session_state.jogo_icno["desafio"] = random.choice(list(pegadas_info.keys()))
        st.session_state.jogo_icno["respostas"] = {}
        st.session_state.jogo_icno["resultado"] = None

    desafio_atual = st.session_state.jogo_icno["desafio"]

    if desafio_atual is None:
        st.info("Clique em **Novo Desafio** para começar.")
        return

    # Exibir a imagem do desafio
    info_desafio = pegadas_info[desafio_atual]
    caminho_imagem = os.path.join("assets", info_desafio["arquivo"])
    try:
        if os.path.exists(caminho_imagem):
            img = Image.open(caminho_imagem)
            st.image(img, caption=f"Fóssil misterioso (não vale espiar o nome!)", width=300)
        else:
            raise FileNotFoundError
    except Exception:
        # Fallback com silhueta
        fig, ax = plt.subplots(figsize=(2, 2))
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 10)
        ax.axis('off')
        # Desenhar uma forma genérica (pode ser customizada depois)
        poly = Polygon([(3,2),(7,2),(8,5),(6,8),(4,8),(2,5)], closed=True,
                       facecolor='#6b5b4f', edgecolor='black', linewidth=1.5)
        ax.add_patch(poly)
        ax.text(5, 5, "?", fontsize=20, ha='center', va='center', color='white')
        st.pyplot(fig)
        st.caption("(Imagem ilustrativa – imagem real não encontrada)")

    st.markdown("---")
    st.subheader("Perguntas (analise o fóssil e responda)")

    # Pergunta 1: dedos
    dedos = st.radio(
        "1. Quantos dedos tocam o chão?",
        [3, 4],
        format_func=lambda x: f"{x} dedos",
        key="dedos",
        help="Conte as marcas dos dedos na pegada. Geralmente 3 ou 4."
    )

    # Pergunta 2: garras
    garras_str = st.radio(
        "2. Há marcas de garras afiadas?",
        ["Sim", "Não"],
        key="garras",
        help="Garras aparecem como pontas agudas na frente dos dedos."
    )
    garras = garras_str == "Sim"

    tamanho = None
    forma = None
    proporcao = None

    # Perguntas condicionais
    if dedos == 3:
        tamanho_str = st.radio(
            "3. Tamanho da pegada:",
            ["Pequeno (<25cm)", "Grande (>25cm)"],
            key="tamanho3",
            help="Compare com uma mão adulta (aprox. 20 cm)."
        )
        tamanho = "pequeno" if "Pequeno" in tamanho_str else "grande"

        if garras:
            if tamanho == "grande":
                forma_str = st.radio(
                    "4. Formato da pegada:",
                    ["Alongada e estreita (comprimento > 1,5 × largura)",
                     "Larga e robusta (largura ≥ 0,8 × comprimento)"],
                    key="forma_garras_grande",
                    help="Observe a proporção entre comprimento e largura."
                )
                forma = "alongada" if "Alongada" in forma_str else "larga"
        # Para pequeno com garras ou sem garras não precisa de mais perguntas
    else:  # 4 dedos
        if not garras:
            proporcao_str = st.radio(
                "3. Largura em relação ao comprimento:",
                ["Mais larga que comprida (largura > comprimento)",
                 "Mais comprida que larga (comprimento > largura)"],
                key="proporcao_4",
                help="Veja se a pegada é mais arredondada (larga) ou alongada."
            )
            proporcao = "larga" if "larga" in proporcao_str else "alongada"
        # Com garras e 4 dedos já define (Anomoepus)

    # Botão de identificação
    if st.button("🔍 Identificar", type="primary", use_container_width=True):
        resultado_identificado = identificar_icnogenus(
            dedos, garras, tamanho, forma, proporcao
        )

        if resultado_identificado is None:
            st.error("Não foi possível determinar o icnogênero. Verifique suas respostas.")
        else:
            st.session_state.jogo_icno["resultado"] = resultado_identificado

            # Mostrar o resultado
            if resultado_identificado == desafio_atual:
                st.success(f"✅ **Parabéns!** Você acertou! O fóssil é realmente *{desafio_atual}*.")
                st.balloons()
            else:
                st.error(f"❌ **Ops!** Você descreveu um *{resultado_identificado}*, mas o fóssil mostrado é *{desafio_atual}*.")

            # Explicação educativa
            info_res = pegadas_info[resultado_identificado]
            st.markdown(f"""
            ### Sobre o *{resultado_identificado}* (o que você descreveu)
            - **Dieta provável:** {info_res['dieta']}
            - **Tamanho típico:** {info_res['tamanho']}
            """)

            info_desafio = pegadas_info[desafio_atual]
            st.markdown(f"""
            ### Sobre o fóssil exibido (*{desafio_atual}*)
            - **Dieta provável:** {info_desafio['dieta']}
            - **Tamanho típico:** {info_desafio['tamanho']}
            """)

            st.caption("Icnofósseis são vestígios de atividade biológica. Eles nos ajudam a entender o comportamento sem precisar de ossos!")
    else:
        # Se ainda não identificou, mostra dica
        st.info("Responda todas as perguntas e clique em **Identificar** para ver o resultado.")


def aba_fosseis_reais():
    """Conteúdo da aba 'Fósseis Reais' – apenas dinossauros reais com imagens de fósseis."""
    st.header("🦴 Museu de Fósseis Reais")
    st.markdown(
        "Os fósseis são a principal evidência da existência dos dinossauros. "
        "Cada descoberta ajuda a reconstruir a história da vida na Terra. "
        "Clique no botão abaixo para explorar uma espécie real, ver seu fóssil e descobrir curiosidades."
    )

    dados_reais = obter_banco_dinossauros_reais()

    if st.button("🎲 Sortear Dinossauro Real", type="primary", use_container_width=True):
        dino = random.choice(dados_reais)

        st.success(f"### *{dino['Nome']}*")

        # Carrega a imagem usando a função cacheada
        img = carregar_imagem(dino["Nome"])
        st.image(img, caption=f"Fóssil de {dino['Nome']}", use_container_width=True)

        col1, col2 = st.columns(2)
        with col1:
            st.markdown(f"**Período:** {dino['Período']}")
            st.markdown(f"**Dieta:** {dino['Dieta']}")
        with col2:
            st.markdown(f"**Comprimento:** {dino['Comprimento']:.1f} m")
            st.markdown(f"**Peso:** {dino['Peso']:.1f} toneladas")

        st.markdown("---")
        st.markdown(f"📘 **Curiosidade:** {dino['Curiosidade']}")


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

        if postura == "Bípede (ex: T-Rex)":
            limite_min, limite_max = 2.0, 90.0
            a, b = 0.00016, 2.73
        else:
            limite_min, limite_max = 15.0, 250.0
            a, b = 0.00049, 2.75

        if circ_femur_cm < limite_min or circ_femur_cm > limite_max:
            st.error(
                f"❌ **Valor fora do padrão realista para {postura.split('(')[0].strip()}.**\n"
                f"A circunferência femoral de dinossauros {postura.split('(')[0].strip().lower()}s "
                f"varia tipicamente entre **{limite_min:.0f} cm e {limite_max:.0f} cm**."
            )
            st.stop()

        circ_femur_mm = circ_femur_cm * 10
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

    st.markdown("---")
    st.subheader("🔁 Equivalência de Massa")
    massa_elefante = 6.0
    massa_trex = 8.4
    massa_patagotitan = 70.0

    elefantes = massa_ton / massa_elefante
    trexes = massa_ton / massa_trex
    patagos = massa_ton / massa_patagotitan

    col3, col4, col5 = st.columns(3)
    col3.metric("🐘 Elefantes Africanos", f"{elefantes:.1f}", "6 ton cada")
    col4.metric("🦖 T-Rex", f"{trexes:.1f}", "8.4 ton cada")
    col5.metric("🦕 Patagotitan", f"{patagos:.1f}", "70 ton cada")

    st.caption("Comparação com animais reais para contextualizar a massa estimada.")


def aba_quiz():
    """Conteúdo da aba Quiz."""
    from data import obter_quiz_perguntas

    st.header("📝 Quiz Paleontológico")
    st.markdown("Teste seus conhecimentos sobre dinossauros! Escolha a dificuldade e responda a 20 perguntas.")

    if "quiz" not in st.session_state:
        st.session_state.quiz = {
            "dificuldade": None,
            "indice_pergunta": 0,
            "pontuacao": 0,
            "perguntas": [],
            "respostas_usuario": [],
            "concluido": False
        }

    quiz = st.session_state.quiz

    # Escolha de dificuldade
    if quiz["dificuldade"] is None:
        dificuldade = st.radio("Escolha o nível de dificuldade:", ["Fácil", "Médio", "Difícil"], horizontal=True)
        if st.button("Iniciar Quiz", type="primary"):
            dados = obter_quiz_perguntas()
            quiz["dificuldade"] = dificuldade
            quiz["perguntas"] = dados[dificuldade]
            quiz["indice_pergunta"] = 0
            quiz["pontuacao"] = 0
            quiz["respostas_usuario"] = [None] * len(dados[dificuldade])
            quiz["concluido"] = False
            st.rerun()
    elif not quiz["concluido"]:
        # Exibição da pergunta atual
        idx = quiz["indice_pergunta"]
        total = len(quiz["perguntas"])
        pergunta_atual = quiz["perguntas"][idx]

        st.subheader(f"Pergunta {idx+1} de {total} (Dificuldade: {quiz['dificuldade']})")
        progresso = (idx) / total
        st.progress(progresso)

        st.markdown(f"**{pergunta_atual['pergunta']}**")
        opcoes = pergunta_atual["opcoes"]
        resposta_anterior = quiz["respostas_usuario"][idx]

        if resposta_anterior is None:
            escolha = st.radio("Selecione uma alternativa:", range(len(opcoes)),
                               format_func=lambda i: opcoes[i], key=f"q{idx}")
            if st.button("Confirmar resposta", key=f"conf{idx}"):
                quiz["respostas_usuario"][idx] = escolha
                if escolha == pergunta_atual["resposta"]:
                    quiz["pontuacao"] += 1
                if idx + 1 < total:
                    quiz["indice_pergunta"] += 1
                else:
                    quiz["concluido"] = True
                st.rerun()
        else:
            st.info(f"Você respondeu: **{opcoes[resposta_anterior]}**")
            if idx + 1 < total:
                if st.button("Próxima pergunta", type="primary"):
                    quiz["indice_pergunta"] += 1
                    st.rerun()
            else:
                if st.button("Ver resultado", type="primary"):
                    quiz["concluido"] = True
                    st.rerun()

    if quiz["concluido"]:
        st.balloons()
        st.success(f"### Quiz concluído! Nível: {quiz['dificuldade']}")
        pontuacao = quiz["pontuacao"]
        total = len(quiz["perguntas"])
        porcentagem = int(pontuacao / total * 100)
        st.metric("Pontuação", f"{pontuacao}/{total}", f"{porcentagem}%")
        if porcentagem == 100:
            st.markdown("🏆 **Perfeito! Você é um verdadeiro paleontólogo!**")
        elif porcentagem >= 70:
            st.markdown("👍 **Muito bom! Continue estudando!**")
        elif porcentagem >= 50:
            st.markdown("📘 **Você tem um bom conhecimento básico.**")
        else:
            st.markdown("📚 **Que tal revisitar as outras abas do PaleoLab para aprender mais?**")

        if st.button("Refazer Quiz", type="primary"):
            for key in ["dificuldade", "indice_pergunta", "pontuacao", "perguntas", "respostas_usuario", "concluido"]:
                st.session_state.quiz[key] = None
            st.rerun()

# ============================================================
# Enhancement 1: Linha do tempo geológica interativa
# ============================================================
def aba_linha_tempo():
    from data import obter_banco_dinossauros_reais
    import matplotlib.pyplot as plt

    st.header("⏳ Linha do Tempo Geológica Interativa")
    st.markdown("Navegue pelos períodos da Era Mesozoica, quando os dinossauros dominaram a Terra.")

    # Apenas períodos com dinossauros no banco de dados
    periodos = [
        {"nome": "Triássico", "inicio": 252, "fim": 201, "cor": "#F44336", "eventos": ["Surgimento dos dinossauros", "Primeiros mamíferos", "Início do Mesozóico"]},
        {"nome": "Jurássico", "inicio": 201, "fim": 145, "cor": "#E91E63", "eventos": ["Dinossauros dominam a Terra", "Surgimento das aves (Archaeopteryx)", "Primeiros pterossauros gigantes"]},
        {"nome": "Cretáceo", "inicio": 145, "fim": 66, "cor": "#9C27B0", "eventos": ["Primeiras plantas com flores", "Extinção K-Pg (dinossauros não-avianos)", "Auge dos répteis marinhos"]},
    ]

    # Slider ajustado para o intervalo dos períodos
    ano_min = 252
    ano_max = 66
    ano_selecionado = st.slider(
        "Selecione uma idade (milhões de anos atrás):",
        min_value=ano_max, max_value=ano_min, value=66,
        format="%d Ma"
    )

    # Encontrar período atual
    periodo_atual = None
    for p in periodos:
        if p["inicio"] >= ano_selecionado >= p["fim"]:
            periodo_atual = p
            break

    if periodo_atual:
        st.subheader(f"📍 Período: {periodo_atual['nome']} ({periodo_atual['inicio']} - {periodo_atual['fim']} Ma)")
        st.markdown(f"**Eventos importantes:**")
        for ev in periodo_atual["eventos"]:
            st.write(f"• {ev}")

    # Gráfico da linha do tempo (apenas Mesozoico)
    fig, ax = plt.subplots(figsize=(12, 3))
    y = 1
    for p in periodos:
        largura = p["inicio"] - p["fim"]
        ax.barh(y, largura, left=p["fim"], color=p["cor"], edgecolor='black', height=0.6)
        meio = p["fim"] + largura/2
        if largura > 10:
            ax.text(meio, y, p["nome"], ha='center', va='center', fontsize=9, color='white', weight='bold')

    ax.set_xlim(ano_max, ano_min)
    ax.set_ylim(0.5, 1.5)
    ax.axvline(x=ano_selecionado, color='red', linestyle='--', linewidth=2, label='Idade selecionada')
    ax.set_xlabel('Milhões de anos atrás (Ma)')
    ax.set_yticks([])
    ax.set_title('Era Mesozoica - Períodos com Dinossauros')
    ax.legend()
    st.pyplot(fig)

    # --- DINOSSAUROS DO PERÍODO ---
    if periodo_atual:
        todos_dinos = obter_banco_dinossauros_reais()
        # Filtra dinossauros cujo período contém o nome do período atual
        dinos_periodo = [d for d in todos_dinos if periodo_atual["nome"] in d["Período"]]

        st.subheader(f"🦕 Dinossauros do {periodo_atual['nome']} ({len(dinos_periodo)} espécies)")

        if dinos_periodo:
            nomes = [d["Nome"] for d in dinos_periodo]
            # Exibe em 3 colunas
            col1, col2, col3 = st.columns(3)
            for i, nome in enumerate(nomes):
                if i % 3 == 0:
                    col1.write(f"- {nome}")
                elif i % 3 == 1:
                    col2.write(f"- {nome}")
                else:
                    col3.write(f"- {nome}")
        else:
            st.info("Nenhum dinossauro registrado para este período no banco de dados.")


# ============================================================
# Enhancement 4: Simulação climática do Mesozóico
# ============================================================
def aba_clima_mesozoico():
    st.header("🌍 Simulação Climática do Mesozóico")
    st.markdown("Explore as condições de temperatura, CO₂ e vegetação durante a Era dos Dinossauros.")

    periodo = st.radio("Selecione o período:", ["Triássico (252-201 Ma)", "Jurássico (201-145 Ma)", "Cretáceo (145-66 Ma)"], horizontal=True)

    dados_clima = {
        "Triássico (252-201 Ma)": {
            "temperatura_media": 20,
            "co2_ppm": 2000,
            "vegetacao": "Gimnospermas (coníferas, cicadáceas), primeiras plantas com flores no final",
            "nivel_mar": "Baixo (Pangeia unificada)",
            "descricao": "Clima quente e seco, com desertos extensos. Concentração de CO₂ muito alta."
        },
        "Jurássico (201-145 Ma)": {
            "temperatura_media": 22,
            "co2_ppm": 1500,
            "vegetacao": "Florestas de coníferas, cicadáceas, ginkgos. Primeiras angiospermas no final.",
            "nivel_mar": "Moderado, com início da abertura do Atlântico",
            "descricao": "Clima quente e úmido, com estações definidas e aumento das florestas."
        },
        "Cretáceo (145-66 Ma)": {
            "temperatura_media": 26,
            "co2_ppm": 1000,
            "vegetacao": "Angiospermas (plantas com flores) tornam-se dominantes",
            "nivel_mar": "Alto (mar epicontinental inundando continentes)",
            "descricao": "Clima quente e úmido, sem calotas polares. Grande diversificação de plantas e dinossauros."
        }
    }

    info = dados_clima[periodo]

    col1, col2 = st.columns(2)
    with col1:
        st.metric("🌡️ Temperatura média global", f"{info['temperatura_media']} °C", delta="+{:.1f}°C".format(info['temperatura_media']-14) if info['temperatura_media'] > 14 else None)
        st.metric("🫧 CO₂ atmosférico", f"{info['co2_ppm']} ppm", delta=f"{info['co2_ppm'] - 420} ppm vs atual")
    with col2:
        st.metric("🌊 Nível do mar", info['nivel_mar'])
        st.metric("🌿 Vegetação dominante", info['vegetacao'].split()[0], delta="", help=info['vegetacao'])

    st.markdown("---")
    st.subheader("📈 Comparação com o clima atual")
    comparacao = pd.DataFrame({
        "Parâmetro": ["Temperatura (°C)", "CO₂ (ppm)"],
        "Período selecionado": [info['temperatura_media'], info['co2_ppm']],
        "Atual (2025)": [14.8, 420]
    })
    st.dataframe(comparacao, hide_index=True, use_container_width=True)

    st.markdown("---")
    st.info(f"**{info['descricao']}**")
    st.caption("Dados baseados em reconstruções paleoclimáticas (IPCC, 2021; Scotese, 2021).")


# ============================================================
# Enhancement 5: Sistema de conquistas e progressão
# ============================================================
def verificar_conquistas():
    """Verifica e atualiza conquistas baseado nas ações do usuário."""
    conquistas = st.session_state.conquistas

    if not conquistas["quiz_facil"] and st.session_state.get("quiz_facil_completo", False):
        conquistas["quiz_facil"] = True
        st.toast("🏅 Conquista desbloqueada: Mestre do Quiz Fácil!", icon="🏆")

    if not conquistas["quiz_medio"] and st.session_state.get("quiz_medio_completo", False):
        conquistas["quiz_medio"] = True
        st.toast("🏅 Conquista desbloqueada: Paleontólogo Nível Médio!", icon="🏆")

    if not conquistas["quiz_dificil"] and st.session_state.get("quiz_dificil_completo", False):
        conquistas["quiz_dificil"] = True
        st.toast("🏅 Conquista desbloqueada: Doutor em Paleontologia!", icon="🏆")

    if not conquistas["explorador_escala"] and st.session_state.get("escala_utilizada", False):
        conquistas["explorador_escala"] = True
        st.toast("🏅 Conquista desbloqueada: Explorador de Escalas!", icon="📏")

    # Atualiza sessão
    st.session_state.conquistas = conquistas

def aba_conquistas():
    st.header("🏆 Suas Conquistas")
    verificar_conquistas()
    conquistas = st.session_state.conquistas

    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Quiz")
        st.checkbox("Mestre do Quiz Fácil (20/20)", value=conquistas["quiz_facil"], disabled=True)
        st.checkbox("Paleontólogo Nível Médio", value=conquistas["quiz_medio"], disabled=True)
        st.checkbox("Doutor em Paleontologia", value=conquistas["quiz_dificil"], disabled=True)

    with col2:
        st.subheader("Exploração")
        st.checkbox("Explorador de Escalas", value=conquistas["explorador_escala"], disabled=True)
        st.checkbox("Detetive de Icnofósseis", value=conquistas.get("detetive_icno", False), disabled=True)
        st.checkbox("Climaturista", value=conquistas.get("climaturista", False), disabled=True)

    # Barra de progresso
    total = len(conquistas)
    conquistadas = sum(conquistas.values())
    st.progress(conquistadas/total, text=f"Progresso total: {conquistadas}/{total}")
    st.caption("Desbloqueie conquistas usando as diferentes funcionalidades do PaleoLab!")


# ============================================================
# Enhancement 7: Exportação de relatórios científicos em PDF
# ============================================================
def aba_exportar_relatorio():
    st.header("📄 Exportar Relatório Científico (PDF)")
    st.markdown("Gere um relatório com suas análises e simulações realizadas nesta sessão.")

    if st.button("Gerar Relatório PDF", type="primary", use_container_width=True):
        try:
            from fpdf import FPDF
        except ImportError:
            st.error("Biblioteca FPDF não instalada. Execute: pip install fpdf")
            return

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=16, style='B')
        pdf.cell(200, 10, txt="PaleoLab Científico - Relatório de Atividades", ln=1, align='C')
        pdf.ln(10)

        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Data: {pd.Timestamp.now().strftime('%d/%m/%Y %H:%M')}", ln=1)

        # Simulações realizadas (exemplo)
        if "ultima_simulacao_kpg" in st.session_state:
            pdf.ln(5)
            pdf.set_font("Arial", style='B', size=12)
            pdf.cell(200, 10, txt="Simulação de Extinção K-Pg", ln=1)
            pdf.set_font("Arial", size=10)
            sim = st.session_state.ultima_simulacao_kpg
            pdf.cell(200, 6, txt=f"Bloqueio solar: {sim['bloqueio']}%", ln=1)
            pdf.cell(200, 6, txt=f"Chuva ácida: {sim['chuva']}%", ln=1)
            pdf.cell(200, 6, txt=f"Plantas finais: {sim['plantas_final']:.1f}", ln=1)

        # Conquistas
        pdf.ln(5)
        pdf.set_font("Arial", style='B', size=12)
        pdf.cell(200, 10, txt="Conquistas Desbloqueadas", ln=1)
        pdf.set_font("Arial", size=10)
        for nome, desbloq in st.session_state.conquistas.items():
            if desbloq:
                pdf.cell(200, 6, txt=f"✔ {nome.replace('_', ' ').title()}", ln=1)

        # Salvar
        pdf.output("relatorio_paleolab.pdf")
        with open("relatorio_paleolab.pdf", "rb") as f:
            st.download_button("📥 Baixar PDF", data=f, file_name="relatorio_paleolab.pdf", mime="application/pdf")

        st.success("Relatório gerado com sucesso!")
        st.balloons()


# ============================================================
# Enhancement 8: Banco expandido (já adicionado em data.py)
# Exibição na aba Fósseis Reais pode ser estendida, mas manteremos
# a função existente. Para mostrar os novos grupos, adicionamos:
# ============================================================
# (opcional: modificar aba_fosseis_reais para incluir filtros)
# Por simplicidade, mantemos como está, mas os dados estão disponíveis.

# ============================================================
# Enhancement 10: Árvore evolutiva interativa
# ============================================================
def aba_arvore_evolutiva():
    st.header("🌳 Árvore Evolutiva Interativa")
    st.markdown("Explore as relações filogenéticas entre os principais grupos de dinossauros e outros répteis.")

    try:
        import networkx as nx
        import matplotlib.pyplot as plt
    except ImportError:
        st.warning("Instale o networkx: `pip install networkx`")
        return

    arestas = [
        ("Reptilia", "Archosauria"),
        ("Archosauria", "Dinosauria"),
        ("Archosauria", "Pterosauria"),
        ("Dinosauria", "Saurischia"),
        ("Dinosauria", "Ornithischia"),
        ("Saurischia", "Theropoda"),
        ("Saurischia", "Sauropodomorpha"),
        ("Theropoda", "Tyrannosauridae"),
        ("Theropoda", "Dromaeosauridae"),
        ("Theropoda", "Spinosauridae"),
        ("Sauropodomorpha", "Brachiosauridae"),
        ("Sauropodomorpha", "Diplodocidae"),
        ("Ornithischia", "Ceratopsia"),
        ("Ornithischia", "Ornithopoda"),
        ("Ornithischia", "Stegosauria"),
        ("Ornithischia", "Ankylosauria"),
        ("Reptilia", "Sauropterygia"),
        ("Sauropterygia", "Plesiosauria"),
        ("Reptilia", "Ichthyosauria"),
    ]

    G = nx.DiGraph()
    G.add_edges_from(arestas)

    # Definir níveis via BFS
    raiz = "Reptilia"
    niveis = {raiz: 0}
    for u, v in nx.bfs_edges(G, raiz):
        niveis[v] = niveis[u] + 1

    nos_por_nivel = {}
    for node, nivel in niveis.items():
        nos_por_nivel.setdefault(nivel, []).append(node)

    for nivel in nos_por_nivel:
        nos_por_nivel[nivel].sort()

    # Posições espaçadas
    pos = {}
    espacamento_vertical = 3.5
    espacamento_horizontal = 4.0

    for nivel, nos in nos_por_nivel.items():
        y_centro = (len(nos) - 1) * espacamento_vertical / 2
        for i, node in enumerate(nos):
            y = - (i * espacamento_vertical - y_centro)
            x = nivel * espacamento_horizontal
            pos[node] = (x, y)

    # Tamanho da figura
    max_y = max(pos.values(), key=lambda p: p[1])[1]
    min_y = min(pos.values(), key=lambda p: p[1])[1]
    altura_total = max_y - min_y + 2
    largura_total = max(pos.values(), key=lambda p: p[0])[0] + 2

    fig, ax = plt.subplots(figsize=(max(12, largura_total * 0.9), max(10, altura_total * 0.8)))

    nx.draw_networkx_nodes(G, pos, node_size=9000, node_color='lightblue', edgecolors='black', linewidths=2, ax=ax)

    # Rótulos com quebra de linha
    labels = {}
    for node in G.nodes():
        if len(node) > 12:
            if 'idae' in node:
                labels[node] = node.replace('idae', 'idae\n')
            else:
                words = node.split()
                if len(words) > 1:
                    labels[node] = words[0] + "\n" + " ".join(words[1:])
                else:
                    mid = len(node) // 2
                    labels[node] = node[:mid] + "\n" + node[mid:]
        else:
            labels[node] = node

    for node, (x, y) in pos.items():
        ax.text(x, y, labels[node], ha='center', va='center', fontsize=9, fontweight='bold', color='black')

    nx.draw_networkx_edges(G, pos, arrowstyle='->', arrowsize=14, edge_color='gray', width=1.8, ax=ax)

    # Ajuste dos limites para não cortar a bolota esquerda (Reptilia)
    ax.set_xlim(-1.8, largura_total + 0.8)   # ← valor negativo maior para dar folga
    ax.set_ylim(min_y - 2, max_y + 2)
    ax.axis('off')
    ax.set_title("Cladograma hierárquico (distância evolutiva vertical)", fontsize=12)

    st.pyplot(fig)

    st.markdown("""
    **Legenda:**
    - **Reptilia** → Classe dos répteis (ancestral comum).
    - **Archosauria** → Grupo que inclui dinossauros, pterossauros e crocodilos.
    - **Dinosauria** → Dinossauros (Saurischia + Ornithischia).
    - **Theropoda** → Carnívoros bípedes (T-rex, Velociraptor).
    - **Sauropodomorpha** → Herbívoros de pescoço longo (Braquiossauro).
    - **Ornithischia** → Herbívoros com bico (Triceratops, Estegossauro).
    - **Pterosauria** → Répteis voadores (não dinossauros).
    - **Sauropterygia / Ichthyosauria** → Répteis marinhos.
    """)
    st.info("Dica: Amplie a janela para ver todos os nós. Os nomes agora estão centralizados dentro das bolotas azuis.")