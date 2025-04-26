import { RelayHandler } from '@dvmcp/commons/nostr/relay-handler';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import pino from 'pino';
import { TOOL_REQUEST_KIND } from '@dvmcp/commons/constants';
import type { KeyManager } from '@dvmcp/commons/nostr/key-manager';
import type { Filter } from 'nostr-tools';

export const get_performance_by_function_name_handler: GetPerformanceByFunctionNameHandler = async (
  { function_name }: GetPerformanceByFunctionNameHandlerParameters,
  { key_manager, relays }: GetPerformanceByFunctionNameHandlerDependencies
): Promise<CallToolResult> => {
  try {
    const relay_handler = new RelayHandler(relays);
    const logger = pino();

    const filter: Filter = {
      kinds: [TOOL_REQUEST_KIND],
      '#p': [key_manager.getPublicKey()],
    };
    logger.debug({ filter });

    const events = await relay_handler.queryEvents(filter);

    const invocations = events.filter(
      ({ kind, content }) =>
        kind === TOOL_REQUEST_KIND && JSON.parse(content).name === function_name
    );

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            all_time: {
              invocations: invocations.length,
            },
          }),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    };
  }
};

export type GetPerformanceByFunctionNameHandlerParameters = {
  function_name: string;
};

export type GetPerformanceByFunctionNameHandlerDependencies = {
  relays: string[];
  key_manager: KeyManager;
};

export type GetPerformanceByFunctionNameHandler = (
  parameters: GetPerformanceByFunctionNameHandlerParameters,
  dependencies: GetPerformanceByFunctionNameHandlerDependencies
) => Promise<CallToolResult>;
