# Precio vs. rendimiento en títulos de deuda

Relación inversa entre el **precio** y el **rendimiento** (tasa de interés) de bonos y otros títulos de deuda.

---

## 1. Relación inversa (esquema general)

```mermaid
flowchart LR
    subgraph sube["Cuando SUBE la tasa de interés"]
        A1[Precio del título BAJA]
        A2[Rendimiento al vencimiento SUBE]
    end

    subgraph baja["Cuando BAJA la tasa de interés"]
        B1[Precio del título SUBE]
        B2[Rendimiento al vencimiento BAJA]
    end

    sube --> baja
```

**Regla:** a mayor rendimiento exigido por el mercado, menor precio del bono; a menor rendimiento, mayor precio.

---

## 2. Por qué es inversa

```mermaid
flowchart TB
    subgraph concepto["Concepto"]
        C[Cupones y principal son FIJOS<br/>en un bono tradicional]
    end

    subgraph mercado_sube["Tasa de mercado SUBE"]
        M1[Inversores exigen más retorno]
        M2[El bono paga lo mismo]
        M3[Para “igualar” al mercado,<br/>el PRECIO del bono tiene que BAJAR]
    end

    subgraph mercado_baja["Tasa de mercado BAJA"]
        N1[Inversores aceptan menos retorno]
        N2[El bono paga lo mismo]
        N3[Quien tiene el bono lo vende más caro:<br/>el PRECIO SUBE]
    end

    C --> mercado_sube
    C --> mercado_baja
```

El bono promete pagos fijos. Si las tasas suben, ese flujo fijo vale menos hoy → el precio baja y el rendimiento sube. Si las tasas bajan, el flujo fijo vale más hoy → el precio sube y el rendimiento baja.

---

## 3. Resumen visual precio ↔ rendimiento

```mermaid
flowchart LR
    P[Precio del título]
    R[Rendimiento / tasa]

    P -->|sube| R
    R -->|baja| P
    P -->|baja| R
    R -->|sube| P

    style P fill:#e3f2fd
    style R fill:#fff3e0
```

| Precio del título | Rendimiento (tasa) |
|-------------------|---------------------|
| Sube              | Baja                |
| Baja              | Sube                |

---

## 4. Ejemplo numérico (conceptual)

```mermaid
flowchart TB
    subgraph bono["Bono: valor nominal 100, cupón 5% anual"]
        F[Flujos fijos: 5 cada año + 100 al vencimiento]
    end

    subgraph escenario1["Tasa mercado = 5%"]
        E1[Precio ≈ 100<br/>Rendimiento = 5%]
    end

    subgraph escenario2["Tasa mercado = 7%"]
        E2[Precio menor que 100<br/>Rendimiento sube a 7%]
    end

    subgraph escenario3["Tasa mercado = 3%"]
        E3[Precio mayor que 100<br/>Rendimiento baja a 3%]
    end

    F --> E1
    F --> E2
    F --> E3
```

- **Tasa = cupón:** precio cerca del valor nominal.
- **Tasa > cupón:** precio por debajo del nominal (descuento).
- **Tasa < cupón:** precio por encima del nominal (prima).

---

*Útil para interpretar movimientos en Cetes, bonos gubernamentales (M), Udibonos y cualquier título de deuda con flujos fijos.*
