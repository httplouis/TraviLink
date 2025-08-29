import { PageHeader, PageBody } from "@/components/common/Page";
import type { DriverProfile } from "@/app/types/driverProfile";
import { useMemo } from "react";

const card = "rounded-2xl bg-white ring-1 ring-neutral-200/70 shadow-sm";
const section = `${card} p-5`;
const fieldLabel = "text-sm font-medium text-neutral-700";
const fieldInput =
  "w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#7a0019]/20 focus:border-[#7a0019]/50";
const help = "text-xs text-neutral-500";

export type PasswordState = { new: string; confirm: string };

type Props = {
  formId?: string;
  profile: DriverProfile;
  errors: Record<string, string>;
  password: PasswordState;
  saving: boolean;
  savedAt: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;

  onSubmit: (e: React.FormEvent) => void;
  onChange: <K extends keyof DriverProfile>(key: K, value: DriverProfile[K]) => void;
  onToggleCanDrive: (vehicle: string) => void;
  onPasswordChange: (patch: Partial<PasswordState>) => void;
  onAvatarFile: (file?: File) => void;
};

export default function ProfileView({
  formId = "driverProfileForm",
  profile, errors, password, saving, savedAt,
  fileInputRef, onSubmit, onChange, onToggleCanDrive, onPasswordChange, onAvatarFile,
}: Props) {

  const initials = useMemo(() => {
    const f = profile.firstName?.[0] ?? "";
    const l = profile.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "D";
  }, [profile.firstName, profile.lastName]);

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your driver details and preferences."
        actions={
          <button type="submit" form={formId} disabled={saving} className="btn btn-primary">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <PageBody>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
          {/* LEFT: FORM */}
          <form id={formId} onSubmit={onSubmit} className="space-y-5 min-w-0">
            {/* Personal */}
            <section className={section}>
              <h2 className="mb-3 font-medium">Personal Information</h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar preview"
                      className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-200/70" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-neutral-100 text-neutral-700 grid place-items-center text-lg font-semibold ring-1 ring-neutral-200/70">
                      {initials}
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <button type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50">
                    Change photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onAvatarFile(e.target.files?.[0])}
                  />
                  <div className={help}>JPG/PNG, up to ~2MB.</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>First name *</label>
                  <input className={fieldInput} value={profile.firstName}
                    onChange={(e) => onChange("firstName", e.target.value)} />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Last name *</label>
                  <input className={fieldInput} value={profile.lastName}
                    onChange={(e) => onChange("lastName", e.target.value)} />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Email</label>
                  <input className={fieldInput} placeholder="you@example.com" value={profile.email ?? ""}
                    onChange={(e) => onChange("email", e.target.value)} />
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
                  <input className={fieldInput} value={profile.campus}
                    onChange={(e) => onChange("campus", e.target.value)} placeholder="e.g., Lucena" />
                  {errors.campus && <p className="mt-1 text-xs text-red-600">{errors.campus}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Department</label>
                  <input className={fieldInput} value={profile.dept ?? ""}
                    onChange={(e) => onChange("dept", e.target.value)} placeholder="e.g., Transport" />
                </div>
                <div className="md:col-span-2">
                  <label className={fieldLabel}>Phone</label>
                  <input className={fieldInput} value={profile.phone ?? ""}
                    onChange={(e) => onChange("phone", e.target.value)} placeholder="09XX XXX XXXX" />
                </div>
              </div>
            </section>

            {/* License & Capability */}
            <section className={section}>
              <h2 className="mb-3 font-medium">License & Capability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={fieldLabel}>License number *</label>
                  <input className={fieldInput} value={profile.license}
                    onChange={(e) => onChange("license", e.target.value)} placeholder="e.g., DL-1234-5678" />
                  {errors.license && <p className="mt-1 text-xs text-red-600">{errors.license}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Can drive</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Bus", "Van", "Car", "Truck"].map((v) => {
                      const active = profile.canDrive.includes(v);
                      return (
                        <button key={v} type="button"
                          onClick={() => onToggleCanDrive(v)}
                          className={active
                            ? "rounded-full bg-[#7a0019] text-white text-xs px-3 py-1 shadow-sm"
                            : "rounded-full bg-neutral-100 text-neutral-800 text-xs px-3 py-1 ring-1 ring-neutral-200/70"}>
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
                  <input type="checkbox" checked={profile.notifyEmail}
                    onChange={(e) => onChange("notifyEmail", e.target.checked)} />
                  Email notifications
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={profile.notifyPush}
                    onChange={(e) => onChange("notifyPush", e.target.checked)} />
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
                  <input type="password" className={fieldInput} value={password.new}
                    onChange={(e) => onPasswordChange({ new: e.target.value })}
                    placeholder="Min 8 characters" />
                  {errors.passwordNew && <p className="mt-1 text-xs text-red-600">{errors.passwordNew}</p>}
                </div>
                <div>
                  <label className={fieldLabel}>Confirm new password</label>
                  <input type="password" className={fieldInput} value={password.confirm}
                    onChange={(e) => onPasswordChange({ confirm: e.target.value })} />
                  {errors.passwordConfirm && <p className="mt-1 text-xs text-red-600">{errors.passwordConfirm}</p>}
                </div>
              </div>
              <p className={`${help} mt-2`}>Leave blank to keep your current password.</p>
            </section>
          </form>

          {/* RIGHT: summary card */}
          <aside className="space-y-5">
            <section className="rounded-2xl bg-[#7A0E20] text-white relative overflow-hidden p-5">
              <img src="/euwhite.png" alt="" className="pointer-events-none select-none absolute right-[-24px] top-[-24px] h-40 w-40 opacity-15" />
              <div className="flex items-center gap-3">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover border border-white/20" />
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
