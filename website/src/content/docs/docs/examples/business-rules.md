---
title: Motor de reglas comerciales
description: Aplicación de referencia para evaluación determinista de descuentos y tiers comerciales con Semantic IR v0.5 y WebAssembly Component Model.
---

Esta aplicación de referencia demuestra la construcción, verificación, compilación y prueba de un componente WebAssembly Component Model determinista para el cálculo de descuentos comerciales y elegibilidad por tiers (Bronze, Silver, Gold).

El código fuente completo y los artefactos ejecutables están disponibles en el repositorio:
[`examples/business-rules/`](https://github.com/Kaddo-kdd/wasma/tree/main/examples/business-rules).

---

## 1. Contrato WIT

El componente expone dos funciones a través de la interfaz `rules`:

```wit title="rules.wit"
package wasma:examples@0.1.0;

interface rules {
    record discount-summary {
        status-code: s32,
        discount-cents: s32,
        final-amount-cents: s32,
        applied-rate: s32,
    }

    evaluate-discount: func(order-amount-cents: s32, customer-tier: s32, loyalty-years: s32) -> discount-summary;
    is-eligible-for-tier: func(customer-tier: s32, annual-spend-cents: s32) -> bool;
}

world business-rules {
    export rules;
}
```

---

## 2. Reglas de Negocio y Límites

El componente implementa las siguientes reglas aritméticas deterministas sobre enteros con signo `i32`:

### Límites de entrada y prevención de overflow

- `order-amount-cents`: Rango admisible `0..=20_000_000` (hasta \$200,000.00 USD). Cifras superiores o valores negativos retornan `status-code: 400` para garantizar que ninguna multiplicación intermedia desborde el límite positivo de `i32` ($2^{31}-1$).
- `loyalty-years`: Rango admisible `0..=100`. Valores negativos o superiores retornan `status-code: 400`.
- `customer-tier`: Valores admitidos `1` (Bronze), `2` (Silver) y `3` (Gold). Tiers no reconocidos retornan `status-code: 404`.

### Tiers y bonificaciones

- **Bronze (Tier 1)**:
  - Tasa base: `0 %`.
  - Bonificación por volumen: Si `order-amount-cents >= 10_000` (\$100.00), tasa aplicada = `5 %`.
- **Silver (Tier 2)**:
  - Tasa base: `10 %`.
  - Bonificación por lealtad: Si `loyalty-years >= 3`, tasa aplicada = `12 %` (`10 %` base + `2 %` bono).
- **Gold (Tier 3)**:
  - Tasa base: `20 %`.
  - Bonificación por lealtad: Si `loyalty-years >= 5`, tasa aplicada = `25 %` (`20 %` base + `5 %` bono).

### Elegibilidad de clientes (`is-eligible-for-tier`)

- **Bronze**: Elegible para cualquier gasto anual acumulado `>= 0`.
- **Silver**: Requiere gasto anual `>= 50_000` (\$500.00).
- **Gold**: Requiere gasto anual `>= 200_000` (\$2,000.00).
- Valores negativos o tiers desconocidos retornan `false`.

---

## 3. Ejecución desde un Checkout Limpio

Desde la raíz del repositorio, acceda al directorio del ejemplo:

```bash
cd examples/business-rules
```

### Paso A — Verificación estática

Comprueba la conformidad del Semantic IR v0.5 contra el esquema y el contrato WIT:

```bash
wasma verify discount-rules.ir.json
```

```text
Verification SUCCESSFUL: discount-rules.ir.json
Type: Semantic IR
Status: Valid (0 errors)
```

### Paso B — Compilación determinista

Genera el binario Component Model (`discount_rules.wasm`) con SHA-256 reproducible:

```bash
wasma build discount-rules.ir.json -o discount_rules.wasm
```

```text
Build SUCCESSFUL: Component 'unnamed_component'
Mode:       synthesizer
WASM Size:  1616 bytes
SHA-256:    44d3fefb65a973809878becc0e20dbf144762d57019529d017bc76f4ff8cc629
Output:     discount_rules.wasm
```

### Paso C — Invocación directa con CLI

Evaluación de un pedido de \$150.00 (15,000 centavos) para cliente Silver (Tier 2) con 4 años de antigüedad (tasa 12 %):

```bash
wasma run --component discount_rules.wasm --function "wasma:examples/rules@0.1.0#evaluate-discount" 15000 2 4
```

```text
Function 'wasma:examples/rules@0.1.0#evaluate-discount' returned 1 value(s):
  [0]: Record([("status-code", S32(200)), ("discount-cents", S32(1800)), ("final-amount-cents", S32(13200)), ("applied-rate", S32(12))])
```

Comprobación de elegibilidad para Tier Gold con gasto anual de \$2,500.00:

```bash
wasma run --component discount_rules.wasm --function "wasma:examples/rules@0.1.0#is-eligible-for-tier" 3 250000
```

```text
Function 'wasma:examples/rules@0.1.0#is-eligible-for-tier' returned 1 value(s):
  [0]: Bool(true)
```

### Paso D — Suite declarativa YAML

Ejecución de la batería completa de 24 casos de prueba (positivos, frontera, desbordamiento y entradas inválidas):

```bash
wasma test --suite suite.yaml --component discount_rules.wasm
```

```text
Test Suite:  wasma-business-rules
Component:   discount_rules.wasm
Results:     24 total, 24 passed, 0 failed, 0 errored

Suite Result: PASSED
```

---

## 4. Alcance de la Reproducibilidad Observada

La compilación de discount-rules.ir.json produce consistentemente el hash SHA-256 44d3fefb65a973809878becc0e20dbf144762d57019529d017bc76f4ff8cc629 (1,616 bytes) en ejecuciones repetidas bajo la versión actual de la CLI y el compilador (wasma-compiler).

Esta reproducibilidad confirma la estabilidad interna del pipeline de síntesis desde Semantic IR v0.5 hasta WebAssembly Component Model en la línea base de desarrollo. No constituye una afirmación de determinismo binario universal independiente de sistemas operativos, opciones de empaquetado o futuras evoluciones mayores del toolchain de WebAssembly.

---

:::note[Aviso de diseño]
Esta aplicación de referencia está concebida como ejemplo didáctico de evaluación de contratos y pruebas E2E. En sistemas de producción reales, las políticas comerciales deben complementarse con auditorías de seguridad y controles de acceso específicos.
:::
