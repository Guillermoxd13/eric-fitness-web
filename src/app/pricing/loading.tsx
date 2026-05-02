export default function PricingLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <div className="text-center">
        <div className="mx-auto h-3 w-16 animate-pulse rounded bg-white/10" />
        <div className="mx-auto mt-5 h-14 w-80 animate-pulse rounded bg-white/10" />
        <div className="mx-auto mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-white/5" />
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl gap-4 md:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />
        <div className="h-96 animate-pulse rounded-2xl border border-hair bg-white/[0.03]" />
      </div>
    </div>
  );
}
