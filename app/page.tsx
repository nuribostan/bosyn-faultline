"use client";

import { ErrorCounter } from "@/components/sections/dashboard/ErrorCounter";
import { LogTable } from "@/components/sections/dashboard/LogTable";
import PageTitle from "@/components/ui/pageTitle";
import { useDashboard } from "@/hooks/useDashboard";

export default function Home() {
  const {
    logs,
    brands,
    selectedBrand,
    setSelectedBrand,
    stats,
    loading,
    refetch,
  } = useDashboard();

  return (
    <div className="w-full h-full flex flex-col gap-6 justify-start items-start">
      <PageTitle title="Dashboard" />

      <div className="page-content w-full flex flex-col gap-6 justify-start items-start">
        <div className="w-full flex-1 overflow-y-auto min-h-0 bg-white rounded-xl shadow-sm border border-slate-200">
          <LogTable logs={logs} loading={loading} onLogDeleted={refetch} />
        </div>

        <ErrorCounter
          stats={stats}
          brands={brands}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
        />
      </div>
    </div>
  );
}
