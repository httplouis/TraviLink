import { UPCOMING } from "@/app/lib/mock";

export default function ScheduleTable() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-5 py-4 font-semibold">Upcoming Schedules</div>
      <div className="border-t border-tl-line">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-tl.gray3">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Driver</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {UPCOMING.map((r) => (
              <tr key={r.id} className="border-t border-tl-line">
                <td className="px-5 py-3 whitespace-nowrap">
                  <div>{r.date}</div>
                  <div className="text-xs text-tl.gray3">{r.time}</div>
                </td>
                <td className="px-5 py-3">{r.location}</td>
                <td className="px-5 py-3">{r.vehicle}</td>
                <td className="px-5 py-3">{r.driver ?? "—"}</td>
                <td className="px-5 py-3">
                  <span
                    className={`pill ${
                      r.status === "Approved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : r.status === "Assigned"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button className="btn">View</button>
                    <button className="btn btn-solid">Update</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
