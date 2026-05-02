export default function WatchLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10 md:py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-white/5" />

      <div className="mt-6 aspect-video w-full animate-pulse rounded-2xl border border-hair bg-white/5" />

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_280px]">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="h-6 w-16 animate-pulse rounded-full bg-white/5" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-white/5" />
          </div>
          <div className="h-10 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded bg-white/5" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-white/5" />
        </div>
        <div className="hidden h-40 animate-pulse rounded-2xl border border-hair bg-white/[0.03] md:block" />
      </div>
    </div>
  );
}
