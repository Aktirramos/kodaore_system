export default function PortalLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
        <div className="mt-3 h-8 w-72 max-w-full animate-pulse rounded bg-white/15" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-white/10" />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-white/10 bg-surface p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-white/15" />
          </article>
        ))}
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-white/10 bg-surface p-5">
            <div className="h-3 w-28 animate-pulse rounded bg-white/15" />
            <div className="mt-3 h-5 w-44 animate-pulse rounded bg-white/10" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-white/10" />
          </article>
        ))}
      </section>
    </div>
  );
}
