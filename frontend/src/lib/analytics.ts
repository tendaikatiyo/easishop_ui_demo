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
  | "create_list"
  | "toggle_unavailable_retailers"
  | "onboard_shown"
  | "onboard_skipped"
  | "onboard_cta_search"
  | "onboard_cta_deals"
  | "onboard_aha_compare"
  | "onboard_list_prompt_shown"
  | "onboard_list_prompt_accepted"
  | "onboard_list_prompt_skipped"
  | "onboard_alert_prompt_shown"
  | "onboard_alert_prompt_accepted"
  | "onboard_alert_prompt_skipped"
  | "onboard_cta_signup"
  | "onboard_cta_signin"
  | "sign_up"
  | "sign_in"
  | "sign_out";

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
