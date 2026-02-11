"use client";

import { useEffect, useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Filter,
  ArrowUpDown,
  X,
  AlertTriangle,
} from "lucide-react";
import { LogService } from "@/services/logService";
import { ErrorLog, SeverityLevel } from "@/types";
import { ProjectLogTable } from "@/components/features/projects/ProjectLogTable";
import PageTitle from "@/components/ui/pageTitle";

type SortOption = "date_desc" | "date_asc" | "severity_desc" | "severity_asc";

const getSeverityWeight = (severity: SeverityLevel) => {
  const weights = { critical: 4, error: 3, warning: 2, info: 1 };
  return weights[severity] || 0;
};

export default function BrandDetailPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const brandName = decodeURIComponent(resolvedParams.brand);

  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedVariation, setSelectedVariation] = useState<string>("all");

  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await LogService.getLogs(brandName);
        setLogs(data);
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [brandName]);

  const variations = useMemo(() => {
    const unique = new Set(logs.map((log) => log.variation).filter(Boolean));
    return Array.from(unique).sort();
  }, [logs]);

  const processedLogs = useMemo(() => {
    let result = [...logs];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (log) =>
          log.test_id.toLowerCase().includes(lowerTerm) ||
          log.message.toLowerCase().includes(lowerTerm),
      );
    }

    if (selectedSeverity !== "all") {
      result = result.filter((log) => log.severity === selectedSeverity);
    }

    if (selectedVariation !== "all") {
      result = result.filter((log) => log.variation === selectedVariation);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "date_asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "severity_desc":
          return getSeverityWeight(b.severity) - getSeverityWeight(a.severity);
        case "severity_asc":
          return getSeverityWeight(a.severity) - getSeverityWeight(b.severity);
        default:
          return 0;
      }
    });

    return result;
  }, [logs, searchTerm, selectedSeverity, selectedVariation, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSeverity("all");
    setSelectedVariation("all");
    setSortBy("date_desc");
  };

  const isFiltering =
    searchTerm || selectedSeverity !== "all" || selectedVariation !== "all";

  const handleLogDeleted = (id: number) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <div className="min-h-screen w-full  text-slate-800">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-6 text-sm font-medium group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Listeye Geri Dön
        </button>

        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <PageTitle title="Projects" subTitle={brandName} />
          </div>

          <div className="text-sm text-slate-500 font-medium">
            Toplam{" "}
            <span className="text-slate-900 font-bold">
              {processedLogs.length}
            </span>{" "}
            kayıt bulundu
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center transition-all">
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Test ID veya Hata ara..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative w-full md:w-48">
            <AlertTriangle
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              className="w-full h-10 pl-9 pr-4 appearance-none rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50 transition"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
            >
              <option value="all">Tüm Hata Tipleri</option>
              <option value="critical">Critical</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="relative w-full md:w-48">
            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              className="w-full h-10 pl-9 pr-4 appearance-none rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-50 transition"
              value={selectedVariation}
              onChange={(e) => setSelectedVariation(e.target.value)}
            >
              <option value="all">Tüm Varyasyonlar</option>
              {variations.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full xl:w-auto justify-end">
          {isFiltering && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-500 font-medium hover:underline flex items-center gap-1"
            >
              <X size={12} /> Filtreleri Temizle
            </button>
          )}

          <div className="h-6 w-px bg-slate-200 mx-2 hidden xl:block"></div>

          <div className="relative min-w-50">
            <ArrowUpDown
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              className="w-full h-10 pl-9 pr-4 appearance-none rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer hover:bg-slate-100 transition"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="date_desc">Tarih: Yeni &gt; Eski</option>
              <option value="date_asc">Tarih: Eski &gt; Yeni</option>
              <option value="severity_desc">Önem: Yüksek &gt; Düşük</option>
              <option value="severity_asc">Önem: Düşük &gt; Yüksek</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-xl shadow-sm border border-slate-200">
        <ProjectLogTable logs={processedLogs} loading={loading} onLogDeleted={handleLogDeleted} />
      </div>
    </div>
  );
}
