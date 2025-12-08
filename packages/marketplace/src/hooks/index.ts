/**
 * Hooks exports for @attn-protocol/marketplace
 */

export { HookEmitter } from './emitter.js';
export {
  validate_required_hooks,
  get_missing_required_hooks,
  MissingHooksError,
} from './validation.js';
export {
  REQUIRED_HOOKS,
  OPTIONAL_HOOKS,
} from './types.js';
export type {
  RequiredHook,
  OptionalHook,
  HookName,
  HookHandler,
  HookHandlers,
} from './types.js';
