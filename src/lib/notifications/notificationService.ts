export type NotificationType =
  | "bid_received"
  | "bid_accepted"
  | "bid_rejected"
  | "contract_created"
  | "payment_initiated"
  | "payment_successful"
  | "payment_failed"
  | "loan_approved"
  | "loan_rejected"
  | "grading_complete"
  | "climate_alert"
  | "system";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export function notificationIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    bid_received: "📨",
    bid_accepted: "✅",
    bid_rejected: "❌",
    contract_created: "📜",
    payment_initiated: "💳",
    payment_successful: "💸",
    payment_failed: "⚠️",
    loan_approved: "🏦",
    loan_rejected: "🚫",
    grading_complete: "⚖️",
    climate_alert: "🌦️",
    system: "🔔",
  };
  return icons[type] ?? "🔔";
}

export function notificationColor(type: NotificationType): string {
  const urgent: NotificationType[] = ["payment_failed", "bid_rejected", "loan_rejected", "climate_alert"];
  const success: NotificationType[] = ["bid_accepted", "payment_successful", "loan_approved", "contract_created"];
  if (urgent.includes(type)) return "border-l-red-400";
  if (success.includes(type)) return "border-l-green-400";
  return "border-l-blue-400";
}
