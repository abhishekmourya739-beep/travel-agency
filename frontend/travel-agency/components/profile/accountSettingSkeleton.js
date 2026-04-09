export default function AccountSettingsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8">
          <div className="h-8 w-40 rounded-full bg-white/10" />
          <div className="mt-4 h-10 w-80 rounded-xl bg-white/10" />
          <div className="mt-3 h-5 w-lg max-w-full rounded-xl bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="mx-auto h-32 w-32 rounded-full bg-white/10" />
            <div className="mx-auto mt-5 h-6 w-40 rounded-lg bg-white/10" />
            <div className="mx-auto mt-3 h-4 w-52 rounded-lg bg-white/10" />
            <div className="mt-8 space-y-3">
              <div className="h-20 rounded-2xl bg-white/10" />
              <div className="h-20 rounded-2xl bg-white/10" />
              <div className="h-20 rounded-2xl bg-white/10" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="h-7 w-56 rounded-lg bg-white/10" />
              <div className="mt-2 h-4 w-72 rounded-lg bg-white/10" />
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="h-14 rounded-2xl bg-white/10" />
                <div className="h-14 rounded-2xl bg-white/10" />
                <div className="h-14 rounded-2xl bg-white/10 md:col-span-2" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="h-7 w-44 rounded-lg bg-white/10" />
              <div className="mt-6 h-32 rounded-2xl bg-white/10" />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="h-7 w-52 rounded-lg bg-white/10" />
              <div className="mt-6 h-40 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
