"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type PostgresEvent = "INSERT" | "UPDATE" | "DELETE" | "*";

interface RealtimeOptions<T extends Record<string, unknown>> {
  table: string;
  schema?: string;
  event?: PostgresEvent;
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: Partial<T>) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
}

export function useRealtime<T extends Record<string, unknown>>({
  table, schema = "public", event = "*", filter, onInsert, onUpdate, onDelete, onChange,
}: RealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const channelName = `${schema}:${table}:${event}:${filter ?? "all"}`;
    const channel = supabase
      .channel(channelName)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("postgres_changes" as any, { event, schema, table, filter }, (payload: RealtimePostgresChangesPayload<T>) => {
        onChange?.(payload);
        if (payload.eventType === "INSERT") onInsert?.(payload.new as T);
        if (payload.eventType === "UPDATE") onUpdate?.(payload.new as T);
        if (payload.eventType === "DELETE") onDelete?.(payload.old as Partial<T>);
      })
      .subscribe();
    channelRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [table, schema, event, filter, onInsert, onUpdate, onDelete, onChange]);

  return channelRef;
}
