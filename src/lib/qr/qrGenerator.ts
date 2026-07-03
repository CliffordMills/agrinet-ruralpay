export function qrCodeUrl(data: string, size = 200): string {
  const encoded = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
}

export function batchTraceUrl(batchId: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://agrinet.app";
  return `${base}/scan/${batchId}`;
}

export function batchQRCodeUrl(batchId: string, size = 200): string {
  return qrCodeUrl(batchTraceUrl(batchId), size);
}
