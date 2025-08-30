import { cn } from "@/lib/utils";
import CTA from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

type Vehicle = { id:string; name:string; type:string; status:"available"|"maintenance"|"offline"; note?:string; };
type Driver = { id:string; name:string; license:string; vehicleTypes:string[]; status:"available"|"on_trip"|"off_duty"|"sick"|"leave"; phone?:string; color?:string; };
type Schedule = { id:string; dept:string; purpose:string; date:string; location:string; vehicle:string; driver?:string; status:"Approved"|"Pending"|"Assigned" };

export function AdminDashboardView(props:{
  vehicles: Vehicle[];
  drivers: Driver[];
  schedules: Schedule[];
  onVehicleStatus?: (id:string, status:Vehicle["status"]) => void;
  onVehicleRemove?: (id:string)=>void;
  onAddVehicle?: ()=>void;
  onAddDriver?: ()=>void;
}) {
  const { vehicles, drivers, schedules, onAddDriver } = props;

  return (
    <section className="space-y-4">
      {/* Sticky quick actions */}
      <div className="sticky top-0 z-10 -mx-2 px-2 pb-2 bg-gradient-to-b from-white/85 to-white/60 backdrop-blur border-b border-neutral-200/70">
        <div className="flex flex-wrap items-center gap-2">
          <CTA tone="primary" className="bg-brand-maroon hover:bg-brand-maroon/90">+ New Request</CTA>
          <CTA tone="ghost">+ Schedule</CTA>
          <CTA tone="ghost">+ Maintenance</CTA>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {label:"Pending approvals", val:"5"},
          {label:"Trips today", val:"12"},
          {label:"Vehicles unavailable", val:"1"},
          {label:"Incidents today", val:"0"},
        ].map((k)=>(
          <div key={k.label} className="tl-card">
            <div className="tl-card-body">
              <div className="text-2xl font-semibold">{k.val}</div>
              <div className="text-xs text-neutral-600">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle row */}
      <div className="tl-card">
        <div className="tl-card-header flex items-center justify-between">
          <h2 className="text-sm font-semibold">Fleet</h2>
          <CTA tone="ghost" onClick={props.onAddVehicle}>Add Vehicle</CTA>
        </div>
        <div className="tl-card-body">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {vehicles.map(v=>(
              <div key={v.id} className="min-w-[260px] rounded-xl border border-neutral-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{v.name} <span className="text-neutral-500">· {v.type}</span></div>
                  <span className={cn(
                    "badge",
                    v.status==="available" && "green",
                    v.status==="maintenance" && "amber",
                    v.status==="offline" && "blue"
                  )}>
                    {v.status==="available"?"Available":v.status==="maintenance"?"Maintenance":"Offline"}
                  </span>
                </div>
                {v.note && <div className="mt-1 text-xs text-neutral-600">{v.note}</div>}
                <div className="mt-3 flex gap-2">
                  <CTA tone="ghost" className="px-3 py-1.5">Schedule</CTA>
                  <CTA tone="ghost" className="px-3 py-1.5">Details</CTA>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedules + Drivers */}
      <div className="grid xl:grid-cols-12 gap-4">
        <div className="xl:col-span-7 tl-card">
          <div className="tl-card-header flex items-center justify-between">
            <h2 className="text-sm font-semibold">Upcoming Schedules</h2>
            <div className="flex gap-2">
              <CTA tone="ghost" className="px-3 py-1.5">Export</CTA>
              <CTA tone="primary" className="px-3 py-1.5 bg-brand-maroon hover:bg-brand-maroon/90">New Request</CTA>
            </div>
          </div>
          <div className="tl-card-body max-h-[520px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="[&>th]:px-3 [&>th]:py-2 text-left text-neutral-600">
                  <th>Department</th><th>Purpose</th><th>Date</th><th>Location</th>
                  <th>Vehicle</th><th>Driver</th><th>Status</th><th className="text-right pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {schedules.map((s, i)=>(
                  <tr key={s.id} className={cn("hover:bg-neutral-50", i%2 && "bg-neutral-50/50")}>
                    <td className="px-3 py-2">{s.dept}</td>
                    <td className="px-3 py-2">{s.purpose}</td>
                    <td className="px-3 py-2">{s.date}</td>
                    <td className="px-3 py-2">{s.location}</td>
                    <td className="px-3 py-2">{s.vehicle}</td>
                    <td className="px-3 py-2">{s.driver ?? "—"}</td>
                    <td className="px-3 py-2">
                      <span className={cn("badge",
                        s.status==="Approved" && "green",
                        s.status==="Pending" && "amber",
                        s.status==="Assigned" && "blue")}>{s.status}</span>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex justify-end gap-1">
                        <CTA tone="ghost" className="px-2.5 py-1.5">Assign</CTA>
                        <CTA tone="success" className="px-2.5 py-1.5">Approve</CTA>
                        <CTA tone="danger" className="px-2.5 py-1.5">Reject</CTA>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="xl:col-span-5 tl-card flex flex-col">
          <div className="tl-card-header flex items-center justify-between">
            <h2 className="text-sm font-semibold">Drivers</h2>
            <CTA tone="primary" className="px-3 py-1.5 bg-brand-maroon hover:bg-brand-maroon/90" onClick={onAddDriver}>Add Driver</CTA>
          </div>
          <div className="tl-card-body space-y-2 max-h-[520px] overflow-auto">
            {drivers.map(d=>(
              <div key={d.id} className="rounded-lg border border-neutral-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{d.name}</div>
                  <span className={cn("badge",
                    d.status==="available" && "green",
                    d.status==="on_trip" && "blue",
                    (d.status==="off_duty"||d.status==="leave"||d.status==="sick") && "amber"
                  )}>
                    {d.status.replace("_"," ")}
                  </span>
                </div>
                <div className="text-xs text-neutral-600">License: {d.license} · Can drive {d.vehicleTypes.join(", ")}</div>
                {d.phone && <div className="text-xs text-neutral-600">Phone: {d.phone}</div>}
                <div className="mt-2"><CTA tone="ghost" className="px-3 py-1.5">Update</CTA></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
