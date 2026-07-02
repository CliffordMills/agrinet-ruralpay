import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import IoTDeviceGrid from "@/components/hub/IoTDeviceGrid";

export default async function HubDevicesPage() {
  const session = await requireSession();
  if (!session) redirect("/login");

  const supabase = await createClient();
  const { data: devices } = await supabase.from("iot_devices").select("id, device_type, device_name, serial_number, is_online, last_reading_at, battery_level, storage_hubs(name)").order("device_name");
  const online = (devices || []).filter((d) => d.is_online).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">IoT Devices</h1>
        <p className="text-muted-foreground text-sm mt-1">{online} of {devices?.length || 0} devices online</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Total Devices</div><div className="text-2xl font-bold mt-1">{devices?.length || 0}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Online</div><div className="text-2xl font-bold mt-1 text-green-600">{online}</div></div>
        <div className="bg-card border border-border rounded-lg p-4"><div className="text-sm text-muted-foreground">Offline</div><div className="text-2xl font-bold mt-1 text-red-500">{(devices?.length || 0) - online}</div></div>
      </div>
      <IoTDeviceGrid devices={(devices || []).map((d) => ({ id: d.id, device_type: d.device_type, device_name: d.device_name, serial_number: d.serial_number, is_online: d.is_online, last_reading_at: d.last_reading_at, battery_level: d.battery_level }))} />
    </div>
  );
}
