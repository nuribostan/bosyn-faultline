import { useState } from "react";
import { ErrorLog, SeverityLevel } from "@/types";
import {
  X,
  Clock,
  AlertTriangle,
  FileText,
  Tag,
  Activity,
  Database,
  Copy,
  Check,
  Globe,
  Monitor,
  Trash2,
} from "lucide-react";
import { LogService } from "@/services/logService";

interface LogPopupProps {
  log: ErrorLog;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onDeleteSuccess: () => void;
}

export function LogPopup({ log, onClose, onDeleteSuccess }: LogPopupProps) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getHeaderColor = (severity: SeverityLevel) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-100";
      case "error":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "warning":
        return "bg-orange-50 text-orange-700 border-orange-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 4));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Bu log kaydını kalıcı olarak silmek istediğine emin misin?",
      )
    )
      return;

    setIsDeleting(true);
    try {
      await LogService.deleteLog(log.id);

      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silinirken bir hata oluştu.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div
          className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${getHeaderColor(log.severity)}`}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} />
            <h3 className="text-lg font-bold capitalize">
              {log.error_type} Detayı
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/50 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DetailItem
              icon={<Tag size={16} />}
              label="Marka"
              value={log.brand}
            />
            <DetailItem
              icon={<Activity size={16} />}
              label="Test ID"
              value={log.test_id}
            />
            <DetailItem
              icon={<FileText size={16} />}
              label="Varyasyon"
              value={log.variation}
            />
            <DetailItem
              icon={<Clock size={16} />}
              label="Son Görülme"
              value={new Date(log.last_seen_at).toLocaleString("tr-TR")}
            />
            <DetailItem
              icon={<Monitor size={16} />}
              label="Tekrar"
              value={`${log.occurrences}x`}
            />
            <DetailItem
              icon={<Globe size={16} />}
              label="Oturum ID"
              value={log.session_id}
            />
          </div>

          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Hata Mesajı
            </h4>
            <div className="bg-red-50/50 p-4 rounded-lg border border-red-100 font-mono text-sm text-red-900 wrap-break-words leading-relaxed">
              {log.message}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Database size={14} /> Ham Veri (Raw JSON)
              </h4>
              <button
                onClick={handleCopyJSON}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 border
                        ${copied ? "bg-green-50 text-green-700 border-green-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Kopyalandı!" : "JSON Kopyala"}
              </button>
            </div>
            <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-inner border border-slate-800 relative group">
              <div className="max-h-64 overflow-auto p-4 custom-scrollbar">
                <pre className="font-mono text-[11px] leading-5 text-emerald-400 whitespace-pre">
                  {JSON.stringify(log, null, 4)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              "Siliniyor..."
            ) : (
              <>
                <Trash2 size={16} /> Hatayı Sil
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  // eslint-disable-next-line
  icon: any;
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="flex flex-col">
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-wide">
        {icon} {label}
      </span>
      <span
        className="text-slate-700 font-semibold text-sm truncate"
        title={String(value)}
      >
        {value || "-"}
      </span>
    </div>
  );
}
