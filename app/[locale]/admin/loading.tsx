export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <section className="fade-rise rounded-3xl border border-white/10 bg-surface p-6 md:p-8">
        <div className="h-3 w-32 animate-pulse rounded bg-white/15" />
        <div className="mt-3 h-8 w-80 max-w-full animate-pulse rounded bg-white/15" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-white/10" />
      </section>

      <section className="fade-rise grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-white/10 bg-surface p-5">
            <div className="h-3 w-24 animate-pulse rounded bg-white/15" />
            <div className="mt-3 h-8 w-14 animate-pulse rounded bg-white/15" />
          </article>
        ))}
      </section>

      <section className="fade-rise overflow-hidden rounded-2xl border border-white/10 bg-surface p-4">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-11 w-full animate-pulse rounded bg-white/10" />
          ))}
        </div>
      </section>
    </div>
  );
}
