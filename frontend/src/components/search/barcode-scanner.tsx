"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image, Loader } from "reicon-react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { toast } from "sonner";
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
import { startPageTransition } from "@/components/layout/navigation-loader";
import type { Product } from "@/types";

const BARCODE_FORMATS = [
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.ITF,
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
  const elementId = `easishop-barcode-file-${readerId}`;
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const confirmAbortRef = useRef<AbortController | null>(null);
  const [scanned, setScanned] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function resetState() {
    confirmAbortRef.current?.abort();
    confirmAbortRef.current = null;
    setScanned(null);
    setError(null);
    setDecoding(false);
    setConfirming(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  useEffect(() => {
    if (!open) {
      confirmAbortRef.current?.abort();
      confirmAbortRef.current = null;
    }
  }, [open]);

  async function decodeFromFile(file: File) {
    setDecoding(true);
    setError(null);
    setScanned(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    let scanner: Html5Qrcode | null = null;
    try {
      scanner = new Html5Qrcode(elementId, {
        formatsToSupport: BARCODE_FORMATS,
        verbose: false,
      });
      const decoded = await scanner.scanFile(file, false);
      const code = decoded.trim();
      if (!code) {
        setError(
          "Couldn't read a barcode in that photo. Try again closer and sharper."
        );
        return;
      }
      setScanned(code);
      track("scan_barcode", { code, method: "photo" });
    } catch {
      setError(
        "Couldn't read a barcode in that photo. Fill the frame with the barcode and try again."
      );
    } finally {
      try {
        await scanner?.clear();
      } catch {
        // ignore
      }
      setDecoding(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    void decodeFromFile(file);
  }

  async function confirmScan() {
    if (!scanned) return;

    confirmAbortRef.current?.abort();
    const controller = new AbortController();
    confirmAbortRef.current = controller;
    setConfirming(true);
    setError(null);

    const code = scanned;

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(code)}&barcode=1`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        throw new Error(`Search failed (${res.status})`);
      }

      const data = (await res.json()) as { products?: Product[] };
      if (controller.signal.aborted) return;

      const results = data.products ?? [];
      resetState();
      onOpenChange(false);
      startPageTransition();
      if (results.length === 1) {
        router.push(`/product/${results[0].id}`);
        return;
      }
      router.push(`/search?q=${encodeURIComponent(code)}&scan=1`);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setConfirming(false);
      toast.error("Couldn't look up that barcode. Try again.");
      setError("Lookup failed — check your connection and try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetState();
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
              : "Take a clear photo of the barcode — we'll read it from the picture."}
          </DialogDescription>
        </DialogHeader>

        <div id={elementId} className="hidden" aria-hidden />

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={onFileChange}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        {scanned ? (
          <div className="space-y-3">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Barcode photo"
                className="mx-auto max-h-40 rounded-2xl object-contain"
              />
            ) : null}
            <div className="rounded-3xl bg-zinc-100 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">Detected code</p>
              <p className="mt-1 font-heading text-xl font-semibold tracking-wide">
                {scanned}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {previewUrl || decoding ? (
              <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-3xl bg-zinc-100">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Selected photo"
                    className="max-h-48 w-full object-contain"
                  />
                ) : null}
                {decoding ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 text-white">
                    <Loader size={24} className="animate-spin" aria-hidden />
                    <p className="text-sm">Reading barcode…</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-3xl bg-zinc-100 px-6 text-center">
                <Camera
                  size={32}
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <p className="text-sm text-muted-foreground">
                  Get close so the bars fill the photo.
                </p>
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                className="h-11 rounded-full px-5"
                disabled={decoding}
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera size={16} aria-hidden />
                Take photo
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full px-5"
                disabled={decoding}
                onClick={() => galleryInputRef.current?.click()}
              >
                <Image size={16} aria-hidden />
                Choose photo
              </Button>
            </div>
          </div>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <DialogFooter>
          {scanned ? (
            <>
              <Button
                variant="ghost"
                className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
                disabled={confirming}
                onClick={resetState}
              >
                Retake
              </Button>
              <Button
                className="h-11 rounded-full px-6"
                disabled={confirming}
                onClick={() => void confirmScan()}
              >
                {confirming ? "Looking up…" : "Find product"}
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
              onClick={() => {
                resetState();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
