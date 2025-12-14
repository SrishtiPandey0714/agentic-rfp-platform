'use client';

import { useState } from 'react';
import { useRfp } from '@/context/RfpContext';

import {
  WrenchScrewdriverIcon,
  DocumentCheckIcon,
  CpuChipIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

import SkuComparisonModal from '@/components/SkuComparisonModal';
import { exportToExcel } from '@/utils/exportExcel';

export default function TechnicalAgentDashboard() {
  const { rfpData } = useRfp();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  /* ---------------- EMPTY STATE ---------------- */
  if (!rfpData?.technical_analysis) {
    return (
      <div className="dashboard-card p-6 text-gray-500">
        <h2 className="text-lg font-semibold mb-2">
          Technical Line Items
        </h2>
        <p>Auto-evaluated against SKU database</p>
        <p className="mt-2 text-sm text-gray-400">
          Run the Main Agent to generate technical reviews.
        </p>
      </div>
    );
  }

  const items = rfpData.technical_analysis.items;

  /* ---------------- STATS ---------------- */
  const technicalStats = [
    {
      name: 'Total Items',
      value: items.length,
      subtext: 'Detected line items',
      icon: WrenchScrewdriverIcon,
    },
    {
      name: 'Matched',
      value: items.filter((i: any) => i.final_match_percent === 100).length,
      subtext: 'Perfect matches',
      icon: CheckCircleIcon,
    },
    {
      name: 'Needs Review',
      value: items.filter((i: any) => i.final_match_percent < 100).length,
      subtext: 'Partial matches',
      icon: CpuChipIcon,
    },
    {
      name: 'Standards Applied',
      value: 'IS / IEC',
      subtext: 'Compliance checked',
      icon: DocumentCheckIcon,
    },
  ];

  /* ---------------- EXPORT ---------------- */
  const handleExport = () => {
    exportToExcel(items, 'technical_analysis');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Technical Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-evaluated technical specifications & SKU matching
          </p>
        </div>

        <button className="btn-primary" onClick={handleExport}>
          Export Excel
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {technicalStats.map((stat) => (
          <div key={stat.name} className="dashboard-card p-5">
            <div className="flex items-center">
              <stat.icon className="h-6 w-6 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Technical Items Table */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium">
            Technical Line Items
          </h3>
          <p className="text-sm text-gray-500">
            SKU comparison & compliance overview
          </p>
        </div>

        <div className="dashboard-card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ITEM</th>
                  <th>DESCRIPTION</th>
                  <th>RECOMMENDED SKU</th>
                  <th>MATCH %</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {items.map((item: any) => (
                  <tr key={item.item_index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      Item {item.item_index}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.description}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {item.final_recommended_sku}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.final_match_percent === 100
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.final_match_percent}%
                      </span>
                    </td>

                    <td className="px-6 py-4 flex gap-4 text-sm">
                      {/* View → deep dive */}
                      <a
                        href={`/agents/technical/${item.item_index}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>

                      {/* Compare → modal */}
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-indigo-600 hover:underline"
                      >
                        Compare
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SKU Comparison Modal */}
      {selectedItem && (
        <SkuComparisonModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
