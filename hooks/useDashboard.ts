"use client";

import { useState, useEffect } from "react";
import { LogService } from "@/services/logService";
import { ErrorLog, DashboardStats } from "@/types";

export function useDashboard() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState<DashboardStats>({
    info: 0,
    critical: 0,
    error: 0,
  });

  useEffect(() => {
    LogService.getBrands().then(setBrands);
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await LogService.getLogs(selectedBrand);
        setLogs(data);

        setStats({
          info: data.filter((l) => l.severity === "info").length,
          critical: data.filter((l) => l.severity === "critical").length,
          error: data.filter((l) => ["error", "warning"].includes(l.severity))
            .length,
        });
      } catch (error) {
        console.error("Dashboard veri hatası:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedBrand]);

  return {
    logs,
    brands,
    selectedBrand,
    setSelectedBrand,
    stats,
    loading,
  };
}
