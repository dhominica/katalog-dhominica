export default function Loading() {
  return (
    <div className="animate-pulse">
      <section className="py-10 sm:py-14">
        <div className="h-10 w-48 rounded-lg bg-permukaan sm:h-12 sm:w-64" />
        <div className="mt-4 h-5 w-full max-w-md rounded bg-permukaan" />
        <div className="mt-2 h-4 w-36 rounded bg-permukaan" />
      </section>

      <section className="flex flex-col gap-5">
        <div className="h-6 w-32 rounded bg-permukaan" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-garis bg-latar"
            >
              <div className="aspect-square w-full bg-permukaan" />
              <div className="flex flex-1 flex-col gap-2 p-3">
                <div className="h-3 w-16 rounded bg-permukaan" />
                <div className="h-4 w-3/4 rounded bg-permukaan" />
                <div className="mt-2 h-6 w-20 rounded-md bg-permukaan" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

