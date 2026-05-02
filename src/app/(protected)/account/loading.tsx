export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-20">
      <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-12 w-48 animate-pulse rounded bg-white/10" />

      <div className="mt-10 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-hair bg-white/[0.03] p-6"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-white/5" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
