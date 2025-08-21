"use client";
import { useMemo, useRef, useState } from "react";
import { PageHeader, PageBody } from "@/components/common/Page";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  campus: string;
  phone?: string;
  avatar?: string; // data URL preview
  notifyEmail: boolean;
  notifyPush: boolean;
};

const input =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300";
const label = "text-sm font-medium text-neutral-700";
const section = "rounded-lg border bg-white p-4";
const help = "text-xs text-neutral-500";

export default function FacultyProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    firstName: "Jolo",
    lastName: "Santos",
    email: "jolo@example.edu",
    department: "CCMS",
    campus: "Lucena",
    phone: "09XX XXX XXXX",
    avatar: undefined,
    notifyEmail: true,
    notifyPush: true,
  });

  const [password, setPassword] = useState({ new: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const formId = "facultyProfileForm";
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initials = useMemo(() => {
    const f = profile.firstName?.[0] ?? "";
    const l = profile.lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "F";
  }, [profile.firstName, profile.lastName]);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!profile.firstName.trim()) e.firstName = "Required.";
    if (!profile.lastName.trim()) e.lastName = "Required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) e.email = "Invalid email.";
    if (!profile.department.trim()) e.department = "Required.";
    if (!profile.campus.trim()) e.campus = "Required.";
    if (password.new || password.confirm) {
      if (password.new.length < 8) e.passwordNew = "Min 8 characters.";
      if (password.new !== password.confirm) e.passwordConfirm = "Passwords do not match.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    // simulate API
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSavedAt(new Date().toLocaleString());
    setPassword({ new: "", confirm: "" });
  };

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
        description="Manage your faculty account details and preferences."
        actions={
          <button
            type="submit"
            form={formId}
            disabled={saving}
            className="rounded-md bg-[#7a0019] px-3 py-2 text-sm text-white hover:opacity-95 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        }
      />

      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          {/* LEFT: FORM */}
          <form id={formId} onSubmit={onSubmit} className="space-y-4 min-w-0">
            {/* Personal */}
            <section className={section}>
              <h2 className="mb-3 font-medium">Personal Information</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar preview"
                      className="h-16 w-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-neutral-200 text-neutral-700 grid place-items-center text-lg font-semibold border">
                      {initials}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={onPickAvatar}
                    className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50"
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
                  <label className={label}>First name *</label>
                  <input
                    className={input}
                    value={profile.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                </div>
                <div>
                  <label className={label}>Last name *</label>
                  <input
                    className={input}
                    value={profile.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={label}>Email *</label>
                  <input
                    className={input}
                    value={profile.email}
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
                  <label className={label}>Department *</label>
                  <input
                    className={input}
                    value={profile.department}
                    onChange={(e) => update("department", e.target.value)}
                    placeholder="e.g., CCMS"
                  />
                  {errors.department && <p className="mt-1 text-xs text-red-600">{errors.department}</p>}
                </div>
                <div>
                  <label className={label}>Campus *</label>
                  <input
                    className={input}
                    value={profile.campus}
                    onChange={(e) => update("campus", e.target.value)}
                    placeholder="e.g., Lucena"
                  />
                  {errors.campus && <p className="mt-1 text-xs text-red-600">{errors.campus}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={label}>Phone (optional)</label>
                  <input
                    className={input}
                    value={profile.phone ?? ""}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="09XX XXX XXXX"
                  />
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
                  <label className={label}>New password</label>
                  <input
                    type="password"
                    className={input}
                    value={password.new}
                    onChange={(e) => setPassword((p) => ({ ...p, new: e.target.value }))}
                    placeholder="Min 8 characters"
                  />
                  {errors.passwordNew && <p className="mt-1 text-xs text-red-600">{errors.passwordNew}</p>}
                </div>
                <div>
                  <label className={label}>Confirm new password</label>
                  <input
                    type="password"
                    className={input}
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

          {/* RIGHT: SUMMARY / HELP */}
          <aside className="space-y-4">
            <section className="rounded-lg bg-[#5c0013] text-white p-4">
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
                    {profile.firstName} {profile.lastName}
                  </div>
                  <div className="text-xs opacity-80">Faculty • {profile.campus}</div>
                </div>
              </div>
              {savedAt && <div className="mt-3 text-xs opacity-90">Last saved: {savedAt}</div>}
            </section>

            <section className={section}>
              <h3 className="font-medium mb-2">Account tips</h3>
              <ul className="list-disc pl-5 text-sm text-neutral-700 space-y-1">
                <li>Use a school email for faster approval.</li>
                <li>Keep your contact number updated for urgent notices.</li>
                <li>Enable notifications so you don’t miss schedule changes.</li>
              </ul>
            </section>
          </aside>
        </div>
      </PageBody>
    </>
  );
}
