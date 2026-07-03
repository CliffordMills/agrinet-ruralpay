interface TimelineEvent {
  label: string;
  description: string;
  timestamp: string | null;
  status: "done" | "pending" | "skipped";
  icon: string;
}

interface Props {
  events: TimelineEvent[];
}

export default function TraceabilityTimeline({ events }: Props) {
  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-6">
        {events.map((event, i) => (
          <div key={i} className="flex gap-4 relative">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 border-2 ${
                event.status === "done"
                  ? "bg-green-50 border-green-500"
                  : event.status === "pending"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-muted border-border"
              }`}
            >
              {event.icon}
            </div>
            <div className="flex-1 pt-1.5">
              <div className="flex items-center justify-between">
                <div className={`font-semibold text-sm ${
                  event.status === "skipped" ? "text-muted-foreground" : ""
                }`}>
                  {event.label}
                </div>
                {event.timestamp && (
                  <div className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString("en-GH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-0.5">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
