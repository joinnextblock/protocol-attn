import { PROMOTION_KIND } from "../../../../promo-commons/constants";
import type { Event } from "nostr-tools";

export const get_promotion_metrics = (events: Event[] = []) => {
  const promotion_events = events.filter((event: Event) => event.kind === PROMOTION_KIND);
  const total_promotion = promotion_events.reduce((acc, event: Event) => {
    const { duration } = JSON.parse(event.content);
    return acc + duration;
  }, 0);
  const avgerage_promotion_price = promotion_events.reduce((acc, event: Event) => {
    const { sats_per_second } = JSON.parse(event.content);
    return acc + sats_per_second;
  }, 0) / promotion_events.length;
  return {
    count: promotion_events.length,
    total_seconds: total_promotion || 0,
    average_sats_per_second: Math.floor(avgerage_promotion_price) || 0,
  };
}