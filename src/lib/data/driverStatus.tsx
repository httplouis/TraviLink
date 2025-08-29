import { CheckCircle2, Truck, Moon, LogOut, Stethoscope } from "lucide-react";
import type { DriverStatus } from "@/app/types/driver";

export const tone = (s: DriverStatus) =>
  s === "Available" ? "bg-green-100 text-green-700"
: s === "On Trip"   ? "bg-sky-100 text-sky-700"
: s === "Off Duty"  ? "bg-neutral-100 text-neutral-700"
: s === "Sick"      ? "bg-amber-100 text-amber-700"
:                     "bg-rose-100 text-rose-700";

export function StatusIcon({ s }: { s: DriverStatus }) {
  if (s === "Available") return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  if (s === "On Trip")   return <Truck className="h-5 w-5 text-sky-600" />;
  if (s === "Off Duty")  return <Moon className="h-5 w-5 text-neutral-600" />;
  if (s === "Sick")      return <Stethoscope className="h-5 w-5 text-amber-600" />;
  return <LogOut className="h-5 w-5 text-rose-600" />;
}
