export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "AGENT" | "FARMER" | "BUYER" | "HUB_MANAGER" | "ANALYST";
export type PaymentProvider = "mtn" | "telecel" | "airteltigo" | "bank";
export type PaymentStatus = "pending" | "processing" | "successful" | "failed" | "reversed";
export type BatchStatus = "received" | "graded" | "stored" | "reserved" | "sold" | "exported";
export type OrderStatus = "pending" | "accepted" | "contracted" | "logistics" | "delivered" | "complete";

export interface Database {
  public: {
    Tables: {
      regions: {
        Row: { id: string; name: string; code: string; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["regions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["regions"]["Insert"]>;
      };
      districts: {
        Row: { id: string; region_id: string; name: string; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["districts"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["districts"]["Insert"]>;
      };
      villages: {
        Row: { id: string; district_id: string; name: string; gps_lat: number | null; gps_lng: number | null; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["villages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["villages"]["Insert"]>;
      };
      farmers: {
        Row: { id: string; user_id: string | null; agent_id: string; village_id: string; first_name: string; last_name: string; phone: string; ghana_card_id: string | null; date_of_birth: string | null; gender: "male" | "female" | "other" | null; photo_url: string | null; digital_id: string | null; wallet_id: string | null; credit_score: number; is_active: boolean; created_at: string; updated_at: string; deleted_at: string | null; };
        Insert: Omit<Database["public"]["Tables"]["farmers"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["farmers"]["Insert"]>;
      };
      agents: {
        Row: { id: string; user_id: string; hub_id: string | null; first_name: string; last_name: string; phone: string; employee_id: string | null; is_active: boolean; created_at: string; updated_at: string; deleted_at: string | null; };
        Insert: Omit<Database["public"]["Tables"]["agents"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["agents"]["Insert"]>;
      };
      storage_hubs: {
        Row: { id: string; name: string; region_id: string; district_id: string; address: string | null; gps_lat: number | null; gps_lng: number | null; capacity_tonnes: number; current_stock_tonnes: number; is_active: boolean; created_at: string; updated_at: string; };
        Insert: Omit<Database["public"]["Tables"]["storage_hubs"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["storage_hubs"]["Insert"]>;
      };
      commodities: {
        Row: { id: string; name: string; code: string; unit: string; is_active: boolean; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["commodities"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["commodities"]["Insert"]>;
      };
      commodity_grades: {
        Row: { id: string; commodity_id: string; name: string; code: string; min_score: number; max_score: number; price_premium_pct: number; };
        Insert: Omit<Database["public"]["Tables"]["commodity_grades"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["commodity_grades"]["Insert"]>;
      };
      commodity_batches: {
        Row: { id: string; batch_id: string; farmer_id: string; agent_id: string; hub_id: string | null; commodity_id: string; grade_id: string | null; quantity_kg: number; moisture_pct: number | null; purchase_price: number; total_value: number; gps_lat: number | null; gps_lng: number | null; grn_number: string | null; qr_code_url: string | null; status: BatchStatus; created_at: string; updated_at: string; };
        Insert: Omit<Database["public"]["Tables"]["commodity_batches"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["commodity_batches"]["Insert"]>;
      };
      wallets: {
        Row: { id: string; farmer_id: string; balance: number; currency: string; created_at: string; updated_at: string; };
        Insert: Omit<Database["public"]["Tables"]["wallets"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["wallets"]["Insert"]>;
      };
      transactions: {
        Row: { id: string; wallet_id: string; payment_id: string | null; type: "credit" | "debit"; amount: number; balance_after: number; description: string | null; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["transactions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
      };
      payments: {
        Row: { id: string; farmer_id: string; batch_id: string | null; amount: number; currency: string; provider: PaymentProvider; provider_ref: string | null; phone_number: string | null; account_number: string | null; status: PaymentStatus; initiated_at: string; completed_at: string | null; failure_reason: string | null; metadata: Json | null; };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "initiated_at">;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      notifications: {
        Row: { id: string; user_id: string; title: string; body: string; type: string; is_read: boolean; metadata: Json | null; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      audit_logs: {
        Row: { id: string; user_id: string | null; action: string; table_name: string; record_id: string | null; old_values: Json | null; new_values: Json | null; ip_address: string | null; created_at: string; };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      payment_provider: PaymentProvider;
      payment_status: PaymentStatus;
      batch_status: BatchStatus;
    };
  };
}
