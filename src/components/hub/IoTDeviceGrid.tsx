interface IoTDevice {
  id: string;
  device_type: string;
  device_name: string;
  serial_number: string;
  is_online: boolean;
  last_reading_at: string | null;
  battery_level: number | null;
}

interface IoTDeviceGridProps {
  devices: IoTDevice[];
}

const DEVICE_ICONS: Record<string, string> = {
  temperature: "🌡️",
  humidity: "💧",
  weight: "⚖️",
  camera: "📷",
  co2: "💨",
  pest: "🐛",
};

export default function IoTDeviceGrid({ devices }: IoTDeviceGridProps) {
  if (devices.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="text-4xl mb-3">📡</div>
        <div className="font-medium">No IoT devices registered</div>
        <div className="text-sm text-muted-foreground mt-1">Contact your administrator to add devices</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map((device) => (
        <div key={device.id} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{DEVICE_ICONS[device.device_type] || "📠"}</span>
              <div>
                <div className="font-medium text-sm">{device.device_name}</div>
                <div className="text-xs text-muted-foreground font-mono">{device.serial_number}</div>
              </div>
            </div>
            <div className={`w-2.5 h-2.5 rounded-full mt-1 ${device.is_online ? "bg-green-500" : "bg-gray-300"}`} />
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="capitalize">Type: {device.device_type.replace(/_/g, " ")}</div>
            {device.battery_level !== null && <div className={device.battery_level < 20 ? "text-red-500" : "text-muted-foreground">Battery: {device.battery_level}% {device.battery_level < 20 && "⚠️"}</div>}
            {device.last_reading_at && <div>Last reading: {new Date(device.last_reading_at).toLocaleString("en-GH")}</div>}
            {!device.last_reading_at && <div className="text-amber-500">No readings yet</div>}
          </div>
          <div className={`mt-3 text-xs font-medium px-2 py-1 rounded text-center ${device.is_online ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>{device.is_online ? "Online" : "Offline"}</div>
        </div>
      ))}
    </div>
  );
}
