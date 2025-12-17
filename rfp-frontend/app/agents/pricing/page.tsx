'use client';

import { useMemo } from 'react';
import { useRfp } from '@/contexts/RfpContext';
import {
  CurrencyDollarIcon,
  ScaleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

export default function PricingAgentDashboard() {
  const { rfpData } = useRfp();

  // ---------------------------
  // Pricing Items
  // ---------------------------
  const pricingItems = useMemo(() => {
    if (!rfpData?.pricing_analysis?.pricing_summary) return [];

    return rfpData.pricing_analysis.pricing_summary.map(
      (item: any, index: number) => ({
        id: `${rfpData.rfp_id}-PRICE-${index + 1}`,
        sku: item.sku,
        quantity: item.quantity,
        materialCost: item.material_cost,
        testCost: item.test_cost_total,
        totalCost: item.total_cost,
        status: 'Completed',
      })
    );
  }, [rfpData]);

  // ---------------------------
  // Stats
  // ---------------------------
  const stats = useMemo(() => {
    const total = pricingItems.length;

    return [
      {
        name: 'Total Line Items',
        value: total.toString(),
        subtext: 'Pricing generated',
        icon: CurrencyDollarIcon,
      },
      {
        name: 'Pricing Pending',
        value: '0',
        subtext: 'AI auto-priced',
        icon: ScaleIcon,
      },
      {
        name: 'In Review',
        value: '0',
        subtext: 'No manual review',
        icon: ArrowPathIcon,
      },
      {
        name: 'Completed',
        value: total.toString(),
        subtext: 'Final pricing ready',
        icon: CheckCircleIcon,
      },
    ];
  }, [pricingItems]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Pricing Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-generated pricing summary
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="dashboard-card">
            <div className="p-5 flex items-center">
              <stat.icon className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dt className="text-sm text-gray-500">{stat.name}</dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
                <p className="text-sm text-gray-500">{stat.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Table */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium text-gray-900">
            Pricing Breakdown
          </h3>
          <p className="text-sm text-gray-500">
            Item-wise material & test costs
          </p>
        </div>

        <div className="dashboard-card-body">
          {pricingItems.length === 0 ? (
            <p className="text-sm text-gray-500">
              Run the Main Agent to generate pricing.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>QUANTITY</th>
                    <th>MATERIAL COST</th>
                    <th>TEST COST</th>
                    <th>TOTAL COST</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pricingItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.sku}
                      </td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4">
                        ₹ {item.materialCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        ₹ {item.testCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        ₹ {item.totalCost.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="status-badge status-completed">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
