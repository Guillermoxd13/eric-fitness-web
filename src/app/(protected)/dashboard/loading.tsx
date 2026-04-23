export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <div className="space-y-4">
        <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
        <div className="h-12 w-72 animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-52 animate-pulse rounded bg-white/5" />
      </div>

      <div className="mt-8 h-20 w-full animate-pulse rounded-2xl bg-white/5" />

      <div className="mt-10 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
        ))}
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-hair bg-white/[0.03]"
          >
            <div className="aspect-video w-full animate-pulse bg-white/5" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/5" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
