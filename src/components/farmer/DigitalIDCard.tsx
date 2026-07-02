"use client";

import { useEffect, useRef } from "react";

interface DigitalIDCardProps {
  farmer: {
    id: string;
    first_name: string;
    last_name: string;
    digital_id: string;
    phone: string;
    village_name?: string;
    credit_score: number;
    photo_url?: string;
  };
  qrDataUrl?: string;
}

export function DigitalIDCard({ farmer, qrDataUrl }: DigitalIDCardProps) {
  return (
    <div className="bg-primary rounded-2xl p-6 text-white max-w-sm shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-secondary rounded-md flex items-center justify-center">
            <span className="text-black text-xs font-bold">AG</span>
          </div>
          <span className="font-bold text-sm">AGRINET RURALPAY</span>
        </div>
        <span className="text-white/60 text-xs">Farmer ID</span>
      </div>

      {/* Farmer info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
          {farmer.first_name[0]}{farmer.last_name[0]}
        </div>
        <div>
          <p className="font-bold text-lg leading-tight">
            {farmer.first_name} {farmer.last_name}
          </p>
          <p className="text-white/70 text-sm">{farmer.phone}</p>
          {farmer.village_name && (
            <p className="text-white/60 text-xs mt-0.5">{farmer.village_name}</p>
          )}
        </div>
      </div>

      {/* Digital ID + QR */}
      <div className="flex items-center justify-between bg-white/10 rounded-xl p-4">
        <div>
          <p className="text-white/60 text-xs mb-1">Digital ID</p>
          <p className="font-mono font-bold text-lg text-secondary">{farmer.digital_id}</p>
          <p className="text-white/60 text-xs mt-2">Credit Score</p>
          <p className="font-bold">{farmer.credit_score} / 1000</p>
        </div>
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" className="w-20 h-20 bg-white rounded-lg p-1" />
        ) : (
          <div className="w-20 h-20 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-white/50 text-xs text-center">QR Loading</span>
          </div>
        )}
      </div>

      <p className="text-white/40 text-xs mt-4 text-center">
        Scan QR to verify • Ghana MoFA Certified
      </p>
    </div>
  );
}
