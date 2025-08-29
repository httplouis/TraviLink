"use client";

import { useState } from "react";
import StatusView from "@/components/driver/status/StatusView";
import type { DriverStatus } from "@/app/types/driver";
// import { saveDriverStatus } from "@/lib/data/driver"; // optional later

export default function DriverStatusPage() {
  const [status, setStatus] = useState<DriverStatus>("Available");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      // await saveDriverStatus(userId, status);
      // toast.success("Status updated");
    } finally {
      setSaving(false);
    }
  }

  return <StatusView status={status} onChange={setStatus} onSave={handleSave} />;
}
