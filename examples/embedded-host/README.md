# Wasma Example: Integración Host Embebida en Rust (Embedded Host)

Este ejemplo de referencia canónico demuestra cómo un servicio backend o microservicio Rust externo consume la biblioteca [`wasma-runtime`](../../crates/runtime/) para ejecutar componentes WebAssembly con seguridad deny-by-default, control de cuotas de recursos (fuel computacional y límites de memoria), aislamiento de sesiones y manejo explícito de fallos (ADR-001, ADR-002, ADR-004 y ADR-005).

## Principios y Garantías Demostradas

1. **Ejecución Autónoma sin Compilador ni LLM (ADR-001)**:
   El host depende exclusivamente de `wasma-runtime`. No se requiere Cargo, `rustc`, ni conexión a proveedores LLM para instanciar y ejecutar componentes WebAssembly.

2. **Seguridad Deny-by-Default (ADR-002)**:
   Las capacidades del sistema están denegadas por omisión con `HostPolicy::deny_all()`. Todo import no autorizado o no reconocido es rechazado taxativamente en tiempo de carga mediante `engine.load_component_enforcing_policy()`.

3. **Taxonomía Fail-Explicit de Errores (ADR-004)**:
   Todos los caminos de fallo retornan variantes tipadas de [`RuntimeError`](../../crates/runtime/src/error.rs):
   - `RuntimeError::FuelExhausted { limit }`: Invocación que supera el presupuesto de instrucciones WebAssembly.
   - `RuntimeError::MemoryLimitExceeded { requested_bytes, max_bytes }`: Crecimiento o asignación inicial que sobrepasa la cuota de memoria lineal del Store.
   - `RuntimeError::FunctionNotFound(name)`: Llamada a un identificador u operación exportada inexistente.
   - `RuntimeError::UnauthorizedImport { module, name }`: Intento de importar una interfaz no concedida por la política.

4. **Aislamiento por Invocación y Reseteo de Sesión (ADR-005)**:
   Cada llamada opera sobre un `wasmtime::Store` efímero. Un fallo o trap en una invocación no contamina el estado del motor ni las ejecuciones posteriores.
   Para escenarios multitenant o por sesión, [`Resolver::reset()`](../../crates/runtime/src/resolver.rs) purga instancias compiladas en caché.

---

## Ejecución Paso a Paso

### 1. Ejecutar el Binario Host de Demostración

El host corre automáticamente los 7 escenarios de verificación contra el componente del Motor de Reglas de Negocio (`discount_rules.wasm`):

```bash
cargo run --manifest-path examples/embedded-host/Cargo.toml
```

Para evaluar un componente WebAssembly externo personalizado:

```bash
cargo run --manifest-path examples/embedded-host/Cargo.toml -- path/to/component.wasm
```

### 2. Ejecutar la Suite de Pruebas de Integración

Valida de forma automatizada las 7 garantías de aislamiento, cuotas y políticas de seguridad:

```bash
cargo test --manifest-path examples/embedded-host/Cargo.toml
```

*Salida esperada:*
```text
running 7 tests
test test_embedded_host_unauthorized_import_load_time_denial ... ok
test test_embedded_host_memory_limits_rejection ... ok
test test_embedded_host_missing_function ... ok
test test_embedded_host_calibrated_fuel_exhaustion ... ok
test test_embedded_host_store_isolation_after_failure ... ok
test test_embedded_host_successful_invocation_and_fuel ... ok
test test_embedded_host_resolver_cache_and_session_reset ... ok

test result: ok. 7 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.07s
```

---

## Estructura del Código

- [`Cargo.toml`](./Cargo.toml): Manifiesto del workspace independiente con dependencia de bajo nivel hacia `wasma-runtime`.
- [`src/main.rs`](./src/main.rs): Aplicación CLI con la implementación de los 7 escenarios demostrativos.
- [`tests/host_integration.rs`](./tests/host_integration.rs): Suite de integración con aserciones tipadas exhaustivas.

> [!NOTE]
> Este proyecto constituye una aplicación de referencia técnica diseñada con fines ilustrativos y de verificación de contratos. No representa una plantilla certificada para despliegue directo en entornos de producción sin auditoría previa de seguridad y políticas específicas de la organización.
