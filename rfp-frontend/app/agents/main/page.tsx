'use client';

import { useState } from 'react';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

import { runFullRfpPipeline } from '@/lib/api';
import { useRfp } from '@/context/RfpContext';

export default function MainAgentDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { rfpData, setRfpData } = useRfp();

  const handleScan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await runFullRfpPipeline();
      setRfpData(response.data); // ✅ FIX

    } catch (err: any) {
      setError(err?.message || 'Pipeline failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            RFP Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and respond to RFPs with AI-powered automation
          </p>
        </div>

        <button
          className="btn-primary flex items-center"
          onClick={handleScan}
          disabled={loading}
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          {loading ? 'Processing...' : 'Scan RFP Sources'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty */}
      {!rfpData && !loading && (
        <div className="dashboard-card p-6 text-gray-500">
          Click <b>Scan RFP Sources</b> to run the AI pipeline.
        </div>
      )}

      {/* Results */}
      {rfpData && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard
              title="Material Cost"
              value={`₹ ${rfpData.summary?.total_material_cost?.toLocaleString()}`}
              icon={DocumentTextIcon}
            />
            <StatCard
              title="Test Cost"
              value={`₹ ${rfpData.summary?.total_test_cost?.toLocaleString()}`}
              icon={ClockIcon}
            />
            <StatCard
              title="Grand Total"
              value={`₹ ${rfpData.summary?.grand_total_cost?.toLocaleString()}`}
              icon={CheckCircleIcon}
            />
          </div>

          {/* RFP Info */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold">{rfpData.title}</h3>
            <p className="text-sm text-gray-600">
              Issuer: {rfpData.issuer}
            </p>
            <p className="text-sm text-gray-600">
              Due Date: {rfpData.due_date}
            </p>
          </div>

          {/* Line Items */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="text-lg font-medium">
                Technical & Pricing Summary
              </h3>
            </div>

            <div className="dashboard-card-body space-y-4">
              {rfpData.pricing_analysis?.pricing_summary?.map((item: any) => (
                <div key={item.item_no} className="border rounded-md p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Item {item.item_no}</p>
                      <p className="text-sm text-gray-500">
                        SKU: {item.sku}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹ {item.total_cost.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="dashboard-card p-5">
      <div className="flex items-center">
        <Icon className="h-6 w-6 text-gray-400" />
        <div className="ml-4">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
