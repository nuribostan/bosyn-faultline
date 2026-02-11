"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCheck } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export function NotificationBell() {
  const { notifications, unreadCount, removeNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 3);

  return (
    <div className="fixed top-6 right-8 z-50 max-lg:top-4 max-lg:right-24" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white rounded-full  transition-all text-slate-600 hover:text-blue-600 active:scale-95"
      >
        <Bell size={24} />

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h4 className="font-bold text-slate-700 text-sm">Bildirimler</h4>
            {notifications.length > 0 && (
              <button
                onClick={() => router.push("/notifications")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Tümünü Gör ({unreadCount})
              </button>
            )}
          </div>

          <div className="max-h-75 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
                <CheckCheck size={24} className="opacity-50" />
                <p>Her şey yolunda!</p>
                <span className="text-xs opacity-70">Yeni bildirim yok.</span>
              </div>
            ) : (
              recentNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 border-b border-slate-50 hover:bg-slate-50/80 transition group relative"
                >
                  <div className="pr-6">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 block uppercase tracking-wide">
                      {formatDistanceToNow(notif.timestamp, {
                        addSuffix: true,
                        locale: tr,
                      })}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="absolute top-3 right-3 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 3 && (
            <div className="p-2 bg-slate-50 text-center border-t border-slate-100">
              <span className="text-xs text-slate-400">
                ve {notifications.length - 3} bildirim daha...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
