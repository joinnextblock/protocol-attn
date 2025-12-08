/**
 * Hook emitter for @attn-protocol/marketplace
 * Manages registration and emission of marketplace lifecycle hooks
 */

import type { HookName, HookHandler, HookHandlers } from './types.ts';

/**
 * Hook emitter class
 * Manages hook registration and emission
 */
export class HookEmitter {
  private handlers: Map<string, Function> = new Map();

  /**
   * Register a hook handler
   * @param name - Hook name
   * @param handler - Handler function
   */
  register<T extends HookName>(name: T, handler: HookHandler<T>): void {
    this.handlers.set(name, handler);
  }

  /**
   * Check if a hook is registered
   * @param name - Hook name
   */
  has(name: string): boolean {
    return this.handlers.has(name);
  }

  /**
   * Get all registered hook names
   */
  get_registered(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Emit a hook and return the result
   * @param name - Hook name
   * @param context - Hook context
   * @returns Handler result or undefined if no handler registered
   */
  async emit<T extends HookName>(
    name: T,
    context: Parameters<HookHandlers[T]>[0]
  ): Promise<ReturnType<HookHandlers[T]> | undefined> {
    const handler = this.handlers.get(name);
    if (!handler) {
      return undefined;
    }
    return await handler(context) as ReturnType<HookHandlers[T]>;
  }

  /**
   * Emit a required hook - throws if handler not registered
   * @param name - Hook name
   * @param context - Hook context
   * @returns Handler result
   */
  async emit_required<T extends HookName>(
    name: T,
    context: Parameters<HookHandlers[T]>[0]
  ): Promise<ReturnType<HookHandlers[T]>> {
    const handler = this.handlers.get(name);
    if (!handler) {
      throw new Error(`Required hook '${name}' is not registered`);
    }
    return await handler(context) as ReturnType<HookHandlers[T]>;
  }

  /**
   * Clear all registered handlers
   */
  clear(): void {
    this.handlers.clear();
  }
}
