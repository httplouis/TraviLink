"use client";

import { useEffect, useState } from "react";
import SettingsView from "@/components/driver/settings/SettingsView";

const LS_KEY = "travilink_driver_settings";

/* ----------------------------- Types & Defaults ---------------------------- */
export type DriverSettings = {
  // notifications
  notifyAssignments: boolean;
  notifyChanges: boolean;
  notifyMaintenance: boolean;
  reminderMinutes: 5 | 10 | 15 | 30;

  // status/workday
  defaultStatusOnOpen: "Available" | "Off Duty";
  autoOnTripOnBegin: boolean;
  promptOffDutyEOD: boolean;

  // location/privacy
  shareLiveLocation: boolean;
  bgLocationWhileOnTrip: boolean;
  locationVisibility: "dispatcher" | "dispatcher_requester";

  // display
  language: "en" | "ph";
  theme: "system" | "light" | "dark";
  timeFormat: "12h" | "24h";
  dateMode: "local"; // fixed for now
};

export const DEFAULT_SETTINGS: DriverSettings = {
  notifyAssignments: true,
  notifyChanges: true,
  notifyMaintenance: false,
  reminderMinutes: 15,

  defaultStatusOnOpen: "Available",
  autoOnTripOnBegin: true,
  promptOffDutyEOD: true,

  shareLiveLocation: false,
  bgLocationWhileOnTrip: true,
  locationVisibility: "dispatcher",

  language: "ph",
  theme: "system",
  timeFormat: "24h",
  dateMode: "local",
};

/* --------------------------------- Page ---------------------------------- */
export default function DriverSettingsPage() {
  const [settings, setSettings] = useState<DriverSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // load on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<DriverSettings>;
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {}
  }, []);

  // generic setter
  const update = <K extends keyof DriverSettings>(k: K, v: DriverSettings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  // save
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // simulate API
      await new Promise((r) => setTimeout(r, 500));
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
      setSavedAt(new Date().toLocaleString());
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsView
      formId="driverSettingsForm"
      settings={settings}
      saving={saving}
      savedAt={savedAt}
      onChange={update}
      onSubmit={onSubmit}
    />
  );
}
