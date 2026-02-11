import { useState } from "react";
import { ChevronUp, Circle } from "lucide-react";
import { DashboardStats } from "@/types";

interface ErrorCounterProps {
  stats: DashboardStats;
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
}

export function ErrorCounter({
  stats,
  brands,
  selectedBrand,
  onBrandChange,
}: ErrorCounterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full bg-[#0F172A] text-white rounded-2xl p-3 md:p-4 shadow-2xl flex justify-between items-center z-30 px-4 md:px-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-4 md:gap-8 lg:gap-12 shrink-0">
        <StatItem count={stats.info} label="INFO" />
        <StatItem count={stats.critical} label="CRITICAL" />
        <StatItem count={stats.error} label="ERROR" />
      </div>

      <div className="relative ml-2 min-w-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 md:gap-3 bg-[#1E293B] hover:bg-[#334155] px-3 py-2 md:px-5 md:py-2.5 rounded-lg transition border border-slate-700 w-full max-w-40 md:max-w-none justify-between md:justify-start"
        >
          <div className="flex items-center gap-2 md:gap-3 truncate">
            <Circle
              size={10}
              className="text-green-400 fill-green-400 shrink-0"
            />
            <span className="font-medium text-xs md:text-sm truncate">
              {selectedBrand}
            </span>
          </div>

          <ChevronUp
            size={16}
            className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-48 md:w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 max-h-60 overflow-y-auto custom-scrollbar">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  onBrandChange(brand);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-slate-50 text-slate-700 truncate
                  ${selectedBrand === brand ? "font-bold text-blue-600 bg-blue-50" : ""}`}
              >
                {brand === "Tümü" ? "Tüm Markalar" : brand}
              </button>
            ))}
          </div>
        )}
        {isOpen && (
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

function StatItem({ count, label }: { count: number; label: string }) {
  return (
    <div className="text-center min-w-7.5">
      <div className="text-lg md:text-xl font-bold tracking-tight leading-none">
        {count}
      </div>
      <div className="text-[9px] md:text-[10px] font-bold text-slate-400 tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}
