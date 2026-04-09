export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="h-28 w-28 rounded-full bg-white/10" />
              <div className="space-y-3 text-center sm:text-left">
                <div className="h-8 w-52 rounded-xl bg-white/10" />
                <div className="h-4 w-64 rounded-xl bg-white/10" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 rounded-full bg-white/10" />
                  <div className="h-8 w-24 rounded-full bg-white/10" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="h-20 w-32 rounded-2xl bg-white/10" />
              <div className="h-20 w-32 rounded-2xl bg-white/10" />
              <div className="h-20 w-32 rounded-2xl bg-white/10" />
              <div className="h-20 w-32 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="space-y-6">
            <div className="h-64 rounded-3xl border border-white/10 bg-white/5" />
            <div className="h-56 rounded-3xl border border-white/10 bg-white/5" />
          </div>

          <div className="space-y-6">
            <div className="h-72 rounded-3xl border border-white/10 bg-white/5" />
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="h-64 rounded-3xl border border-white/10 bg-white/5" />
              <div className="h-64 rounded-3xl border border-white/10 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
