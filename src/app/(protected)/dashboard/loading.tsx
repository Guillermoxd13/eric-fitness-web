export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-52 animate-pulse rounded-lg bg-white/5" />
      </div>

      <div className="h-20 w-full animate-pulse rounded-2xl bg-white/5" />

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="glass overflow-hidden rounded-2xl p-0"
          >
            <div className="aspect-video w-full animate-pulse bg-white/5" />
            <div className="space-y-2 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/5" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
