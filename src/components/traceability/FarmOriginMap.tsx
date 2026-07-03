interface Props {
  farmerName: string;
  digitalId: string;
  village: string;
  district: string;
  region: string;
  farmSizeHa?: number;
  primaryCrop?: string;
  commodity: string;
  grade: string;
  hubName: string;
  hubCode: string;
}

export default function FarmOriginMap({
  farmerName,
  digitalId,
  village,
  district,
  region,
  farmSizeHa,
  primaryCrop,
  commodity,
  grade,
  hubName,
  hubCode,
}: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <h3 className="font-semibold">Farm Origin</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Farmer</div>
            <div className="font-semibold">{farmerName}</div>
            <div className="text-xs font-mono text-muted-foreground">{digitalId}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Location</div>
            <div className="font-medium">
              {village}, {district}
            </div>
            <div className="text-muted-foreground">{region} Region</div>
          </div>
          {farmSizeHa !== undefined && (
            <div>
              <div className="text-xs text-muted-foreground">Farm Size</div>
              <div className="font-medium">{farmSizeHa} ha</div>
            </div>
          )}
          {primaryCrop && (
            <div>
              <div className="text-xs text-muted-foreground">Primary Crop</div>
              <div className="font-medium">{primaryCrop}</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Commodity</div>
            <div className="font-semibold">{commodity}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Grade</div>
            <div className="font-medium">{grade}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Storage Hub</div>
            <div className="font-medium">{hubName}</div>
            <div className="text-xs font-mono text-muted-foreground">{hubCode}</div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-4 text-center text-xs text-muted-foreground">
        🌍 Geolocation mapping available when GPS coordinates are recorded at intake
      </div>
    </div>
  );
}
