"use client";

import { useState } from "react";
import Link from "next/link";

interface Batch {
  id: string;
  grn_number: string;
  farmer_name: string;
  commodity: string;
  grade: string;
  quantity_kg: number;
  total_value: number;
  status: string;
  hub_name: string;
  created_at: string;
}

interface InventoryTableProps {
  batches: Batch[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  graded: "bg-blue-100 text-blue-800",
  stored: "bg-green-100 text-green-800",
  sold: "bg-purple-100 text-purple-800",
  exported: "bg-gray-100 text-gray-800",
};

export default function InventoryTable({ batches }: InventoryTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = batches.filter((b) => {
    const matchSearch = b.farmer_name.toLowerCase().includes(search.toLowerCase()) || b.commodity.toLowerCase().includes(search.toLowerCase()) || b.grn_number.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input type="search" placeholder="Search by farmer, commodity, GRN..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-border rounded-lg bg-background text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="graded">Graded</option>
          <option value="stored">Stored</option>
          <option value="sold">Sold</option>
          <option value="exported">Exported</option>
        </select>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">GRN</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Farmer</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Commodity</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Qty (kg)</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Value (GHS)</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Hub</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No batches found</td></tr>
            ) : (
              filtered.map((batch) => (
                <tr key={batch.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link href={`/agent/procurement/${batch.id}`} className="hover:text-primary">{batch.grn_number}</Link>
                  </td>
                  <td className="px-4 py-3 font-medium">{batch.farmer_name}</td>
                  <td className="px-4 py-3">{batch.commodity}{batch.grade && <span className="ml-1.5 text-xs bg-muted px-1.5 py-0.5 rounded">{batch.grade}</span>}</td>
                  <td className="px-4 py-3 text-right">{batch.quantity_kg.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-medium">{batch.total_value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{batch.hub_name}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[batch.status] || "bg-gray-100 text-gray-800"}`}>{batch.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-muted-foreground">{filtered.length} of {batches.length} batches</div>
    </div>
  );
}
