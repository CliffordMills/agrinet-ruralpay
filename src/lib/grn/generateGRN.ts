export interface GRNData {
  grnNumber: string;
  batchId: string;
  farmerName: string;
  farmerDigitalId: string;
  agentName: string;
  agentCode: string;
  hubName: string;
  hubCode: string;
  commodity: string;
  grade: string;
  quantityKg: number;
  unitPrice: number;
  totalValue: number;
  currency: string;
  dateReceived: string;
  notes?: string;
}

export function generateGRNNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `GRN-${year}${month}${day}-${random}`;
}

export function formatGRNForPrint(data: GRNData): string {
  return `
GOODS RECEIVED NOTE (GRN)
==========================
GRN No:       ${data.grnNumber}
Date:         ${data.dateReceived}

AGRINET RURALPAY
Ghana Agricultural Network

------------------------------------------
FARMER DETAILS
------------------------------------------
Name:         ${data.farmerName}
Digital ID:   ${data.farmerDigitalId}
Agent:        ${data.agentName} (${data.agentCode})

------------------------------------------
COMMODITY DETAILS
------------------------------------------
Commodity:    ${data.commodity}
Grade:        ${data.grade}
Quantity:     ${data.quantityKg.toLocaleString()} kg
Unit Price:   ${data.currency} ${data.unitPrice.toFixed(2)}/kg
Total Value:  ${data.currency} ${data.totalValue.toFixed(2)}

------------------------------------------
STORAGE DETAILS
------------------------------------------
Hub:          ${data.hubName}
Hub Code:     ${data.hubCode}
Batch ID:     ${data.batchId}

${data.notes ? `Notes: ${data.notes}` : ""}

------------------------------------------
Received By: _______________________
Signature:   _______________________
Date:        _______________________

This document is computer-generated and valid without signature
when submitted electronically through AGRINET RURALPAY.
  `.trim();
}
