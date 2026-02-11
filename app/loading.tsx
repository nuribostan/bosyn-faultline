export default function Loading() {
  return (
    <div className="flex min-h-screen bg-[#F9F7F7]">
      <div className="w-64 bg-white h-screen border-r border-slate-100 fixed left-0 top-0 p-8 flex flex-col gap-8 z-20">
        <div className="space-y-3">
          <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-3 w-12 bg-slate-100 rounded animate-pulse" />
        </div>

        <div className="space-y-4 mt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-full bg-slate-50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="ml-64 flex-1 p-8 pb-32">
        <div className="mb-8 space-y-3">
          <div className="h-10 w-48 bg-slate-300 rounded-lg animate-pulse" />
          <div className="h-5 w-96 bg-slate-200 rounded-lg animate-pulse" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 h-100 w-full p-6 space-y-6 animate-pulse">
          <div className="flex justify-between border-b border-slate-100 pb-4">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-4 w-20 bg-slate-200 rounded" />
          </div>

          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center pt-4">
              <div className="h-6 w-24 bg-slate-100 rounded" />
              <div className="h-6 w-32 bg-slate-100 rounded" />
              <div className="h-6 w-64 bg-slate-50 rounded" />
              <div className="h-6 w-16 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 left-72 right-8 bg-[#0F172A] h-20 rounded-2xl shadow-2xl z-30 flex items-center justify-between px-8 animate-pulse">
        <div className="flex gap-12">
          <div className="h-10 w-16 bg-slate-700/50 rounded-lg" />
          <div className="h-10 w-16 bg-slate-700/50 rounded-lg" />
          <div className="h-10 w-16 bg-slate-700/50 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-slate-700/50 rounded-lg" />
      </div>
    </div>
  );
}
