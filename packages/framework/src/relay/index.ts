/**
 * Relay module exports
 */

// Main connection manager
export { RelayConnection } from './connection.ts';
export type { RelayConnectionConfig } from './connection.ts';

// Sub-modules (for advanced usage)
export { AuthHandler } from './auth.ts';
export type { AuthState, AuthConfig, AuthResult } from './auth.ts';

export { SubscriptionManager } from './subscriptions.ts';
export type { SubscriptionFilter, SubscriptionConfig } from './subscriptions.ts';

export { EventHandlers } from './handlers.ts';
export type { EventHandlerConfig } from './handlers.ts';

// WebSocket utilities
export { get_websocket_impl, WS_READY_STATE } from './websocket.ts';
export type { WebSocketWithOn } from './websocket.ts';

// Publisher for writing events
export { Publisher } from './publisher.ts';
export type { PublisherConfig, WriteRelay, PublishResults } from './publisher.ts';

