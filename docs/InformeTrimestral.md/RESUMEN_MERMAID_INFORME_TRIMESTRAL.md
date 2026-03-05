# Resumen visual – Informe Trimestral Banxico (Oct–Dic 2025)

**Documento:** Informe Trimestral, Octubre–Diciembre 2025  
**Publicado:** 26 de febrero de 2026  
**Fuente:** [Banco de México](https://www.banxico.org.mx/publicaciones-y-prensa/informes-trimestrales/informes-trimestralesprecios.html)

---

## 1. Estructura del informe (mapa de contenidos)

```mermaid
flowchart TB
    subgraph intro["1. Introducción"]
        A[Panorama global y nacional<br/>Política monetaria 4T2025]
    end

    subgraph ext["2. Entorno externo"]
        B1[2.1 Actividad económica mundial]
        B2[2.2 Precios materias primas]
        B3[2.3 Inflación en el exterior]
        B4[2.4 Política monetaria y mercados<br/>financieros internacionales]
    end

    subgraph mex["3. Entorno México"]
        C1[3.1 Actividad económica]
        C2[3.2 Mercado laboral]
        C3[3.3 Financiamiento]
        C4[3.4 Holgura económica]
        C5[3.5 Estabilidad sistema financiero]
    end

    subgraph inf["4. Inflación"]
        D1[4.1 Inflación 4T 2025]
        D2[4.2 INPP]
    end

    subgraph pol["5. Política monetaria"]
        E[Decisiones Junta de Gobierno<br/>Tasa de referencia]
    end

    subgraph prev["6. Previsiones"]
        F1[6.1 Actividad económica]
        F2[6.2 Inflación y balance de riesgos]
    end

    intro --> ext
    ext --> mex
    mex --> inf
    inf --> pol
    pol --> prev

    style intro fill:#1e3a5f,color:#fff
    style ext fill:#2d5a87,color:#fff
    style mex fill:#3d7ab5,color:#fff
    style inf fill:#5a9bd5,color:#fff
    style pol fill:#7eb8e8,color:#111
    style prev fill:#a8d4f0,color:#111
```

---

## 2. Línea de tiempo: decisiones y contexto (4T 2025 – feb 2026)

```mermaid
timeline
    title Oct 2025 – Feb 2026 | Informe Trimestral Banxico
    section 4T 2025
        Oct 2025 : Acuerdo comercial EUA–China (1 año)
                 : Inflación general 3.61% → 3.69%
                 : Subyacente 4.25% → 4.35%
        Nov 2025 : Banxico recorta 25 pb → tasa 7.00%
        Dic 2025 : Banxico recorta 25 pb → tasa 7.00%
                 : PIB 4T crece más que 3T
    section 2026
        Ene 2026 : Fed mantiene tasa (tras 3 recortes en 2025)
                 : Inflación general 3.79%, subyacente 4.52% (IEPS)
        Feb 2026 : Corte Suprema EUA: aranceles IEEPA improcedentes
                 : Nuevo arancel global EUA 10% (hasta 15%)
                 : Tensiones geopolíticas (Venezuela, Groenlandia, Irán)
                 : Banxico PAUSA: mantiene tasa en 7.00%
                 : 1ª quincena feb: inflación 3.92%
```

---

## 3. Inflación y meta (trayectoria conceptual)

```mermaid
flowchart LR
    subgraph obs["Observado 4T 2025"]
        IG[Inflación general 3.69%]
        IS[Subyacente 4.35%]
        INS[No subyacente 1.51%]
    end

    subgraph meta["Meta e intervalo"]
        M[Meta 3%]
        IV[Intervalo variabilidad]
    end

    subgraph prev["Pronóstico informe"]
        T27[Convergencia ~3%<br/>2T 2027]
    end

    obs --> prev
    prev --> M
    M --> IV

    style IG fill:#e8f4ea
    style IS fill:#fff3e0
    style M fill:#1b5e20,color:#fff
```

---

## 4. Política monetaria: ciclo de recortes y pausa

```mermaid
stateDiagram-v2
    [*] --> Tasa_alta: Ciclo restrictivo previo
    Tasa_alta --> Recorte_Nov: Nov 2025: -25 pb
    Recorte_Nov --> Recorte_Dic: Dic 2025: -25 pb
    Recorte_Dic --> Pausa_7: Tasa en 7.00%
    Pausa_7 --> Pausa_Feb: Feb 2026: mantener 7.00%
    Pausa_Feb --> Valorar_adelante: Valoración futura de ajustes

    note right of Pausa_Feb
        Objetivo: Tasa de Interés
        Interbancaria a 1 día = 7.00%
    end note
```

---

## 5. Entorno global → México (flujo de riesgos)

```mermaid
flowchart TB
    subgraph global["Entorno global"]
        G1[Tensiones comerciales<br/>EUA–China, aranceles]
        G2[Conflictos geopolíticos]
        G3[Actividad mundial: ritmo<br/>ligeramente menor]
        G4[Fed: pausa tras recortes<br/>Expectativa 3.4% cierre 2026]
    end

    subgraph canales["Canales hacia México"]
        CH1[Tipo de cambio: peso apreciado]
        CH2[Financiamiento externo]
        CH3[Comercio e inversión]
    end

    subgraph mx["México"]
        M1[PIB 4T: mayor ritmo que 3T]
        M2[2025 completo: +0.6%<br/>2023: 3.1% | 2024: 1.4%]
        M3[Empleo: atonía; desocupación baja]
        M4[Mercados ordenados; tasas corto plazo ↓]
    end

    G1 & G2 & G3 & G4 --> CH1 & CH2 & CH3
    CH1 & CH2 & CH3 --> M1 & M2 & M3 & M4

    style global fill:#2d2d2d,color:#fff
    style mx fill:#0d47a1,color:#fff
```

---

## 6. Balance de riesgos para la inflación (resumen cualitativo)

```mermaid
flowchart TB
    subgraph riesgos_alza["Riesgos al alza"]
        R1[Cambios fiscales / IEPS<br/>efectos segunda ronda]
        R2[Persistencia inflación servicios]
        R3[Incertidumbre política comercial EUA]
    end

    subgraph riesgos_baja["Riesgos a la baja"]
        B1[Holgura en la economía]
        B2[Postura monetaria restrictiva previa]
        B3[Apreciación del peso]
    end

    subgraph balance["Balance informe actual"]
        BAL[Balance más equilibrado que<br/>informe anterior · Sesgo al alza]
    end

    riesgos_alza --> balance
    riesgos_baja --> balance
```

---

## 7. Junta de Gobierno y mandato

```mermaid
flowchart LR
    subgraph junta["Junta de Gobierno"]
        G[Victoria Rodríguez Ceja<br/>Gobernadora]
        S1[Galia Borja Gómez]
        S2[José Gabriel Cuadra García]
        S3[Jonathan Heath Constable]
        S4[Omar Mejía Castelazo]
    end

    subgraph mandato["Mandato prioritario"]
        M1[Estabilidad de precios]
        M2[Meta inflación 3%]
        M3[Ancla expectativas]
    end

    junta --> mandato

    style junta fill:#1565c0,color:#fff
    style mandato fill:#0d47a1,color:#fff
```

---

## 8. Cifras clave (resumen ejecutivo)

| Concepto | Valor |
|----------|--------|
| **Periodo del informe** | Octubre – Diciembre 2025 |
| **Inflación general (4T 2025)** | 3.69% (3T: 3.61%) |
| **Inflación subyacente (4T 2025)** | 4.35% (3T: 4.25%) |
| **Inflación no subyacente (4T 2025)** | 1.51% |
| **Tasa de referencia (cierre 2025)** | 7.00% |
| **Decisión Feb 2026** | Pausa; tasa se mantiene en 7.00% |
| **PIB 2025 (total año)** | +0.6% |
| **Convergencia inflación a 3% (pronóstico)** | Segundo trimestre 2027 |
| **Balance de riesgos inflación** | Más equilibrado que informe anterior; sesgo al alza |

---

## 9. Recuadros del informe

- **Recuadro 1.** Conectividad entre sectores manufactureros en México y Estados Unidos  
- **Recuadro 2.** Evolución reciente de las variaciones de los precios de los servicios y sus componentes en México  
- **Recuadro 3.** Efecto de la incertidumbre sobre las tasas de interés de largo plazo  

---

*Elaborado a partir del Informe Trimestral Octubre–Diciembre 2025 del Banco de México. Cifras preliminares al 24 de febrero de 2026.*
