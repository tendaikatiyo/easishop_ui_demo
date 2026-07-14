"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function FeedbackDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  function onSubmit() {
    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Tell us a bit about your feedback.");
      return;
    }
    setMessage("");
    setEmail("");
    onOpenChange(false);
    toast.success("Thanks — we’ve got your feedback.");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setMessage("");
          setEmail("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send feedback</DialogTitle>
          <DialogDescription>
            Ideas, bugs, or anything that would make EasiShop better.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What’s on your mind?"
            rows={4}
            className="w-full resize-none rounded-[24px] border-0 bg-zinc-100 px-5 py-3.5 text-sm shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional)"
            className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button className="h-11 rounded-full px-6" onClick={onSubmit}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
