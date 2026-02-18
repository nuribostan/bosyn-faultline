"use client";

import { useState, useEffect, useCallback } from "react";
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

  const fetchLogs = useCallback(
    async (showLoading: boolean = true) => {
      if (showLoading) setLoading(true);

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
        if (showLoading) setLoading(false);
      }
    },
    [selectedBrand],
  );

  useEffect(() => {
    fetchLogs(true);
  }, [fetchLogs]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLogs(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchLogs]);

  return {
    logs,
    brands,
    selectedBrand,
    setSelectedBrand,
    stats,
    loading,
    refetch: () => fetchLogs(false),
  };
}
