# Wasma Examples

Este directorio y sus miembros proporcionan aplicaciones de referencia y ejemplos canónicos para compilar, probar, embeber y desplegar componentes WebAssembly con **Wasma**.

## Aplicaciones de Referencia Disponibles

### 1. `business-rules` (Motor de Reglas de Negocio)
- **Ubicación:** [`examples/business-rules/`](./business-rules/)
- **Descripción:** Componente autónomo y determinista para evaluación de reglas comerciales de descuento y elegibilidad por tiers (Bronze, Silver, Gold).
- **Flujo:** `wasma verify` → `wasma build` → `wasma run` → `wasma test`.
- **Garantías:** Especificación Semantic IR v0.5, contrato WIT nativo, prevención de desbordamiento de `i32` y suite declarativa YAML con 24 casos de prueba (positivos, frontera y rechazo de errores).

---

### 2. `embedded-host` (Integración Host Embebida en Rust)
- **Ubicación:** [`examples/embedded-host/`](./embedded-host/)
- **Descripción:** Demostración de cómo un servicio backend en Rust embebe `wasma-runtime` como biblioteca de bajo nivel.
- **Comandos:**
  - `cargo run --manifest-path examples/embedded-host/Cargo.toml`
  - `cargo test --manifest-path examples/embedded-host/Cargo.toml`
- **Garantías:** Seguridad deny-by-default (`HostPolicy::deny_all()`), cuotas de fuel computacional medidas, límites de memoria lineal (`InstanceLimits`), aislamiento estricto de fallos por `Store` y reseteo de caché de sesión con `Resolver`.

---

### 3. `aws-lambda` (Despliegue Serverless)
- **Ubicación:** [`examples/aws-lambda/`](./aws-lambda/)
- **Descripción:** Despliegue de componentes Wasma en AWS Lambda sobre el runtime custom (`provided.al2023`).

---

### 4. `aws-lambda-benchmark` (Suite de Rendimiento)
- **Ubicación:** [`examples/aws-lambda-benchmark/`](./aws-lambda-benchmark/)
- **Descripción:** Comparativa sistemática de cold-starts y latencias de ejecución entre binarios Rust nativos y componentes WebAssembly.

---

### 5. `embed_runtime` (Ejemplo Interno de Runtime)
- **Ubicación:** [`crates/runtime/examples/embed_runtime.rs`](../crates/runtime/examples/embed_runtime.rs)
- **Descripción:** Ejemplo mínimo en el crate de runtime para probar carga y despacho de operaciones WIT.
