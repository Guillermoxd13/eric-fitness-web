export default function CoachingLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
      <div className="h-3 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-4 h-12 w-72 animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="h-44 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />
        <div className="h-44 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />
      </div>

      <div className="mt-10 h-32 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />

      <div className="mt-10 grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <div className="h-96 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />
        <div className="h-96 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />
      </div>
    </div>
  );
}
