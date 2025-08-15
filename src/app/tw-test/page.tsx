export default function TwTest() {
  return (
    <div className="p-6">
      <div className="p-4 bg-black text-white rounded mb-4">Tailwind is working</div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-2">Card Example</h2>
          <p className="text-sm text-neutral-600">
            If this looks like a rounded white card with a light border and shadow, Tailwind is loaded.
          </p>
          <div className="mt-3 flex gap-2">
            <button className="btn">Button</button>
            <button className="btn btn-solid">Primary</button>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-lg font-semibold mb-2">Utilities</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-10 rounded bg-red-500"></div>
            <div className="h-10 rounded bg-green-500"></div>
            <div className="h-10 rounded bg-blue-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
