"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import type { Product } from "@/types";

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.QR_CODE,
];

export function BarcodeScanner({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const readerId = useId().replace(/:/g, "");
  const elementId = `easishop-barcode-reader-${readerId}`;
  const [scanned, setScanned] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanning = useRef(false);
  const handled = useRef(false);

  useEffect(() => {
    if (!open || scanned) {
      void stopScanner();
      return;
    }

    let cancelled = false;
    handled.current = false;

    async function start() {
      setStarting(true);
      setError(null);

      // Wait for dialog layout so the reader has real dimensions
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      const el = document.getElementById(elementId);
      if (!el) {
        setError("Scanner failed to load. Close and try again.");
        setStarting(false);
        return;
      }

      try {
        const scanner = new Html5Qrcode(elementId, {
          formatsToSupport: BARCODE_FORMATS,
          verbose: false,
        });
        scannerRef.current = scanner;
        scanning.current = true;

        const config = {
          fps: 12,
          // Wide strip — grocery barcodes are 1D, not square QR
          qrbox: (viewWidth: number, viewHeight: number) => {
            const width = Math.min(Math.floor(viewWidth * 0.92), 360);
            const height = Math.min(Math.floor(viewHeight * 0.28), 120);
            return {
              width: Math.max(width, 200),
              height: Math.max(height, 80),
            };
          },
          aspectRatio: 1.777778,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        };

        const onSuccess = (decoded: string) => {
          if (!scanning.current || handled.current) return;
          handled.current = true;
          scanning.current = false;
          const code = decoded.trim();
          setScanned(code);
          track("scan_barcode", { code });
          void stopScanner();
        };

        try {
          await scanner.start(
            { facingMode: "environment" },
            config,
            onSuccess,
            () => undefined
          );
        } catch {
          // Desktop / no rear camera — fall back to any camera
          await scanner.start(
            { facingMode: "user" },
            config,
            onSuccess,
            () => undefined
          );
        }
      } catch {
        if (!cancelled) {
          setError(
            "Camera access is needed to scan. Allow the camera, or search by typing."
          );
        }
      } finally {
        if (!cancelled) setStarting(false);
      }
    }

    void start();

    return () => {
      cancelled = true;
      void stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, scanned, elementId]);

  async function stopScanner() {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    scanning.current = false;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
    } catch {
      // ignore
    }
    try {
      await scanner.clear();
    } catch {
      // ignore
    }
  }

  async function confirmScan() {
    if (!scanned) return;
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(scanned)}&barcode=1`
      );
      const data = (await res.json()) as { products: Product[] };
      const results = data.products ?? [];
      onOpenChange(false);
      if (results.length === 1) {
        router.push(`/product/${results[0].id}`);
        return;
      }
      router.push(`/search?q=${encodeURIComponent(scanned)}&scan=1`);
    } catch {
      onOpenChange(false);
      router.push(`/search?q=${encodeURIComponent(scanned)}&scan=1`);
    }
  }

  function restartScan() {
    setScanned(null);
    setError(null);
    handled.current = false;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) void stopScanner();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {scanned ? "Confirm barcode" : "Scan a barcode"}
          </DialogTitle>
          <DialogDescription>
            {scanned
              ? "Does this look right? We'll find matching products."
              : "Point your camera at the product barcode."}
          </DialogDescription>
        </DialogHeader>

        {!scanned ? (
          <div className="overflow-hidden rounded-3xl bg-black">
            <div
              id={elementId}
              className="min-h-[260px] w-full overflow-hidden [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
            />
            {starting ? (
              <p className="px-4 py-3 text-center text-xs text-white/70">
                Starting camera…
              </p>
            ) : null}
          </div>
        ) : (
          <div className="rounded-3xl bg-zinc-100 px-4 py-6 text-center">
            <p className="text-sm text-muted-foreground">Detected code</p>
            <p className="mt-1 font-heading text-xl font-semibold tracking-wide">
              {scanned}
            </p>
          </div>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          {scanned ? (
            <>
              <Button
                variant="ghost"
                className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
                onClick={restartScan}
              >
                Scan again
              </Button>
              <Button
                className="h-11 rounded-full px-6"
                onClick={confirmScan}
              >
                Find product
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
