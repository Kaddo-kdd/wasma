---
title: Host Rust embebido
description: Integración de wasma-runtime en aplicaciones Rust para ejecución segura con políticas deny-by-default, cuotas de fuel y límites de memoria.
---

Esta aplicación de referencia demuestra cómo un servicio backend o microservicio Rust externo consume [`wasma-runtime`](https://github.com/Kaddo-kdd/wasma/tree/main/crates/runtime) como biblioteca de bajo nivel para instanciar y ejecutar componentes WebAssembly de forma autónoma, segura y determinista.

El código fuente completo y los tests automatizados se encuentran en:
[`examples/embedded-host/`](https://github.com/Kaddo-kdd/wasma/tree/main/examples/embedded-host).

---

## 1. Principios Arquitectónicos

La integración host de Wasma se fundamenta en cuatro garantías clave de diseño:

1. **Ejecución aislada sin compilador ni LLM (ADR-001)**: El host depende únicamente de `wasma-runtime`. No se requiere Cargo, `rustc`, ni conexión a internet en tiempo de ejecución.
2. **Seguridad Deny-by-Default (ADR-002)**: Todo import o capacidad no autorizada explícitamente mediante `HostPolicy` es denegada en tiempo de carga (`load_component_enforcing_policy`).
3. **Taxonomía Fail-Explicit de Errores (ADR-004)**: Todos los fallos retornan variantes tipadas de `RuntimeError` (`FuelExhausted`, `MemoryLimitExceeded`, `FunctionNotFound`, `UnauthorizedImport`).
4. **Aislamiento por Invocación (ADR-005)**: Cada invocación se ejecuta sobre un `wasmtime::Store` fresco y efímero. Los traps y fallos en una ejecución nunca corrompen el estado del motor ni de solicitudes posteriores.

---

## 2. Dependencias de Cargo

El host define un workspace independiente en [`Cargo.toml`](https://github.com/Kaddo-kdd/wasma/blob/main/examples/embedded-host/Cargo.toml):

```toml title="Cargo.toml"
[package]
name = "wasma-example-embedded-host"
version = "0.1.0"
edition = "2024"
publish = false

[dependencies]
wasma-runtime = { path = "../../crates/runtime", version = "0.1.0" }
wat = "1.221"
```

---

## 3. Escenarios Demostrados en el Host

La aplicación de ejemplo implementa y valida 7 escenarios esenciales:

### A. Ejecución con cuotas de fuel y extracción tipada

```rust
let engine = Engine::new()?;
let policy = HostPolicy::deny_all();
let component = engine.load_component_with_policy(&wasm_bytes, &policy)?;

let limits = ExecutionLimits::unmetered().with_fuel(100_000);
let report = component.invoke_with_limits(
    "wasma:examples/rules@0.1.0#evaluate-discount",
    &[Val::S32(15000), Val::S32(2), Val::S32(4)],
    &limits,
)?;

println!("Valores retornados: {:?}", report.values);
println!("Fuel consumido: {} unidades", report.fuel_consumed.unwrap_or(0));
```

### B. Agotamiento de fuel calibrado (`RuntimeError::FuelExhausted`)

La invocación mide el consumo exacto de la función (62 unidades de fuel). Si se asigna una cuota inferior (e.g. 31 unidades), el runtime detiene la ejecución inmediatamente:

```rust
let tight_limits = ExecutionLimits::unmetered().with_fuel(31);
match component.invoke_with_limits(op, &args, &tight_limits) {
    Err(RuntimeError::FuelExhausted { limit }) => {
        println!("Capturado fallo tipado por límite de fuel: {limit}");
    }
    _ => panic!("Se esperaba FuelExhausted"),
}
```

### C. Límite de memoria lineal (`RuntimeError::MemoryLimitExceeded`)

Cuando un componente solicita páginas de memoria por encima de la cuota configurada en `InstanceLimits`, el `ResourceLimiter` deniega el crecimiento y clasifica el error explícitamente:

```rust
let memory_limits = ExecutionLimits::unmetered()
    .with_instance_limits(InstanceLimits::new(65_536)); // 1 página (64 KiB)

// Componente que solicita 2 páginas (128 KiB)
match memory_component.invoke_with_limits("run", &[], &memory_limits) {
    Err(RuntimeError::MemoryLimitExceeded { requested_bytes, max_bytes }) => {
        println!("Memoria denegada: solicitado {requested_bytes}, límite {max_bytes}");
    }
    _ => panic!("Se esperaba MemoryLimitExceeded"),
}
```

### D. Detección de funciones inexistentes y denegación de imports

- Invocación de operaciones ausentes retorna `RuntimeError::FunctionNotFound(name)`.
- Componentes que declaran imports como `host::system_exec` bajo `HostPolicy::deny_all()` son rechazados en tiempo de carga con `RuntimeError::UnauthorizedImport`.

### E. Aislamiento tras fallos y reseteo de caché

- Inmediatamente tras un fallo por fuel o memoria, una nueva invocación sobre el mismo componente y motor tiene éxito (Store limpio por llamada).
- Para escenarios multitenant, `Resolver::reset()` permite vaciar la caché compilada entre sesiones.

---

## 4. Ejecución Paso a Paso

Desde la raíz del repositorio:

### Ejecutar la aplicación de demostración

```bash
cargo run --manifest-path examples/embedded-host/Cargo.toml
```

Para evaluar un componente WebAssembly externo:

```bash
cargo run --manifest-path examples/embedded-host/Cargo.toml -- path/to/component.wasm
```

### Ejecutar la suite de tests de integración

```bash
cargo test --manifest-path examples/embedded-host/Cargo.toml
```

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

:::note[Aviso de diseño]
Este proyecto es una aplicación de referencia técnica con propósitos ilustrativos y de verificación de APIs. No constituye una plantilla de despliegue directo para producción sin auditoría previa de seguridad y políticas específicas del entorno anfitrión.
:::
