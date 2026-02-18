"use client";

import { useNotification } from "@/context/NotificationContext";
import PageTitle from "@/components/ui/pageTitle";
import { Bell, X, Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { notifications, removeNotification, markAsRead } = useNotification();
  const router = useRouter();

  const handleNotificationClick = (id: string, brand: string) => {
    markAsRead(id); 
    router.push(`/projects/${brand}`); 
  };

  return (
    <div className="min-h-screen w-full text-slate-800 animate-in fade-in duration-500">
      <div className="mb-8">
        <PageTitle title="Bildirimler" subTitle="Sistem Uyarıları" />
        <p className="text-slate-400 text-sm mt-1">
          Sistemdeki tüm uyarı ve hata bildirim geçmişi.
        </p>
      </div>

      <div className="w-full">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              Bildirim Kutusu Boş
            </h3>
            <p className="text-slate-400 max-w-sm">
              Şu an için görüntülenecek yeni bir hata veya uyarı bulunmuyor.
              Sistem stabil çalışıyor.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item.id, item.brand)}
                  className={`p-6 flex items-start gap-4 transition group cursor-pointer ${
                    !item.isRead ? "bg-blue-50/30 hover:bg-blue-50/50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="shrink-0 mt-1">
                    <div className="h-10 w-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center relative">
                      <Bell size={20} />
                      {!item.isRead && (
                        <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold text-slate-800 mb-1">
                        {item.brand || "Sistem"} Hatası
                      </h4>
                      <span className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">
                        <Clock size={12} />
                        {formatDistanceToNow(item.timestamp, {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Yönlendirmeyi engeller, sadece siler!
                      removeNotification(item.id);
                    }}
                    className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    title="Bildirimi Sil"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}