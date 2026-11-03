use wasma_runtime::{
    Engine, ExecutionLimits, HostPolicy, InstanceLimits, Resolver, RuntimeError, Val,
};

static COMPONENT_BYTES: &[u8] = include_bytes!("../../business-rules/discount_rules.wasm");

#[test]
fn test_embedded_host_successful_invocation_and_fuel() {
    let engine = Engine::new().expect("engine");
    let policy = HostPolicy::deny_all();
    let component = engine
        .load_component_with_policy(COMPONENT_BYTES, &policy)
        .expect("load component");

    let limits = ExecutionLimits::unmetered().with_fuel(50_000);
    let op = "wasma:examples/rules@0.1.0#evaluate-discount";
    let args = [Val::S32(10000), Val::S32(1), Val::S32(0)]; // Bronze, $100.00 -> 5%

    let report = component
        .invoke_with_limits(op, &args, &limits)
        .expect("invoke");

    assert!(report.fuel_consumed.is_some());
    let fuel = report.fuel_consumed.unwrap();
    assert!(fuel > 0 && fuel <= 100);

    if let Some(Val::Record(fields)) = report.values.first() {
        let field_map: std::collections::BTreeMap<_, _> = fields.iter().cloned().collect();
        assert_eq!(field_map.get("status-code"), Some(&Val::S32(200)));
        assert_eq!(field_map.get("discount-cents"), Some(&Val::S32(500)));
        assert_eq!(field_map.get("final-amount-cents"), Some(&Val::S32(9500)));
        assert_eq!(field_map.get("applied-rate"), Some(&Val::S32(5)));
    } else {
        panic!("expected Record result");
    }
}

#[test]
fn test_embedded_host_calibrated_fuel_exhaustion() {
    let engine = Engine::new().expect("engine");
    let policy = HostPolicy::deny_all();
    let component = engine
        .load_component_with_policy(COMPONENT_BYTES, &policy)
        .expect("load component");

    // Calibrated: 10 units is strictly less than the 62 units needed
    let tight_limits = ExecutionLimits::unmetered().with_fuel(10);
    let op = "wasma:examples/rules@0.1.0#evaluate-discount";
    let args = [Val::S32(10000), Val::S32(1), Val::S32(0)];

    let err = component
        .invoke_with_limits(op, &args, &tight_limits)
        .expect_err("should exhaust fuel");

    match err {
        RuntimeError::FuelExhausted { limit } => assert_eq!(limit, 10),
        other => panic!("expected FuelExhausted, got {other:?}"),
    }
}

#[test]
fn test_embedded_host_memory_limits_rejection() {
    let engine = Engine::new().expect("engine");
    let policy = HostPolicy::deny_all();

    // Module requesting 2 pages = 128 KiB
    let greedy_wasm = wat::parse_str(
        r#"(module (memory (export "memory") 2) (func (export "run") (result i32) i32.const 7))"#,
    )
    .expect("wat");
    let component = engine
        .load_component_with_policy(&greedy_wasm, &policy)
        .expect("load");

    // Limit to 1 page = 64 KiB
    let limits = ExecutionLimits::unmetered().with_instance_limits(InstanceLimits::new(65_536));
    let err = component
        .invoke_with_limits("run", &[], &limits)
        .expect_err("should exceed memory limit");

    match err {
        RuntimeError::MemoryLimitExceeded {
            requested_bytes,
            max_bytes,
        } => {
            assert_eq!(max_bytes, 65_536);
            assert_eq!(requested_bytes, 131_072);
        }
        other => panic!("expected MemoryLimitExceeded, got {other:?}"),
    }
}

#[test]
fn test_embedded_host_missing_function() {
    let engine = Engine::new().expect("engine");
    let policy = HostPolicy::deny_all();
    let component = engine
        .load_component_with_policy(COMPONENT_BYTES, &policy)
        .expect("load component");

    let err = component
        .invoke("wasma:examples/rules@0.1.0#not-a-func", &[])
        .expect_err("should fail for missing function");

    match err {
        RuntimeError::FunctionNotFound(name) => {
            assert_eq!(name, "wasma:examples/rules@0.1.0#not-a-func");
        }
        other => panic!("expected FunctionNotFound, got {other:?}"),
    }
}

#[test]
fn test_embedded_host_unauthorized_import_load_time_denial() {
    let engine = Engine::new().expect("engine");
    let policy = HostPolicy::deny_all();

    let untrusted_wasm =
        wat::parse_str(r#"(module (import "host" "dangerous_call" (func)) (func (export "run")))"#)
            .expect("wat");

    let err = engine
        .load_component_enforcing_policy(&untrusted_wasm, &policy)
        .expect_err("load should fail due to unauthorized import");

    match err {
        RuntimeError::UnauthorizedImport { module, name } => {
            assert_eq!(module, "host");
            assert_eq!(name, "dangerous_call");
        }
        other => panic!("expected UnauthorizedImport, got {other:?}"),
    }
}

#[test]
fn test_embedded_host_store_isolation_after_failure() {
    let engine = Engine::new().expect("engine");
    let policy = HostPolicy::deny_all();
    let component = engine
        .load_component_with_policy(COMPONENT_BYTES, &policy)
        .expect("load component");

    let op = "wasma:examples/rules@0.1.0#evaluate-discount";
    let args = [Val::S32(10000), Val::S32(1), Val::S32(0)];

    // Run 1: Exhausts fuel
    let tight = ExecutionLimits::unmetered().with_fuel(5);
    let _ = component.invoke_with_limits(op, &args, &tight);

    // Run 2: Immediately following failure, fresh store with generous fuel succeeds
    let generous = ExecutionLimits::unmetered().with_fuel(50_000);
    let report = component
        .invoke_with_limits(op, &args, &generous)
        .expect("should succeed in fresh store");
    assert!(report.fuel_consumed.is_some());
}

#[test]
fn test_embedded_host_resolver_cache_and_session_reset() {
    let mut resolver = Resolver::new().expect("resolver");

    assert_eq!(resolver.cached_count(), 0);
    let _ = resolver.load(COMPONENT_BYTES).expect("load 1");
    assert_eq!(resolver.cached_count(), 1);

    // Cache hit
    let _ = resolver.load(COMPONENT_BYTES).expect("load 2");
    assert_eq!(resolver.cached_count(), 1);

    // Session reset
    resolver.reset();
    assert_eq!(resolver.cached_count(), 0);
}
