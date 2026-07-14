import { pushEvent } from "@/lib/storage";
import type { AnalyticsEvent } from "@/types";

export type TrackEventName =
  | "search"
  | "view_product"
  | "add_to_list"
  | "remove_from_list"
  | "open_retailer"
  | "scan_barcode"
  | "toggle_alert"
  | "view_category"
  | "view_deals"
  | "create_list";

export function track(
  event: TrackEventName,
  props?: Record<string, unknown>
): void {
  const payload: AnalyticsEvent = {
    id: `evt-${Math.random().toString(36).slice(2, 10)}`,
    event,
    props,
    at: new Date().toISOString(),
  };

  if (typeof console !== "undefined") {
    console.info("[easishop:track]", payload.event, payload.props ?? {});
  }

  pushEvent(payload);
}
