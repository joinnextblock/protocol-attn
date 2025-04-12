import { get_metrics_all_time } from "./get-metrics-all-time";
import { get_metrics_last_interval } from "./get-metrics-last-interval";
import { RelayHandler } from "../../../promo-commons/nostr/relay-handler";
import { logger_dvmcp } from "../../../promo-commons/logger";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import pino from "pino";

export type GetMetricsHandlerArgs = {
  pubkey: string,
  since: number,
  until: number,
}

export const get_metrics_handler = async (
  { pubkey,
    since,
    until
  }: GetMetricsHandlerArgs,
  { relays }: { relays: string[] }
): Promise<CallToolResult> => {
  console.log({ pubkey, since, until });

  try {
    const relay_handler = new RelayHandler(relays);
    const logger = pino();

    const metrics_all_time = await get_metrics_all_time({ pubkey }, { relay_handler, logger });
    const metrics_last_interval = await get_metrics_last_interval({ pubkey, since, until }, { relay_handler, logger });

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            all_time: metrics_all_time,
            last_interval: metrics_last_interval,
          }),
        }
      ],
    };
  } catch (error) {
    console.error('Echo failed:', error);
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }
      ],
      isError: true,
    };
  }
}