"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
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
import { getProductsByBarcode, searchProducts } from "@/lib/products";

export function BarcodeScanner({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [scanned, setScanned] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scanning = useRef(false);

  useEffect(() => {
    if (!open) {
      stopScanner();
      setScanned(null);
      setError(null);
      return;
    }

    let cancelled = false;

    async function start() {
      try {
        await new Promise((r) => setTimeout(r, 250));
        if (cancelled) return;
        const scanner = new Html5Qrcode("easishop-barcode-reader");
        scannerRef.current = scanner;
        scanning.current = true;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: { width: 240, height: 140 } },
          (decoded) => {
            if (!scanning.current) return;
            scanning.current = false;
            setScanned(decoded);
            track("scan_barcode", { code: decoded });
            stopScanner();
          },
          () => undefined
        );
      } catch {
        setError(
          "Camera access is needed to scan. You can still search by typing."
        );
      }
    }

    start();
    return () => {
      cancelled = true;
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function stopScanner() {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    scanning.current = false;
    if (!scanner) return;
    try {
      if (scanner.isScanning) await scanner.stop();
      await scanner.clear();
    } catch {
      // ignore cleanup errors
    }
  }

  function confirmScan() {
    if (!scanned) return;
    const byBarcode = getProductsByBarcode(scanned);
    const fallback = searchProducts(scanned);
    const results = byBarcode.length ? byBarcode : fallback;
    onOpenChange(false);
    if (results.length === 1) {
      router.push(`/product/${results[0].id}`);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(scanned)}&scan=1`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div className="overflow-hidden rounded-lg border border-hairline bg-black">
            <div id="easishop-barcode-reader" className="min-h-[240px] w-full" />
          </div>
        ) : (
          <div className="rounded-lg border border-hairline bg-muted px-4 py-6 text-center">
            <p className="text-sm text-mute">Detected code</p>
            <p className="mt-1 font-heading text-xl font-semibold tracking-wide">
              {scanned}
            </p>
          </div>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter className="gap-2 sm:gap-0">
          {scanned ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setScanned(null);
                  setError(null);
                  onOpenChange(false);
                  setTimeout(() => onOpenChange(true), 50);
                }}
              >
                Scan again
              </Button>
              <Button className="bg-brand hover:bg-brand/90" onClick={confirmScan}>
                Find product
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
