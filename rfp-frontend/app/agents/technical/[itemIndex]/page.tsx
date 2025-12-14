'use client';

import { useParams } from 'next/navigation';
import { useRfp } from '@/context/RfpContext';

export default function TechnicalItemDetail() {
  const { itemId } = useParams();
  const { rfpData } = useRfp();

  if (!rfpData?.technical_analysis?.items) {
    return (
      <div className="dashboard-card p-6 text-gray-500">
        Run the Main Agent to load technical data.
      </div>
    );
  }

  // 🔥 CORRECT lookup
  const item = rfpData.technical_analysis.items.find(
    (i: any) => String(i.item_index) === String(itemId)
  );

  if (!item) {
    return (
      <div className="dashboard-card p-6 text-red-600">
        Technical item not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Technical Deep Dive — Item {item.item_index}
      </h1>

      <div className="dashboard-card p-6 space-y-3">
        <p>
          <b>Description:</b> {item.description}
        </p>
        <p>
          <b>Recommended SKU:</b> {item.final_recommended_sku}
        </p>
        <p>
          <b>Match Confidence:</b> {item.final_match_percent}%
        </p>

        {item.mismatch_reasons?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-red-600">
              Mismatch Reasons
            </h3>
            <ul className="list-disc ml-6 text-sm">
              {item.mismatch_reasons.map((r: string, idx: number) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
