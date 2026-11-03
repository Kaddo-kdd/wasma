# Wasma Example: Motor de Reglas de Negocio (Business Rules Engine)

Este ejemplo canónico demuestra la construcción, verificación, compilación y prueba de un componente WebAssembly Component Model determinista para la evaluación de reglas comerciales (descuentos, tiers y elegibilidad de clientes) utilizando la CLI oficial de Wasma.

## Arquitectura y Lógica de Negocio

El componente evalúa reglas de tarificación deterministas sin depender de compiladores externos, conectividad de red ni modelos de lenguaje en tiempo de ejecución.

### Contrato WIT (`rules.wit`)

```wit
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

### Reglas de Evaluación y Tiers

1. **Límites de Entrada y Prevención de Desbordamiento (`i32`)**:
   - `order-amount-cents`: Rango válido `0..=20_000_000` (hasta $200,000.00 USD). Montos mayores o negativos retornan `status-code: 400`.
   - `loyalty-years`: Rango válido `0..=100`. Valores fuera de rango retornan `status-code: 400`.
   - `customer-tier`: Valores válidos `1` (Bronze), `2` (Silver), `3` (Gold). Cualquier otro valor retorna `status-code: 404`.

2. **Cálculo de Descuentos**:
   - **Bronze (`tier 1`)**:
     - Descuento base: `0 %`.
     - Bonificación por volumen: Si `order-amount-cents >= 10_000` ($100.00), tasa aplicada = `5 %`.
   - **Silver (`tier 2`)**:
     - Descuento base: `10 %`.
     - Bonificación por antigüedad: Si `loyalty-years >= 3`, tasa aplicada = `12 %` (`10 %` base + `2 %` bono).
   - **Gold (`tier 3`)**:
     - Descuento base: `20 %`.
     - Bonificación por antigüedad: Si `loyalty-years >= 5`, tasa aplicada = `25 %` (`20 %` base + `5 %` bono).
   - `discount-cents = (order-amount-cents * applied-rate) / 100` (división entera determinista).
   - `final-amount-cents = order-amount-cents - discount-cents`.

3. **Elegibilidad (`is-eligible-for-tier`)**:
   - `tier 1` (Bronze): Siempre elegible (`annual-spend-cents >= 0`).
   - `tier 2` (Silver): Requiere gasto anual acumulado `>= 50_000` ($500.00).
   - `tier 3` (Gold): Requiere gasto anual acumulado `>= 200_000` ($2,000.00).
   - Gastos negativos o tiers no reconocidos retornan `false`.

---

## Reproducción Paso a Paso

Ejecute los siguientes comandos desde el directorio `examples/business-rules/`:

### 1. Verificación Estática del Semantic IR

Valida el esquema del IR, tipos, aridades y compatibilidad con el contrato WIT:

```bash
wasma verify discount-rules.ir.json
```

*Salida esperada:*
```text
Verification SUCCESSFUL: discount-rules.ir.json
Type: Semantic IR
Status: Valid (0 errors)
```

### 2. Compilación Determinista a WebAssembly

Compila la representación intermedia directamente a un componente WebAssembly Component Model (.wasm) generando un hash SHA-256 verificable:

```bash
wasma build discount-rules.ir.json -o discount_rules.wasm
```

*Salida esperada:*
```text
Build SUCCESSFUL: Component 'unnamed_component'
Mode:       synthesizer
WASM Size:  1616 bytes
SHA-256:    44d3fefb65a973809878becc0e20dbf144762d57019529d017bc76f4ff8cc629
Output:     discount_rules.wasm
```

### 3. Invocación Directa con la CLI

Evaluar descuento para cliente Silver ($150.00, Tier 2, 4 años de lealtad -> 12%):

```bash
wasma run --component discount_rules.wasm --function "wasma:examples/rules@0.1.0#evaluate-discount" 15000 2 4
```

*Salida formateada:*
```text
Function 'wasma:examples/rules@0.1.0#evaluate-discount' returned 1 value(s):
  [0]: Record([("status-code", S32(200)), ("discount-cents", S32(1800)), ("final-amount-cents", S32(13200)), ("applied-rate", S32(12))])
```

Verificar elegibilidad para Gold con gasto anual de $2,500.00 (250,000 centavos):

```bash
wasma run --component discount_rules.wasm --function "wasma:examples/rules@0.1.0#is-eligible-for-tier" 3 250000
```

*Salida:*
```text
Function 'wasma:examples/rules@0.1.0#is-eligible-for-tier' returned 1 value(s):
  [0]: Bool(true)
```

### 4. Ejecución de la Suite Declarativa YAML

Ejecuta la batería de 24 pruebas que valida casos nominales, casos frontera, desbordamientos y entradas inválidas:

```bash
wasma test --suite suite.yaml --component discount_rules.wasm
```

*Salida:*
```text
Test Suite:  wasma-business-rules
Component:   discount_rules.wasm
Results:     24 total, 24 passed, 0 failed, 0 errored
...
Suite Result: PASSED
```


---

## Alcance de la Reproducibilidad Observada

La compilación de `discount-rules.ir.json` genera de forma consistente el hash SHA-256 `44d3fefb65a973809878becc0e20dbf144762d57019529d017bc76f4ff8cc629` (1,616 bytes) en ejecuciones repetidas bajo la versión actual de la CLI y el compilador (`wasma-compiler`).

Esta reproducibilidad confirma la estabilidad interna del pipeline de síntesis desde Semantic IR v0.5 hasta WebAssembly Component Model en la línea base de desarrollo. No constituye una afirmación de determinismo binario universal invariable entre distintos sistemas operativos, opciones de empaquetado o futuras evoluciones mayores del toolchain de WebAssembly.
