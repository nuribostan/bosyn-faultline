"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { ErrorLog } from "@/types";

export interface NotificationItem {
  id: string;
  message: string;
  brand: string;
  timestamp: Date;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  removeNotification: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const unreadCount = notifications.length;


  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Bildirim izni verildi!");
          }
        });
      }
    }
  }, []);


  const triggerAlert = (brand: string, message: string) => {

    try {
      const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.warn("Otomatik oynatma engellendi (Sekme aktif değil):", e));
    } catch (error) {
      console.error("Ses hatası:", error);
    }

    if ("Notification" in window && Notification.permission === "granted") {
      if (document.hidden) {
        new Notification(`🚨 ${brand} Hatası!`, {
          body: message,
          icon: "/icon-192x192.png", 
          tag: "faultline-error", 
          silent: false, 
        });
      }
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('realtime-errors')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'error_logs' },
        (payload) => {
          const newLog = payload.new as ErrorLog;
          const msg = `${newLog.brand || 'Bilinmeyen Marka'}: ${newLog.error_type} hatası tespit edildi.`;

          const newNotification: NotificationItem = {
            id: crypto.randomUUID(),
            message: msg,
            brand: newLog.brand,
            timestamp: new Date(),
            isRead: false,
          };

          setNotifications((prev) => [newNotification, ...prev]);
          
          triggerAlert(newLog.brand, newLog.message);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications([]); 
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, removeNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}