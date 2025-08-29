import type { Status } from "@/app/types/schedule";

export function statusTone(s: Status) {
  switch (s) {
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Assigned":
      return "bg-blue-100 text-blue-700";
  }
}
