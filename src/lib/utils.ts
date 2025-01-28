import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function parseServerResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}
