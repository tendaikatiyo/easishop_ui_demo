"use client";

import type { AppIcon } from "@/lib/icons";
import {
  BasketShopping,
  Bath,
  Brush2,
  Cake2,
  Cookie,
  Cup,
  Droplet,
  FoodTray,
  Gift,
  HeartPulse,
  Home,
  Leaf,
  Milk2,
  Package,
  Perfume,
  Phone,
  Snowflake,
  Sparkle3,
  Sparkles,
  Tshirt,
  Wineglass,
} from "reicon-react";

const CATEGORY_ICONS: Record<string, AppIcon> = {
  toiletries: Droplet,
  household: Home,
  kids: Cookie,
  "wine-bubbles": Wineglass,
  cleaning: Sparkles,
  "fruits-vegetables": Leaf,
  "meat-poultry-fish": FoodTray,
  bakery: Cake2,
  "milk-dairy": Milk2,
  pantry: Package,
  "beverages-juices": Cup,
  deli: BasketShopping,
  frozen: Snowflake,
  fragrance: Perfume,
  skincare: HeartPulse,
  makeup: Brush2,
  haircare: Sparkle3,
  "mens-grooming": Tshirt,
  "bath-and-body": Bath,
  "kids-baby": Gift,
  cellphones: Phone,
};

const DEFAULT_CATEGORY_ICON: AppIcon = Package;

export function getCategoryIcon(slug: string): AppIcon {
  return CATEGORY_ICONS[slug] ?? DEFAULT_CATEGORY_ICON;
}
