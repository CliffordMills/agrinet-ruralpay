"use client";

import type { GRNData } from "@/lib/grn/generateGRN";

interface GRNDocumentProps {
  data: GRNData;
}

export default function GRNDocument({ data }: GRNDocumentProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className="mb-4 print:hidden">
        <button onClick={handlePrint} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          🖨️ Print GRN
        </button>
      </div>

      <div className="bg-white text-gray-900 border-2 border-gray-300 rounded-lg p-8 max-w-2xl print:border-none print:p-0">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-2xl font-bold text-green-800">AGRINET RURALPAY</div>
            <div className="text-sm text-gray-500 mt-1">Ghana Agricultural Network</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Goods Received Note</div>
            <div className="text-xl font-mono font-bold mt-1">{data.grnNumber}</div>
            <div className="text-sm text-gray-500 mt-1">{data.dateReceived}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Farmer Details</div>
            <div className="space-y-1.5 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{data.farmerName}</span></div>
              <div><span className="text-gray-500">Digital ID:</span> <span className="font-mono">{data.farmerDigitalId}</span></div>
              <div><span className="text-gray-500">Agent:</span> {data.agentName} ({data.agentCode})</div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Storage Details</div>
            <div className="space-y-1.5 text-sm">
              <div><span className="text-gray-500">Hub:</span> <span className="font-medium">{data.hubName}</span></div>
              <div><span className="text-gray-500">Hub Code:</span> <span className="font-mono">{data.hubCode}</span></div>
              <div><span className="text-gray-500">Batch ID:</span> <span className="font-mono text-xs">{data.batchId.slice(0, 8)}...</span></div>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Commodity</th>
                <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Grade</th>
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Qty (kg)</th>
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Unit Price</th>
                <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-3 font-medium">{data.commodity}</td>
                <td className="px-4 py-3"><span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">{data.grade}</span></td>
                <td className="px-4 py-3 text-right">{data.quantityKg.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{data.currency} {data.unitPrice.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-semibold">{data.currency} {data.totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 bg-gray-50">
                <td colSpan={4} className="px-4 py-3 font-bold text-right">TOTAL PAYABLE</td>
                <td className="px-4 py-3 text-right font-bold text-green-800 text-base">{data.currency} {data.totalValue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {data.notes && <div className="text-sm text-gray-600 mb-6"><span className="font-medium">Notes:</span> {data.notes}</div>}

        <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
          <div>
            <div className="text-xs text-gray-500 mb-6">Received By (Agent)</div>
            <div className="border-b border-gray-400 h-px mb-1"></div>
            <div className="text-xs text-gray-400">Signature & Date</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-6">Acknowledged By (Farmer)</div>
            <div className="border-b border-gray-400 h-px mb-1"></div>
            <div className="text-xs text-gray-400">Signature & Date</div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 mt-6 pt-4 border-t border-gray-200">
          This document is electronically generated by AGRINET RURALPAY. Valid without physical signature when submitted digitally.
        </div>
      </div>
    </div>
  );
}
