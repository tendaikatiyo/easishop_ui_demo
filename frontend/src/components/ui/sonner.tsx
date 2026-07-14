"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CheckCircle,
  CircleInfo,
  Loader,
  TriangleWarning,
  XCircle,
} from "reicon-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position={props.position ?? "top-center"}
      icons={{
        success: <CheckCircle size={18} aria-hidden />,
        info: <CircleInfo size={18} aria-hidden />,
        warning: <TriangleWarning size={18} aria-hidden />,
        error: <XCircle size={18} aria-hidden />,
        loading: <Loader size={18} className="animate-spin" aria-hidden />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group toast !flex !items-center !gap-3 !rounded-[32px] !border-0 !bg-white !px-5 !py-4 !shadow-xl !text-foreground",
          title: "!font-heading !text-sm !font-medium !text-foreground",
          description: "!text-sm !font-normal !text-muted-foreground",
          icon: "!size-5 shrink-0",
          actionButton:
            "!h-9 !shrink-0 !rounded-full !border-0 !bg-[var(--brand-green)] !px-4 !text-xs !font-medium !text-white !shadow-none hover:!bg-[var(--brand-green)]/90",
          cancelButton:
            "!h-9 !shrink-0 !rounded-full !border-0 !bg-zinc-100 !px-4 !text-xs !font-medium !text-foreground !shadow-none hover:!bg-zinc-200",
          closeButton:
            "!left-auto !right-3 !top-1/2 !size-8 !-translate-y-1/2 !rounded-full !border-0 !bg-zinc-100 !text-foreground hover:!bg-zinc-200",
          loading: "!bg-white",
          success: "!bg-white",
          error: "!bg-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
