"use client";

import { useEffect, useState } from "react";
import PageTitle from "@/components/ui/pageTitle";
import { BrandTable } from "@/components/sections/Projects/BrandTable";
import { LogService } from "@/services/logService";
import { BrandStats } from "@/types";

export default function ProjectsPage() {
  const [stats, setStats] = useState<BrandStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await LogService.getBrandStats();
        setStats(data);
      } catch (error) {
        console.error("Projeler yüklenemedi:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="animate-in fade-in duration-500  w-full">
      <div className="mb-10">
        <PageTitle title="Projects" />
        <p className="text-slate-400 mt-2 text-sm">
          Sistemdeki tüm markaların ve projelerin genel durumunu buradan
          izleyebilirsiniz.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <BrandTable stats={stats} loading={loading} />
      </div>
    </div>
  );
}
