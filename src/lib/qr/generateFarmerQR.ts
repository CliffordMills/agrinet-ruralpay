export async function generateFarmerQR(digitalId: string, farmerId: string): Promise<string> {
  const qrData = JSON.stringify({
    type: "AGRINET_FARMER",
    id: farmerId,
    digital_id: digitalId,
    verify_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/trace/farmer/${farmerId}`,
  });

  // Use the QR Server API (no npm package needed, works in browser and server)
  const encoded = encodeURIComponent(qrData);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;
}
