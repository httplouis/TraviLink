export default function DriverHistory() {
  const rows = [
    { id: "H-001", date: "2025-11-22", route: "Main — City Hall", vehicle: "Bus", status: "Completed" },
    { id: "H-002", date: "2025-11-28", route: "Campus — Lucena", vehicle: "Van", status: "Completed" },
  ];
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Trip History</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-tl.gray3">
            <tr>
              <th className="px-5 py-3">ID</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Route</th>
              <th className="px-5 py-3">Vehicle</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-tl-line">
                <td className="px-5 py-3">{r.id}</td>
                <td className="px-5 py-3">{r.date}</td>
                <td className="px-5 py-3">{r.route}</td>
                <td className="px-5 py-3">{r.vehicle}</td>
                <td className="px-5 py-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
