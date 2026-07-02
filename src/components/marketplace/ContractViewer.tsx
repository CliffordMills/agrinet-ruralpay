interface ContractData {
  id: string;
  contract_number: string;
  commodity: string;
  grade: string;
  quantity_tonnes: number;
  price_per_kg: number;
  total_value: number;
  currency: string;
  delivery_date: string | null;
  status: string;
  buyer_name: string;
  hub_name: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-blue-100 text-blue-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  complete: "bg-gray-100 text-gray-800",
};

export default function ContractViewer({ contract }: { contract: ContractData }) {
  return (
    <div className="bg-white text-gray-900 border-2 border-gray-300 rounded-lg p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-2xl font-bold text-green-800">AGRINET RURALPAY</div>
          <div className="text-sm text-gray-500 mt-1">Commodity Sales Contract</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Contract No.</div>
          <div className="text-xl font-mono font-bold mt-1">{contract.contract_number}</div>
          <span className={`mt-2 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[contract.status] || "bg-gray-100 text-gray-800"}`}>{contract.status.toUpperCase()}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div><div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Buyer</div><div className="font-medium">{contract.buyer_name}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Storage Hub</div><div className="font-medium">{contract.hub_name}</div></div>
        <div><div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Contract Date</div><div>{new Date(contract.created_at).toLocaleDateString("en-GH")}</div></div>
        {contract.delivery_date && <div><div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Delivery Date</div><div>{new Date(contract.delivery_date).toLocaleDateString("en-GH")}</div></div>}
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="text-left px-4 py-2.5 font-semibold text-gray-600">Commodity</th><th className="text-left px-4 py-2.5 font-semibold text-gray-600">Grade</th><th className="text-right px-4 py-2.5 font-semibold text-gray-600">Qty (t)</th><th className="text-right px-4 py-2.5 font-semibold text-gray-600">Price/kg</th><th className="text-right px-4 py-2.5 font-semibold text-gray-600">Total</th></tr></thead>
          <tbody><tr className="border-t border-gray-200"><td className="px-4 py-3 font-medium">{contract.commodity}</td><td className="px-4 py-3"><span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">{contract.grade}</span></td><td className="px-4 py-3 text-right">{contract.quantity_tonnes.toLocaleString()}</td><td className="px-4 py-3 text-right">{contract.currency} {contract.price_per_kg.toFixed(2)}</td><td className="px-4 py-3 text-right font-semibold">{contract.currency} {contract.total_value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td></tr></tbody>
          <tfoot><tr className="border-t-2 border-gray-300 bg-gray-50"><td colSpan={4} className="px-4 py-3 font-bold text-right">TOTAL CONTRACT VALUE</td><td className="px-4 py-3 text-right font-bold text-green-800 text-base">{contract.currency} {contract.total_value.toLocaleString("en-GH", { minimumFractionDigits: 2 })}</td></tr></tfoot>
        </table>
      </div>
      <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-200">This contract is legally binding between AGRINET RURALPAY and the buyer named above. All transactions governed by Ghana commodity trading regulations.</div>
    </div>
  );
}
