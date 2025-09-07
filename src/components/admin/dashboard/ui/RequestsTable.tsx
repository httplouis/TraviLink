"use client";

const data = [
  { id: "REQ-1001", dept: "CCMS", purpose: "Seminar", date: "2025-09-10", status: "Pending" },
  { id: "REQ-1002", dept: "HR", purpose: "Orientation", date: "2025-09-12", status: "Approved" },
];

export default function RequestsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-neutral-100 text-left">
          <tr>
            <th className="px-3 py-2 border">ID</th>
            <th className="px-3 py-2 border">Department</th>
            <th className="px-3 py-2 border">Purpose</th>
            <th className="px-3 py-2 border">Date</th>
            <th className="px-3 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-neutral-50">
              <td className="px-3 py-2 border">{row.id}</td>
              <td className="px-3 py-2 border">{row.dept}</td>
              <td className="px-3 py-2 border">{row.purpose}</td>
              <td className="px-3 py-2 border">{row.date}</td>
              <td className="px-3 py-2 border">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
