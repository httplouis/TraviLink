export default function Notifications() {
  const items = [
    { id: 1, title: "Trip assigned", note: "You have been assigned to Bus • Tagaytay 12/25 08:00", time: "2h ago" },
    { id: 2, title: "Request approved", note: "City Hall request approved for 01/12", time: "1d ago" },
  ];
  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Notifications</h1>
      <div className="card">
        {items.map((n, i) => (
          <div key={n.id} className={`px-5 py-4 ${i ? "border-t border-tl-line" : ""}`}>
            <div className="font-medium">{n.title}</div>
            <div className="text-sm text-tl.gray3">{n.note}</div>
            <div className="text-xs text-tl.gray4 mt-1">{n.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
