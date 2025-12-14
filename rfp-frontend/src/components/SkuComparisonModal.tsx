'use client';

import { useParams } from 'next/navigation';
import { useRfp } from '@/context/RfpContext';

export default function TechnicalItemDetailPage() {
  const { itemIndex } = useParams();
  const { rfpData } = useRfp();

  if (!rfpData?.technical_analysis) {
    return (
      <div className="dashboard-card p-6 text-gray-500">
        Run the Main Agent to load technical data.
      </div>
    );
  }

  const item = rfpData.technical_analysis.items.find(
    (i: any) => String(i.item_index) === String(itemIndex)
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
      <h1 className="text-2xl font-bold text-gray-900">
        Technical Deep Dive — Item {item.item_index}
      </h1>

      {/* Description */}
      <div className="dashboard-card p-6">
        <p className="text-gray-700">{item.description}</p>
      </div>

      {/* RFP Specs */}
      <div className="dashboard-card p-6">
        <h3 className="font-semibold mb-2">RFP Specifications</h3>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(item.rfp_specs).map(([key, value]) => (
            <li key={key}>
              <b>{key}:</b> {value as string}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended SKU */}
      <div className="dashboard-card p-6">
        <h3 className="font-semibold mb-2">Recommended SKU</h3>
        <p>
          {item.final_recommended_sku} —{' '}
          <span className="font-semibold text-green-600">
            {item.final_match_percent}% match
          </span>
        </p>
      </div>
    </div>
  );
}
