"use client";

import { useEffect, useRef } from "react";
import { Notification } from "@/lib/notifications/notificationService";
import NotificationItem from "./NotificationItem";

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationDrawer({
  open,
  onClose,
  notifications,
  onRead,
  onMarkAllRead,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 w-96 max-h-[32rem] bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="font-semibold">
          Notifications{unreadCount > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">
            ×
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-border">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            <div className="text-3xl mb-2">🔔</div>
            No notifications yet
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={onRead} />
          ))
        )}
      </div>
    </div>
  );
}
