import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";
import { BrandStats } from "@/types";

interface BrandTableProps {
  stats: BrandStats[];
  loading: boolean;
}

export function BrandTable({ stats, loading }: BrandTableProps) {
  const router = useRouter();

  if (loading) return <ProjectsSkeleton />;

  return (
    <div className="w-full max-h-[60svh]">
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <div className="col-span-6">Marka</div>
        <div className="col-span-2 text-center">Error Count</div>
        <div className="col-span-2 text-center">Critical Count</div>
        <div className="col-span-2 text-center">Info Count</div>
      </div>

      <div className="divide-y divide-slate-50">
        {stats.map((stat) => (
          <div
            key={stat.brand}
            onClick={() =>
              router.push(`/projects/${encodeURIComponent(stat.brand)}`)
            }
            className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 transition cursor-pointer group items-center"
          >
            <div className="col-span-6 flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-200">
                <Folder size={20} fill="currentColor" fillOpacity={0.2} />
              </div>
              <span className="font-semibold text-slate-700 text-sm group-hover:text-blue-700 transition-colors">
                {stat.brand}
              </span>
            </div>

            <div className="col-span-2 text-center font-bold text-slate-600">
              {stat.errorCount}
            </div>
            <div className="col-span-2 text-center font-bold text-red-600 bg-red-50 py-1 rounded-md mx-4">
              {stat.criticalCount}
            </div>
            <div className="col-span-2 text-center font-bold text-slate-400">
              {stat.infoCount}
            </div>
          </div>
        ))}
      </div>

      {stats.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          Henüz kayıtlı proje bulunamadı.
        </div>
      )}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-full mb-6" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center space-x-4 py-4 border-b border-slate-50"
        >
          <div className="h-10 w-10 bg-slate-200 rounded-lg" />
          <div className="h-5 w-48 bg-slate-200 rounded" />
          <div className="flex-1" />
          <div className="h-5 w-12 bg-slate-100 rounded" />
          <div className="h-5 w-12 bg-slate-100 rounded" />
          <div className="h-5 w-12 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}
