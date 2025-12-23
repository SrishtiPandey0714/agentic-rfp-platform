'use client';

import { useParams } from 'next/navigation';
import { useRfp } from '@/contexts/RfpContext';

export default function TechnicalItemView() {
  const params = useParams();
  const itemIndex = Number(params.itemIndex);
  const { rfpData } = useRfp();

  /* ---------- Safety check ---------- */
  if (!rfpData?.technical_analysis?.items) {
    return (
      <div className="dashboard-card p-6 text-gray-500">
        Run the Main Agent to load technical data.
      </div>
    );
  }

  /* ---------- Find item ---------- */
  const item = rfpData.technical_analysis.items.find(
    (i: any) => Number(i.item_index) === itemIndex
  );

  if (!item) {
    return (
      <div className="dashboard-card p-6 text-red-600">
        Technical item not found.
      </div>
    );
  }

  /* ---------- Comparison logic ---------- */
  const comparison = item.comparison_table;

  const recommendedSku = comparison.skus.find(
    (s: any) => s.sku_id === item.final_recommended_sku
  );

  const matchedParams = comparison.parameters.filter(
    (param: string) =>
      recommendedSku?.values[param] === comparison.rfp_values[param]
  );

  const mismatchedParams = comparison.parameters.filter(
    (param: string) =>
      recommendedSku?.values[param] !== comparison.rfp_values[param]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Technical Deep Dive
        </h1>
        <p className="text-sm text-gray-500">
          Detailed evaluation of RFP line item
        </p>
      </div>

      {/* Item Summary */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-2">
          Item {item.item_index}
        </h3>

        <p className="text-sm text-gray-700">
          {item.description}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Info
            label="Recommended SKU"
            value={item.final_recommended_sku}
          />
          <Info
            label="Match %"
            value={`${item.final_match_percent}%`}
          />
          <Info
            label="Standard"
            value={item.rfp_specs?.standard || 'IS / IEC'}
          />
        </div>
      </div>

      {/* Why this SKU */}
      <div className="dashboard-card p-6 border-l-4 border-blue-500 bg-blue-50">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Why this SKU was selected
        </h3>

        <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
          <li>
            Highest overall match score (
            <b>{item.final_match_percent}%</b>)
          </li>

          <li>
            Matches <b>{matchedParams.length}</b> out of{' '}
            <b>{comparison.parameters.length}</b> RFP parameters
          </li>

          {matchedParams.length > 0 && (
            <li>
              Exact matches:
              <span className="ml-1 text-blue-700 font-medium">
                {matchedParams.join(', ')}
              </span>
            </li>
          )}

          {mismatchedParams.length > 0 ? (
            <li>
              Minor deviations:
              <span className="ml-1 text-yellow-700 font-medium">
                {mismatchedParams.join(', ')}
              </span>
            </li>
          ) : (
            <li className="text-blue-700 font-medium">
              No deviations from RFP specifications
            </li>
          )}
        </ul>
      </div>

      {/* SKU Comparison Table */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium">
            SKU Comparison Table
          </h3>
          <p className="text-sm text-gray-500">
            Side-by-side comparison against RFP specifications
          </p>
        </div>

        <div className="dashboard-card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>PARAMETER</th>
                  <th>RFP VALUE</th>
                  {comparison.skus.map((sku: any) => {
                    const isRecommended =
                      sku.sku_id === item.final_recommended_sku;

                    return (
                      <th
                        key={sku.sku_id}
                        className={
                          isRecommended
                            ? 'bg-green-50 text-green-800 font-semibold'
                            : ''
                        }
                      >
                        {sku.sku_id}
                        {isRecommended && (
                          <span className="ml-2 text-xs bg-green-200 text-green-900 px-2 py-0.5 rounded-full">
                            Recommended
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {comparison.parameters.map((param: string) => (
                  <tr key={param}>
                    <td className="font-medium">{param}</td>
                    <td>
                      {comparison.rfp_values[param] || '-'}
                    </td>

                    {comparison.skus.map((sku: any) => {
                      const isRecommended =
                        sku.sku_id === item.final_recommended_sku;

                      const isMatch =
                        sku.values[param] ===
                        comparison.rfp_values[param];

                      return (
                        <td
                          key={sku.sku_id}
                          className={`${isRecommended
                            ? 'bg-green-50 font-medium'
                            : ''
                            } ${isMatch
                              ? 'text-green-700'
                              : 'text-gray-600'
                            }`}
                        >
                          {sku.values[param] || '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Info Block ---------- */
function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}
