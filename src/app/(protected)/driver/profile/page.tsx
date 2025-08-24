"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader, PageBody } from "@/components/common/Page";
import { DRIVER as DRIVER_SEED } from "@/lib/mock";

/* ------------------------------------------------------------------ */
/* Theme helpers (styled like Dashboard/Maintenance)                   */
/* ------------------------------------------------------------------ */

const card = "rounded-2xl bg-white ring-1 ring-neutral-200/70 shadow-sm";
const section = `${card} p-5`;
const fieldLabel = "text-sm font-medium text-neutral-700";
const fieldInput =
  "w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7a0019]/20 focus:border-[#7a0019]/50";
const help = "text-xs text-neutral-500";

/* ------------------------------------------------------------------ */
/* Types / seed / storage                                             */
/* ------------------------------------------------------------------ */

type DriverProfile = {
  firstName: string;
  lastName: string;
  email?: string;
  campus: string;
  dept?: string;
  phone?: string;
  license: string;
  canDrive: string[];
  badges?: string[];
  avatar?: string;
  notifyEmail: boolean;
  notifyPush: boolean;
};

const LS_KEY = "travilink_driver_profile";

function splitName(full?: string) {
  if (!full) return { firstName: "", lastName: "" };
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.slice(-1)[0] };
}

function seedFromMock(): DriverProfile {
  const { firstName, lastName } = splitName(DRIVER_SEED?.name);
  return {
    firstName,
    lastName,
    email: (DRIVER_SEED as any)?.email ?? "",
    campus: DRIVER_SEED?.campus ?? "",
    dept: DRIVER_SEED?.dept ?? "",
    phone: DRIVER_SEED?.phone ?? "",
    license: DRIVER_SEED?.license ?? "",
    canDrive: Array.isArray(DRIVER_SEED?.canDrive) ? DRIVER_SEED.canDrive : [],
    badges: Array.isArray(DRIVER_SEED?.badges) ? DRIVER_SEED.badges : [],
    avatar: undefined,
    notifyEmail: true,
    notifyPush: true,
  };
}

function loadProfile(): DriverProfile {
  if (typeof window === "undefined") return seedFromMock();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedFromMock();
    return { ...seedFromMock(), ...(JSON.parse(raw) as DriverProfile) };
  } catch {
    return seedFromMock();
  }
}

function saveProfile(p: DriverProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(p));
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function DriverProfilePage() {
  const [profile, setProfile] = useState<DriverProfile>(seedFromMock());
  const [password, setPassword] = useState({ new: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => setProfile(loadProfile()), []);

  const formId = "driverProfileForm";
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initials = useMemo(() => {
    const f = profile.firstName?.[0] ?? "";
    const l = profile.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "D";
  }, [profile.firstName, profile.lastName]);

  const update = <K extends keyof DriverProfile>(key: K, value: DriverProfile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const toggleCanDrive = (v: string) =>
    setProfile((p) => {
      const has = p.canDrive.includes(v);
      return { ...p, canDrive: has ? p.canDrive.filter((x) => x !== v) : [...p.canDrive, v] };
    });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!profile.firstName.trim()) e.firstName = "Required.";
    if (!profile.lastName.trim()) e.lastName = "Required.";
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      e.email = "Invalid email.";
    if (!profile.campus.trim()) e.campus = "Required.";
    if (!profile.license.trim()) e.license = "License is required.";
    if (password.new || password.confirm) {
      if (password.new.length < 8) e.passwordNew = "Min 8 characters.";
      if (password.new !== password.confirm) e.passwordConfirm = "Passwords do not match.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 650)); // simulate API
    saveProfile(profile);
    setSaving(false);
    setSavedAt(new Date().toLocaleString());
    setPassword({ new: "", confirm: "" });
  }

  const onPickAvatar = () => fileRef.current?.click();
  const onAvatarChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("avatar", String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your driver details and preferences."
        actions={
          <button
            type="submit"
            form={formId}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <PageBody>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          {/* LEFT: FORM (cards like Maintenance) */}
          <form id={formId} onSubmit={onSubmit} className="space-y-5 min-w-0">
            {/* Personal */}
            <section className={section}>
              <h2 className="mb-3 font-medium">Personal Information</h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-200/70"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-neutral-100 text-neutral-700 grid place-items-center text-lg font-semibold ring-1 ring-neutral-200/70">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={onPickAvatar}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
                  >
                    Change photo
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onAvatarChange(e.target.files?.[0])}
                  />
                  <div className={help}>JPG/PNG, up to ~2MB.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>First name *</label>
                  <input
                    className={fieldInput}
                    value={profile.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Last name *</label>
                  <input
                    className={fieldInput}
                    value={profile.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Email</label>
                  <input
                    className={fieldInput}
                    placeholder="you@example.com"
                    value={profile.email ?? ""}
                    onChange={(e) => update("email", e.target.value)}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Organization */}
            <section className={section}>
              <h2 className="mb-3 font-medium">Organization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>Campus *</label>
                  <input
                    className={fieldInput}
                    value={profile.campus}
                    onChange={(e) => update("campus", e.target.value)}
                    placeholder="e.g., Lucena"
                  />
                  {errors.campus && <p className="mt-1 text-xs text-red-600">{errors.campus}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Department</label>
                  <input
                    className={fieldInput}
                    value={profile.dept ?? ""}
                    onChange={(e) => update("dept", e.target.value)}
                    placeholder="e.g., Transport"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Phone</label>
                  <input
                    className={fieldInput}
                    value={profile.phone ?? ""}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="09XX XXX XXXX"
                  />
                </div>
              </div>
            </section>

            {/* License & Capability */}
            <section className={section}>
              <h2 className="mb-3 font-medium">License & Capability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>License number *</label>
                  <input
                    className={fieldInput}
                    value={profile.license}
                    onChange={(e) => update("license", e.target.value)}
                    placeholder="e.g., DL-1234-5678"
                  />
                  {errors.license && <p className="mt-1 text-xs text-red-600">{errors.license}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Can drive</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Bus", "Van", "Car", "Truck"].map((v) => {
                      const active = profile.canDrive.includes(v);
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => toggleCanDrive(v)}
                          className={
                            active
                              ? "rounded-full bg-[#7a0019] text-white text-xs px-3 py-1 shadow-sm"
                              : "rounded-full bg-neutral-100 text-neutral-800 text-xs px-3 py-1 ring-1 ring-neutral-200/70"
                          }
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                  <div className={`${help} mt-1`}>Click to toggle. Saved as a list.</div>
                </div>
              </div>
            </section>

            {/* Preferences */}
            <section className={section}>
              <h2 className="mb-3 font-medium">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={profile.notifyEmail}
                    onChange={(e) => update("notifyEmail", e.target.checked)}
                  />
                  Email notifications
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={profile.notifyPush}
                    onChange={(e) => update("notifyPush", e.target.checked)}
                  />
                  Push notifications
                </label>
              </div>
              <p className={`${help} mt-2`}>
                You’ll receive updates about request approvals, schedule changes, and reminders.
              </p>
            </section>

            {/* Security */}
            <section className={section}>
              <h2 className="mb-3 font-medium">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>New password</label>
                  <input
                    type="password"
                    className={fieldInput}
                    value={password.new}
                    onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))}
                    placeholder="Min 8 characters"
                  />
                  {errors.passwordNew && <p className="mt-1 text-xs text-red-600">{errors.passwordNew}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Confirm new password</label>
                  <input
                    type="password"
                    className={fieldInput}
                    value={password.confirm}
                    onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                  />
                  {errors.passwordConfirm && (
                    <p className="mt-1 text-xs text-red-600">{errors.passwordConfirm}</p>
                  )}
                </div>
              </div>
              <p className={`${help} mt-2`}>Leave blank to keep your current password.</p>
            </section>
          </form>

          {/* RIGHT: Summary card styled like your maroon profile panel */}
          <aside className="space-y-5">
            <section className="rounded-2xl bg-[#7A0E20] text-white relative overflow-hidden p-5">
              {/* watermark */}
              <img
                src="/euwhite.png"
                alt=""
                className="pointer-events-none select-none absolute right-[-24px] top-[-24px] h-40 w-40 opacity-15"
              />
              <div className="flex items-center gap-3">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center font-semibold">
                    {initials}
                  </div>
                )}
                <div>
                  <div className="text-lg font-semibold">
                    {profile.firstName || profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`.trim()
                      : "Driver"}
                  </div>
                  <div className="text-xs opacity-90">Driver • {profile.campus || "—"}</div>
                </div>
              </div>
              {savedAt && <div className="mt-3 text-xs opacity-90">Last saved: {savedAt}</div>}
            </section>

            <section className={section}>
              <h3 className="font-medium mb-2">Account tips</h3>
              <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                <li>Keep your license number updated for dispatch validation.</li>
                <li>Use “Can drive” so schedulers assign the right vehicle.</li>
                <li>Enable notifications so you don’t miss trip updates.</li>
              </ul>
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
