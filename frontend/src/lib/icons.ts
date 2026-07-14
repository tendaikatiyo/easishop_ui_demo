import type { ComponentType, SVGProps } from "react";

/** App-wide icon component shape (reicon-react compatible). */
export type AppIcon = ComponentType<
  SVGProps<SVGSVGElement> & {
    size?: number | string;
    color?: string;
    weight?: "Outline" | "Filled";
    strokeWidth?: number | string;
  }
>;
