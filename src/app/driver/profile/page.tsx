import { DRIVER } from "@/lib/mock";

export default function DriverProfile() {
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="card p-5 grid sm:grid-cols-2 gap-5">
        <div className="grid gap-2">
          <div className="text-sm text-tl.gray3">Name</div>
          <div className="font-medium">{DRIVER.name}</div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm text-tl.gray3">ID</div>
          <div className="font-medium">{DRIVER.id}</div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm text-tl.gray3">License</div>
          <div className="font-medium">{DRIVER.license}</div>
        </div>
        <div className="grid gap-2">
          <div className="text-sm text-tl.gray3">Can Drive</div>
          <div className="font-medium">{DRIVER.canDrive.join(", ")}</div>
        </div>
      </div>
    </div>
  );
}
