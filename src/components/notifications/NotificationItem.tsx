import { Notification, notificationIcon, notificationColor } from "@/lib/notifications/notificationService";
import Link from "next/link";

interface Props {
  notification: Notification;
  onRead?: (id: string) => void;
}

export default function NotificationItem({ notification, onRead }: Props) {
  const content = (
    <div
      className={`flex gap-3 px-4 py-3 border-l-4 transition-colors hover:bg-muted/40 ${
        notificationColor(notification.type)
      } ${!notification.read ? "bg-primary/5" : ""}`}
      onClick={() => !notification.read && onRead?.(notification.id)}
    >
      <div className="text-xl flex-shrink-0 mt-0.5">{notificationIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
          {notification.title}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {new Date(notification.created_at).toLocaleString("en-GH", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
      )}
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }
  return <div className="cursor-default">{content}</div>;
}
