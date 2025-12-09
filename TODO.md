# ATTN Protocol Monorepo TODO

Tasks and improvements for the ATTN Protocol monorepo, organized by priority.

## Milestone Reference

- **M1-M3**: Foundation (Complete)
- **M4-M7**: Economy (In Progress)
- **M8-M10**: City Life (Planned)

All tasks must include a milestone tag: `[M#]`

## 🔴 Critical (Address Immediately)

- [ ] [M4] Use Node.js v20 LTS for CI/CD to avoid tinypool crash
  - File: CI/CD configuration (GitHub Actions, etc.)
  - Issue: Vitest/tinypool crashes with `RangeError: Maximum call stack size exceeded` after tests complete on Node.js v22.21.1. Tests pass (218 total: core 7, framework 60, SDK 84, marketplace 67) but runner crashes during worker termination.
  - Root Cause: Node.js v22 compatibility issue with tinypool worker termination - this is a tinypool bug, not a vitest config issue
  - Applied Fixes:
    - ✅ Added `pool: 'forks'` to all vitest.config.ts files
    - ✅ Added `poolOptions: { forks: { singleFork: true } }` to minimize worker pool issues
  - Workaround: Use Node.js v20 LTS for CI/CD until tinypool fixes Node.js v22 compatibility
  - Note: **All 218 tests pass** - this is a cleanup issue, not a test failure

## ⚠️ High Priority (Address Soon)

*No high priority issues - previous issues have been resolved.*

## 📝 Medium Priority (Address When Possible)

- [ ] [M4] Fix SDK README package name inconsistency
  - File: `packages/sdk/README.md`
  - Issue: README references `@attn-protocol/core` but actual package name is `@attn/core` (lines 9, 21, 77, 80, 805)
  - Impact: Confusing for developers trying to install dependencies
  - Recommendation: Update all references from `@attn-protocol/core` to `@attn/core` to match actual package.json and code usage

- [ ] [M4] Improve error handling for edge cases in relay connection
  - File: `packages/framework/src/relay/connection.ts`
  - Issue: Some edge cases may not be fully handled (rapid connect/disconnect, timeout edge cases, concurrent connection attempts, race conditions)
  - Impact: Unexpected behavior during connection failures or race conditions
  - Recommendation: Review and improve error handling for all connection states, add guards for concurrent operations

- [ ] [M4] Create root-level examples directory
  - File: Create `examples/` directory at monorepo root
  - Issue: No example code showing full framework usage across packages
  - Impact: Slower onboarding for new developers
  - Recommendation: Add examples directory with sample marketplace implementations using framework + SDK + marketplace

- [ ] [M4] Configure test framework for node package
  - File: `packages/node/package.json`
  - Issue: Jest is listed in devDependencies and test files use Jest, but Jest is not actually used. Test files exist but no test framework is configured.
  - Impact: Node package tests cannot be executed - test files exist but are not runnable
  - Recommendation: Either remove Jest dependencies and test files, or configure a test framework (Vitest recommended for consistency with other TypeScript packages, or Node.js built-in test runner for JavaScript)

## 💡 Low Priority (Nice to Have)

- ✅ [M4] Refactor: Extract shared WebSocket mock to test utilities (2025-01-28)
  - File(s): `packages/framework/src/test/mocks/websocket.mock.ts`, `packages/sdk/src/test/mocks/websocket.mock.ts`
  - Completion Note: Created shared `MockWebSocket` in `packages/core/src/test/mocks/websocket.mock.ts`. Updated framework and SDK test files to import from core package. Deleted duplicate mock files. All tests updated to use shared mock via `vi.hoisted()` pattern.

- ✅ [M4] Refactor: Extract private key decoding to shared utility (2025-01-28)
  - File(s): `packages/marketplace/src/marketplace.ts:117-131`, `packages/sdk/src/sdk.ts:86-116`
  - Completion Note: Created `decode_private_key` utility in `packages/core/src/utils/private-key.ts` with full validation (hex length, format, nsec decoding). Updated marketplace and SDK to import and use shared utility. Added `nostr-tools` dependency to core package. Exported from core package index.

- [ ] [M4] Refactor: Consider splitting Marketplace class
  - File: `packages/marketplace/src/marketplace.ts` (1118 lines)
  - Current: Large class with many responsibilities (hook registration, event handling, storage operations)
  - Proposed: Split into smaller classes: `MarketplaceCore`, `MarketplaceEventHandlers`, `MarketplaceHooks`
  - Benefit: Improved maintainability, easier to test individual components, clearer separation of concerns
  - Effort: High (4+ hours)
  - Risk: High (architectural change, touches many files)

- [ ] [M4] Add performance benchmarks for hook system and event builders
  - File: Create `benchmarks/` directory
  - Issue: No performance metrics for hook execution or event creation
  - Impact: Unknown performance characteristics under load
  - Recommendation: Add benchmarks for hook registration/emission and event builder performance

- [ ] [M4] Add integration tests with mock relay
  - File: Create `test/integration/` directory
  - Issue: No integration tests for full framework lifecycle
  - Impact: Difficult to verify end-to-end behavior
  - Recommendation: Add integration tests using mock Nostr relay

- [ ] [M4] Regular dependency audits for security vulnerabilities
  - File: All package.json files
  - Issue: No regular dependency audit process
  - Impact: Potential security vulnerabilities in dependencies
  - Recommendation: Set up automated dependency audits (npm audit, Dependabot, etc.)

## ✅ Recently Completed

- ✅ [M4] Extract shared WebSocket mock to core package (2025-01-28)
  - File: `packages/core/src/test/mocks/websocket.mock.ts`
  - Created shared MockWebSocket factory function in core package
  - Updated framework and SDK test files to import from core
  - Deleted duplicate mock files from framework and SDK packages
  - All tests now use shared mock via `vi.hoisted()` pattern

- ✅ [M4] Extract private key decoding to core package (2025-01-28)
  - File: `packages/core/src/utils/private-key.ts`
  - Created `decode_private_key` utility with full validation
  - Updated marketplace and SDK to use shared utility
  - Added `nostr-tools` dependency to core package
  - Exported from core package index

## ✅ Recently Completed (Previous)

- ✅ [M4] JSR publishing configuration complete (2025-12-08)
  - File: `packages/*/jsr.json`
  - Added jsr.json to core, sdk, framework, marketplace packages
  - Configured @attn namespace, MIT license, publish.exclude
  - All 4 packages pass JSR dry-run validation

- ✅ [M4] Import extensions updated for JSR (.js → .ts) (2025-12-08)
  - File: All TypeScript source files (39 files, 115 imports)
  - Changed import extensions from .js to .ts for JSR compatibility
  - All tests pass after migration

- ✅ [M4] SDK WebSocket cross-platform support (2025-12-08)
  - File: `packages/sdk/src/relay/publisher.ts`
  - Replaced `ws` (Node.js only) with `isomorphic-ws`
  - SDK now works in Node.js, Deno, and browsers
  - All 84 SDK tests pass

- ✅ [M4] Comprehensive JSDoc documentation (2025-12-08)
  - File: All package index.ts and main class files
  - Added module-level docs with installation instructions
  - Added usage examples to AttnSdk, Attn, Marketplace classes
  - Added @example blocks and @module tags for JSR doc generation

- ✅ [M4] All 218 tests passing (2025-12-08)
  - Core: 7 tests, Framework: 60 tests, SDK: 84 tests, Marketplace: 67 tests
  - All test suites pass before tinypool cleanup crash

- ✅ [M4] Added comprehensive test coverage for marketplace package (67 tests)
  - File: `packages/marketplace/src/hooks/emitter.test.ts`, `packages/marketplace/src/hooks/validation.test.ts`, `packages/marketplace/src/utils/extraction.test.ts`
  - Completion Note: Added comprehensive test coverage with 67 tests total:
    - `emitter.test.ts` - 15 tests for HookEmitter class (register, has, get_registered, emit, emit_required, clear)
    - `validation.test.ts` - 14 tests for hook validation (validate_required_hooks, get_missing_required_hooks, MissingHooksError)
    - `extraction.test.ts` - 38 tests for extraction utilities (extract_block_height, extract_d_tag, build_coordinate, extract_coordinate, extract_*_coordinate, parse_coordinate, parse_content)

- ✅ [M4] Updated vitest configs with pool: 'forks' and singleFork: true
  - File: `packages/core/vitest.config.ts`, `packages/framework/vitest.config.ts`, `packages/sdk/vitest.config.ts`, `packages/marketplace/vitest.config.ts`
  - Completion Note: Added `pool: 'forks'` and `poolOptions: { forks: { singleFork: true } }` to all vitest configs to mitigate Node.js v22 tinypool compatibility issues. Tinypool cleanup crash still occurs but tests pass successfully.

- ✅ [M4] Added marketplace package to monorepo README documentation
  - File: `README.md`
  - Completion Note: Added marketplace package to Quick Links section and Packages table in monorepo README.

- ✅ [M4] Replace console logging with structured logging
  - File: `packages/framework/src/relay/connection.ts`, `packages/framework/src/hooks/emitter.ts`
  - Completion Note: All console.* calls replaced with structured logging using Pino. Added Logger interface and default logger implementation. Logger can be provided via AttnConfig or RelayConnectionConfig. All console calls replaced with structured logging. Only 1 acceptable console.error remains in browser WebSocket compatibility wrapper.

- ✅ [M4] Add structured logging infrastructure
  - File: `packages/framework/src/logger.ts`, `packages/framework/src/attn.ts`, `packages/framework/src/relay/connection.ts`, `packages/framework/src/hooks/emitter.ts`
  - Completion Note: Added Pino dependency, created Logger interface, default logger implementation, and no-op logger for testing. Logger interface exported from framework package.

- ✅ [M4] Add comprehensive test coverage for all TypeScript packages
  - File: `packages/framework`, `packages/sdk`, `packages/core`, `packages/marketplace`
  - Completion Note: Test infrastructure and coverage added across all TypeScript packages using Vitest. Framework has tests for hook emitter, relay connection, and event handling. SDK has tests for event builders, validation, and publishing. Core has tests for constants. Marketplace has tests for emitter, validation, and extraction.

- ✅ [M4] Resolved `any` types in TypeScript codebase
  - File: All TypeScript packages
  - Completion Note: Search for `: any` in TypeScript files returns no matches. Type safety fully achieved.

- ✅ [M4] Updated protocol README with correct hook naming
  - File: `packages/protocol/README.md`
  - Completion Note: Hook naming updated from `before_new_block → on_new_block → after_new_block` to `before_block_event → on_block_event → after_block_event`. All documentation aligned with current implementation.

- ✅ [M4] Event handler factory pattern implemented
  - File: `packages/framework/src/relay/handlers.ts`
  - Completion Note: Implemented `emit_lifecycle_hooks()` utility and `create_simple_handler()` factory function. Reduces code duplication for before/on/after pattern across all event types.

- ✅ [M4] Protocol consistency verified - 0 issues found
  - File: `CONSISTENCY_FINDINGS.md`
  - Completion Note: All packages (core, SDK, framework) verified against ATTN-01 specification. 0 inconsistencies found between specification and implementation.

---

**Last Updated:** 2025-01-28 (Full Code Review Complete)
**Last Verified:** 2025-01-28 - Comprehensive code review completed. All findings documented in CODE_REVIEW_REPORT.md.

**Project Description:** ATTN Protocol monorepo - Protocol specification, framework, SDK, marketplace, node service, and relay for Bitcoin-native attention marketplace

**Key Features:** Protocol specification (ATTN-01), hook-based framework, event builders, validation utilities, marketplace lifecycle layer, Bitcoin ZMQ bridge, Go-based relay

**JSR Publishing:** Ready to publish to JSR under @attn namespace. Run `bunx jsr publish` in each package directory in dependency order: core → sdk → framework → marketplace.

**Production Status:** Production Ready - Code is production-ready with comprehensive test coverage (218 tests pass). JSR publishing configuration complete. CI/CD pipelines may report failure due to tinypool/Node.js v22 cleanup crash, but this is a false negative - tests pass successfully. Use Node.js v20 LTS for CI/CD until tinypool fixes Node.js v22 compatibility.
