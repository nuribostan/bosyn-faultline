import { useState } from "react";
import { ErrorLog, SeverityLevel } from "@/types";
import { LogPopup } from "@/components/LogPopup";
import { formatDate, truncateText } from "@/lib/utils";

interface ProjectLogTableProps {
  logs: ErrorLog[];
  loading: boolean;
  onLogDeleted?: (id: number) => void;
}

export function ProjectLogTable({
  logs,
  loading,
  onLogDeleted,
}: ProjectLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  if (loading) return <ProjectTableSkeleton />;

  return (
    <>
      <div className="w-full overflow-x-auto h-[60svh]">
        <div className="min-w-250">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-2">Test</div>
            <div className="col-span-2 text-center">Error Type</div>
            <div className="col-span-4">Error Message</div>
            <div className="col-span-2 text-center">Created At</div>
            <div className="col-span-2 text-right">Varyasyon</div>
          </div>

          <div className="divide-y divide-slate-50">
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-slate-50 transition cursor-pointer group items-center"
              >
                <div
                  className="col-span-2 font-semibold text-slate-700 text-sm truncate"
                  title={log.test_id}
                >
                  {log.test_id}
                </div>

                <div className="col-span-2 text-center">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded inline-block capitalize ${getBadgeStyle(
                      log.severity,
                    )}`}
                  >
                    {log.severity}
                  </span>
                </div>

                <div
                  className="col-span-4 text-sm text-slate-600 font-medium truncate"
                  title={log.message}
                >
                  {truncateText(log.message, 60)}
                </div>

                <div className="col-span-2 text-center text-slate-500 text-sm">
                  {formatDate(log.created_at)}
                </div>

                <div className="col-span-2 text-right text-slate-400 text-sm font-mono">
                  {log.variation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {logs.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">
            Bu kriterde veri bulunamadı.
          </div>
        )}
      </div>

      {selectedLog && (
        <LogPopup
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
          onDelete={(id) => {
            if (onLogDeleted) onLogDeleted(id);
            setSelectedLog(null); 
          }}
        />
      )}
    </>
  );
}

function getBadgeStyle(severity: SeverityLevel) {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-600 border border-red-100";
    case "error":
      return "bg-orange-50 text-orange-600 border border-orange-100";
    case "warning":
      return "bg-yellow-50 text-yellow-700 border border-yellow-100";
    case "info":
      return "bg-blue-50 text-blue-600 border border-blue-100";
    default:
      return "bg-slate-50 text-slate-600 border border-slate-100";
  }
}

function ProjectTableSkeleton() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-250 space-y-4 animate-pulse">
        <div className="h-8 bg-slate-100 rounded w-full mb-6" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50 items-center"
          >
            <div className="col-span-2 h-5 bg-slate-200 rounded" />
            <div className="col-span-2 h-5 bg-slate-100 rounded mx-auto w-16" />
            <div className="col-span-4 h-5 bg-slate-200 rounded w-3/4" />
            <div className="col-span-2 h-5 bg-slate-100 rounded mx-auto w-20" />
            <div className="col-span-2 h-5 bg-slate-100 rounded ml-auto w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
