import { useState } from "react";
import { ErrorLog, SeverityLevel } from "@/types";
import { LogPopup } from "@/components/LogPopup";
import { truncateText } from "@/lib/utils";

interface LogTableProps {
  logs: ErrorLog[];
  loading: boolean;
  onLogDeleted: () => void;
}

export function LogTable({ logs, loading, onLogDeleted }: LogTableProps) {
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  if (loading) return <TableSkeleton />;

  const displayedLogs = logs.slice(0, 5);

  return (
    <>
      <div className="w-full">
        <table className="w-full text-left">
          <thead className="border-b-2 border-secondary-background w-full">
            <tr>
              {["Marka", "Test", "Hata Mesajı", "Tip", "Varyasyon"].map(
                (header) => (
                  <th
                    key={header}
                    className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayedLogs.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="hover:bg-slate-50/80 transition cursor-pointer group active:bg-slate-100"
              >
                <td
                  className="p-6 text-sm font-semibold text-slate-700"
                  title={log.brand}
                >
                  {truncateText(log.brand || "Genel", 15)}
                </td>

                <td
                  className="p-6 text-sm text-slate-600 font-medium"
                  title={log.test_id}
                >
                  {truncateText(log.test_id, 20)}
                </td>

                <td className="p-6 text-sm text-slate-500" title={log.message}>
                  {truncateText(log.message, 40)}
                </td>

                <td className="p-6">
                  <StatusBadge severity={log.severity} type={log.error_type} />
                </td>

                <td className="p-6 text-sm text-slate-400 font-mono">
                  {log.variation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {logs.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            Bu kriterde veri bulunamadı.
          </div>
        )}
      </div>

      {selectedLog && (
        <LogPopup
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onDeleteSuccess={() => {
            setSelectedLog(null);
            onLogDeleted();
          }}
          
        />
      )}
    </>
  );
}

function StatusBadge({
  severity,
  type,
}: {
  severity: SeverityLevel;
  type: string;
}) {
  const styles: Record<SeverityLevel, string> = {
    critical: "text-red-600 bg-red-50",
    error: "text-amber-600 bg-amber-50",
    warning: "text-amber-600 bg-amber-50",
    info: "text-blue-600 bg-blue-50",
  };

  const style = styles[severity] || "text-slate-600 bg-slate-50";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
      {type}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white w-full rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      <div className="border-b border-slate-100 bg-white p-6 flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-4 bg-slate-200 rounded w-24 animate-pulse"
          />
        ))}
      </div>

      <div className="divide-y divide-slate-50">
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="flex items-center p-6 space-x-6">
            <div className="w-1/6">
              <div className="h-5 bg-slate-200 rounded-md w-3/4 animate-pulse" />
            </div>

            <div className="w-1/6">
              <div className="h-5 bg-slate-200 rounded-md w-full animate-pulse" />
            </div>

            <div className="w-2/6">
              <div className="h-5 bg-slate-100 rounded-md w-full animate-pulse mb-2" />
              <div className="h-3 bg-slate-50 rounded-md w-1/2 animate-pulse" />
            </div>

            <div className="w-1/6">
              <div className="h-6 bg-slate-200 rounded-full w-20 animate-pulse" />
            </div>

            <div className="w-1/6">
              <div className="h-4 bg-slate-100 rounded-md w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
