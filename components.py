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


def aba_deriva_continental(df=None):  # df não é mais usado, mas mantive compatível
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

    # Carrega a lista completa de dinossauros reais (50 espécies)
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
