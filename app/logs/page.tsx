"use client";

import { useEffect, useState, useMemo } from "react";
import { Search, ArrowUpDown, X, AlertTriangle, Briefcase } from "lucide-react";
import { LogService } from "@/services/logService";
import { ErrorLog, SeverityLevel } from "@/types";
import { ProjectLogTable } from "@/components/features/projects/ProjectLogTable";
import PageTitle from "@/components/ui/pageTitle";

type SortOption = "date_desc" | "date_asc" | "severity_desc" | "severity_asc";

const getSeverityWeight = (severity: SeverityLevel) => {
  const weights = { critical: 4, error: 3, warning: 2, info: 1 };
  return weights[severity] || 0;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const allLogs = await LogService.getLogs(null);
        setLogs(allLogs);
        const brandList = await LogService.getBrands();
        setBrands(brandList);
      } catch (error) {
        console.error("Loglar yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const processedLogs = useMemo(() => {
    let result = [...logs];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (log) =>
          log.test_id.toLowerCase().includes(lowerTerm) ||
          log.message.toLowerCase().includes(lowerTerm) ||
          (log.brand && log.brand.toLowerCase().includes(lowerTerm)),
      );
    }

    if (selectedBrand !== "Tümü") {
      result = result.filter((log) => log.brand === selectedBrand);
    }

    if (selectedSeverity !== "all") {
      result = result.filter((log) => log.severity === selectedSeverity);
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
  }, [logs, searchTerm, selectedBrand, selectedSeverity, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBrand("Tümü");
    setSelectedSeverity("all");
    setSortBy("date_desc");
  };

  const isFiltering =
    searchTerm || selectedBrand !== "Tümü" || selectedSeverity !== "all";

  const handleLogDeleted = (id: number) => {
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  return (
    <div className=" w-full  text-slate-800  flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="mb-6 shrink-0">
        <PageTitle title="Logs" subTitle="System Wide" />
        <p className="text-slate-400 text-sm mt-1">
          Tüm markaların ve projelerin log kayıtlarını tek bir listede
          görüntüleyin.
        </p>
      </div>

      <div className="mb-6 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-start xl:justify-end transition-all shrink-0">
        <div className="flex flex-col lg:flex-row gap-3 w-full xl:w-auto">
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Marka, Test ID veya Hata ara..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border-none bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition shadow-sm"
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

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-56">
              <Briefcase
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                className="w-full h-11 pl-10 pr-8 appearance-none rounded-xl border-none bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-50 transition shadow-sm"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand === "Tümü" ? "Tüm Markalar" : brand}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-56">
              <AlertTriangle
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <select
                className="w-full h-11 pl-10 pr-8 appearance-none rounded-xl border-none bg-white text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-50 transition shadow-sm"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
              >
                <option value="all">Tüm Hata Tipleri</option>
                <option value="critical">Critical</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
          {isFiltering && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition flex items-center gap-2 whitespace-nowrap"
            >
              <X size={14} /> Temizle
            </button>
          )}

          <div className="relative grow sm:grow-0">
            <select
              className="w-full sm:w-auto h-11 pl-4 pr-10 appearance-none rounded-xl border-none bg-white text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-50 transition shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="date_desc">Tarih: Yeni &gt; Eski</option>
              <option value="date_asc">Tarih: Eski &gt; Yeni</option>
              <option value="severity_desc">Önem: Yüksek &gt; Düşük</option>
              <option value="severity_asc">Önem: Düşük &gt; Yüksek</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <ArrowUpDown size={16} />
            </div>
          </div>

          <div className="text-sm text-slate-500 font-medium bg-white px-4 py-2.5 rounded-xl shadow-sm whitespace-nowrap min-w-fit">
            <span className="text-slate-900 font-bold">
              {processedLogs.length}
            </span>{" "}
            kayıt
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 bg-white rounded-xl shadow-sm border border-slate-200">
        <ProjectLogTable
          logs={processedLogs}
          loading={loading}
          onLogDeleted={handleLogDeleted}
        />
      </div>
    </div>
  );
}
