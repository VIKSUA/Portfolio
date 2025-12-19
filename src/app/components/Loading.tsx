export const Loading = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <div className="h-4 w-1/2 rounded bg-slate-700" />
        <div className="mt-3 h-3 w-full rounded bg-slate-800" />
        <div className="mt-2 h-3 w-4/5 rounded bg-slate-800" />
        <div className="mt-6 flex gap-4">
          <div className="h-3 w-16 rounded bg-slate-800" />
          <div className="h-3 w-16 rounded bg-slate-800" />
        </div>
      </div>
    ))}
  </div>
);
