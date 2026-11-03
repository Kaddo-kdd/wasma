//! Wasma Canonical Reference Application: Embedded Host Integration.
//!
//! Demonstrates how an external Rust application embeds `wasma-runtime` as a library
//! to execute WebAssembly components with strict deny-by-default security, deterministic
//! resource limits (fuel and memory quotas), robust fail-explicit error handling, and
//! tenant/session isolation.

use std::env;
use std::fs;
use std::path::Path;

use wasma_runtime::{
    Engine, ExecutionLimits, HostPolicy, InstanceLimits, InvocationReport, Resolver, RuntimeError,
    Val,
};

/// Default embedded component: Business Rules Engine compiled in Example 1.
static DEFAULT_COMPONENT_BYTES: &[u8] = include_bytes!("../../business-rules/discount_rules.wasm");

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("============================================================");
    println!("  Wasma Reference Application: Embedded Host Integration");
    println!("============================================================\n");

    // 1. Resolve WASM bytes (either from user-provided file path or embedded default)
    let wasm_bytes = load_target_wasm()?;
    println!("✓ Target WASM artifact ready: {} bytes\n", wasm_bytes.len());

    // 2. Initialize the Runtime Engine
    let engine = Engine::new()?;
    println!("✓ Runtime engine initialized successfully");

    // 3. Configure Security Policy (ADR-002: Deny-by-default)
    let policy = HostPolicy::deny_all();
    println!("✓ Host security policy configured: deny_all()");

    // 4. Load Component with Policy
    let component = engine.load_component_with_policy(&wasm_bytes, &policy)?;
    println!(
        "✓ Component loaded and bound to host policy (is_component_model={})\n",
        component.is_component_model()
    );

    // ------------------------------------------------------------------------
    // Demo 1: Successful Execution & InvocationReport with Fuel Accounting
    // ------------------------------------------------------------------------
    println!("--- Demo 1: Successful Execution & Resource Accounting ---");
    let generous_limits = ExecutionLimits::unmetered().with_fuel(100_000);
    let op_discount = "wasma:examples/rules@0.1.0#evaluate-discount";
    // Arguments: order_amount_cents = 15000 ($150.00), customer_tier = 2 (Silver), loyalty_years = 4
    let args = [Val::S32(15000), Val::S32(2), Val::S32(4)];

    let report: InvocationReport =
        component.invoke_with_limits(op_discount, &args, &generous_limits)?;
    let fuel_consumed = report.fuel_consumed.unwrap_or(0);
    println!(
        "Invoked '{}' with args: order=$150.00, tier=Silver, loyalty=4 years",
        op_discount
    );
    println!("✓ Returned values: {:?}", report.values);
    println!("✓ Measured fuel consumed: {} units\n", fuel_consumed);

    // ------------------------------------------------------------------------
    // Demo 2: Calibrated Fuel Exhaustion (RuntimeError::FuelExhausted)
    // ------------------------------------------------------------------------
    println!("--- Demo 2: Calibrated Fuel Exhaustion ---");
    // Calibrated against measured fuel: provide strictly fewer units than required
    let insufficient_fuel = if fuel_consumed > 10 {
        fuel_consumed / 2
    } else {
        5
    };
    let tight_fuel_limits = ExecutionLimits::unmetered().with_fuel(insufficient_fuel);

    println!(
        "Attempting invocation with insufficient fuel quota ({} units)...",
        insufficient_fuel
    );
    match component.invoke_with_limits(op_discount, &args, &tight_fuel_limits) {
        Ok(_) => panic!("Expected FuelExhausted, but invocation unexpectedly succeeded"),
        Err(RuntimeError::FuelExhausted { limit }) => {
            println!(
                "✓ Caught expected typed error: RuntimeError::FuelExhausted {{ limit: {} }}",
                limit
            );
            assert_eq!(limit, insufficient_fuel);
        }
        Err(other) => panic!("Unexpected error variant: {:?}", other),
    }
    println!();

    // ------------------------------------------------------------------------
    // Demo 3: Memory Limit Enforcement (RuntimeError::MemoryLimitExceeded)
    // ------------------------------------------------------------------------
    println!("--- Demo 3: Memory Limit Enforcement ---");
    // Construct a module requesting 2 linear memory pages (128 KiB = 131,072 bytes)
    let memory_greedy_wasm = wat::parse_str(
        r#"(module
            (memory (export "memory") 2)
            (func (export "run") (result i32)
                i32.const 42
            )
        )"#,
    )?;
    let memory_component = engine.load_component_with_policy(&memory_greedy_wasm, &policy)?;

    // Restrict memory quota to 1 page (64 KiB = 65,536 bytes)
    let memory_limits =
        ExecutionLimits::unmetered().with_instance_limits(InstanceLimits::new(65_536));
    println!("Invoking component requesting 128 KiB under a 64 KiB memory quota...");

    match memory_component.invoke_with_limits("run", &[], &memory_limits) {
        Ok(_) => panic!("Expected MemoryLimitExceeded, but invocation succeeded"),
        Err(RuntimeError::MemoryLimitExceeded {
            requested_bytes,
            max_bytes,
        }) => {
            println!(
                "✓ Caught expected typed error: RuntimeError::MemoryLimitExceeded {{ requested: {} bytes, max: {} bytes }}",
                requested_bytes, max_bytes
            );
            assert_eq!(max_bytes, 65_536);
            assert_eq!(requested_bytes, 131_072);
        }
        Err(other) => panic!("Unexpected error variant: {:?}", other),
    }
    println!();

    // ------------------------------------------------------------------------
    // Demo 4: Missing Function Handling (RuntimeError::FunctionNotFound)
    // ------------------------------------------------------------------------
    println!("--- Demo 4: Missing Function Handling ---");
    let missing_op = "wasma:examples/rules@0.1.0#nonexistent-operation";
    println!(
        "Attempting to invoke nonexistent operation '{}'...",
        missing_op
    );

    match component.invoke_with_limits(missing_op, &[], &generous_limits) {
        Ok(_) => panic!("Expected FunctionNotFound, but invocation succeeded"),
        Err(RuntimeError::FunctionNotFound(name)) => {
            println!(
                "✓ Caught expected typed error: RuntimeError::FunctionNotFound(\"{}\")",
                name
            );
            assert_eq!(name, missing_op);
        }
        Err(other) => panic!("Unexpected error variant: {:?}", other),
    }
    println!();

    // ------------------------------------------------------------------------
    // Demo 5: Unauthorized Import Denial (RuntimeError::UnauthorizedImport)
    // ------------------------------------------------------------------------
    println!("--- Demo 5: Unauthorized Import Denial (Deny-by-Default) ---");
    let untrusted_import_wasm = wat::parse_str(
        r#"(module
            (import "host" "system_exec" (func $exec))
            (func (export "run")
                call $exec
            )
        )"#,
    )?;
    println!("Loading component importing 'host::system_exec' under HostPolicy::deny_all()...");

    match engine.load_component_enforcing_policy(&untrusted_import_wasm, &policy) {
        Ok(_) => panic!("Expected UnauthorizedImport, but load succeeded"),
        Err(RuntimeError::UnauthorizedImport { module, name }) => {
            println!(
                "✓ Caught expected typed error at load-time: RuntimeError::UnauthorizedImport {{ module: \"{}\", name: \"{}\" }}",
                module, name
            );
            assert_eq!(module, "host");
            assert_eq!(name, "system_exec");
        }
        Err(other) => panic!("Unexpected error variant: {:?}", other),
    }
    println!();

    // ------------------------------------------------------------------------
    // Demo 6: Independent Executions After Failure (ADR-005 Store Isolation)
    // ------------------------------------------------------------------------
    println!("--- Demo 6: Fresh Store Isolation After Traps/Failures ---");
    // After fuel exhaustion and memory denial, the original component and engine
    // remain completely uncorrupted. Invocation with valid limits succeeds.
    let recover_report = component.invoke_with_limits(op_discount, &args, &generous_limits)?;
    println!(
        "✓ Subsequent invocation succeeded with clean state: {:?} (fuel: {} units)",
        recover_report.values,
        recover_report.fuel_consumed.unwrap_or(0)
    );
    assert_eq!(recover_report.values, report.values);
    println!();

    // ------------------------------------------------------------------------
    // Demo 7: Content-Addressed Caching with Resolver and Session Reset
    // ------------------------------------------------------------------------
    println!("--- Demo 7: Content-Addressed Caching & Session Reset ---");
    let mut resolver = Resolver::new()?;

    // First load compiles and populates content-addressed cache
    let _comp1 = resolver.load(&wasm_bytes)?;
    println!(
        "Cached artifacts in resolver after first load: {}",
        resolver.cached_count()
    );
    assert_eq!(resolver.cached_count(), 1);

    // Second load hits content-addressed cache without recompilation
    let _comp2 = resolver.load(&wasm_bytes)?;
    println!(
        "Cached artifacts after repeated load (cache hit): {}",
        resolver.cached_count()
    );
    assert_eq!(resolver.cached_count(), 1);

    // Session reset purges instances and cache for tenant isolation
    resolver.reset();
    println!(
        "Cached artifacts after resolver.reset(): {}",
        resolver.cached_count()
    );
    assert_eq!(resolver.cached_count(), 0);
    println!();

    println!("============================================================");
    println!("  All 7 Embedded Host Verification Scenarios Passed!");
    println!("============================================================");
    Ok(())
}

fn load_target_wasm() -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() > 1 && !args[1].starts_with('-') {
        let path = Path::new(&args[1]);
        println!("Loading custom component from: {}", path.display());
        let bytes = fs::read(path)?;
        return Ok(bytes);
    }

    println!("No CLI component path specified; using canonical Business Rules fixture.");
    Ok(DEFAULT_COMPONENT_BYTES.to_vec())
}
