---
title: Instalación
description: Instala la CLI wasma mediante paquetes precompilados o compila desde fuente.
---

## Binarios precompilados (Recomendado para usuarios)

La forma recomendada de utilizar Wasma es descargar el binario precompilado autónomo correspondiente a tu plataforma. Los paquetes son completamente independientes y no requieren tener instalado Rust, Cargo ni dependencias de compilación externas.

### Paquetes oficiales de distribución (v0.1.0)

| Plataforma | Arquitectura | Paquete de distribución | Integridad |
| :--- | :--- | :--- | :--- |
| **Linux** | x86_64 GNU (`glibc 2.31+`) | `wasma-v0.1.0-x86_64-unknown-linux-gnu.tar.gz` | `SHA256SUMS` |
| **macOS** | Apple Silicon ARM64 (`macOS 12+`) | `wasma-v0.1.0-aarch64-apple-darwin.tar.gz` | `SHA256SUMS` |
| **Windows** | x86_64 MSVC (`Windows 10/11+`) | `wasma-v0.1.0-x86_64-pc-windows-msvc.zip` | `SHA256SUMS` |

Cada paquete contiene el ejecutable (`wasma` o `wasma.exe`), la licencia MIT y la documentación básica.

### Verificación criptográfica

Por política estricta de seguridad en la cadena de suministro de software, **Wasma no utiliza instaladores desatendidos por red** (`curl | sh` ni scripts remotos invocados con `iex`). La instalación se realiza comprobando el hash SHA-256 localmente frente al catálogo oficial `SHA256SUMS`:

```sh
# En Linux / macOS
sha256sum --check --ignore-missing SHA256SUMS

# En Windows PowerShell
(Get-FileHash wasma-v0.1.0-x86_64-pc-windows-msvc.zip -Algorithm SHA256).Hash
```

> [!NOTE]
> **Disponibilidad de descargas:** Los paquetes oficiales y sus firmas Minisign se publicarán formalmente en GitHub Releases con la culminación de la iniciativa INI-009 en **AN-076**. Durante la etapa de desarrollo previa, los artefactos de validación son generados de manera reproducible por los pipelines de CI (AN-070). Para instrucciones detalladas paso a paso por sistema operativo, consulte la [Guía de instalación del repositorio](https://github.com/Kaddo-kdd/wasma/blob/main/docs/installation.md) y la [Verificación criptográfica de releases](https://github.com/Kaddo-kdd/wasma/blob/main/docs/release-verification.md).

## Compilar desde fuente (Para desarrolladores)

Si vas a contribuir al desarrollo de Wasma o deseas compilar la herramienta tú mismo, necesitas Git, Rust y Cargo. El repositorio fija Rust **1.85.0** mediante `rust-toolchain.toml`.

```sh
git clone https://github.com/Kaddo-kdd/wasma.git
cd wasma
cargo build --locked --release -p wasma-cli --bin wasma
```

El binario queda en `target/release/wasma` (o `wasma.exe` en Windows). Puedes añadir ese directorio a tu `PATH` o invocarlo con la ruta absoluta.

```sh
./target/release/wasma --help
./target/release/wasma --version
```

## Plataformas iniciales

Wasma recomienda **Linux x86_64 GNU** para las primeras integraciones y despliegues controlados. Windows x86_64 y macOS ARM64 se mantienen compatibles y se validan funcionalmente en la matriz de CI ([ADR-007](https://github.com/Kaddo-kdd/wasma/blob/main/knowledge/tech/decisions/ADR-007-plataforma-operativa-inicial-wasma.md)). Esta recomendación no afirma mejor rendimiento en Linux ni certifica WASI para cualquier carga de producción; las limitaciones de rendimiento permanecen documentadas.

## Comprobar la instalación

La ayuda debe listar los cinco comandos reales: `build`, `verify`, `test`, `run` y `publish`. No existe un subcomando `spec` en el parser de la CLI.

Los siguientes ejemplos asumen que `wasma` está en el PATH. Si no lo está, sustituye ese comando por la ruta absoluta al binario compilado.

## Alias de compatibilidad retroactiva

De acuerdo con [ADR-008](https://github.com/Kaddo-kdd/wasma/blob/main/knowledge/tech/decisions/ADR-008-identidad-tecnica-migracion-wasma.md), el binario canónico es `wasma`. Quienes requieran el alias retrocompatible `agent-native` pueden compilarlo con `cargo build --release -p wasma-cli --bin agent-native --features legacy-alias`, el cual emite una advertencia de deprecación en `stderr` indicando su reemplazo por `wasma`.

## Continúa

[Ejecuta tu primer componente](/docs/first-component/). El tutorial se completa en 5 minutos y no requiere claves LLM ni servicios de red tras instalar la CLI.
