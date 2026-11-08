"use client";
import { toast } from "sonner";

type Status = "success" | "error" | "warning" | "info";

export interface NotifyOptions {
  title: string;
  description?: string;
  status?: Status;
  duration?: number;
}

/**
 * Thin wrapper around sonner that keeps the call shape of Chakra's `useToast()`
 * ({ title, description, status, duration }) used throughout the app.
 */
export function notify({ title, description, status = "info", duration = 5000 }: NotifyOptions) {
  return toast[status](title, { description, duration });
}
