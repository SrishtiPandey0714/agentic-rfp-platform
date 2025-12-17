'use client';

import { useMemo } from 'react';
import { useRfp } from '@/contexts/RfpContext';
import {
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export default function SalesAgentDashboard() {
  const { rfpData } = useRfp();

  // ---------------------------
  // Derived Sales Opportunities
  // ---------------------------
  const salesOpportunities = useMemo(() => {
    if (!rfpData) return [];

    return [
      {
        id: rfpData.rfp_id,
        title: rfpData.title,
        company: rfpData.issuer,
        value: `₹ ${rfpData.summary.grand_total_cost.toLocaleString()}`,
        stage: 'Proposal',
        probability: '75%',
        expectedClose: rfpData.due_date,
      },
    ];
  }, [rfpData]);

  // ---------------------------
  // Sales Stats
  // ---------------------------
  const salesStats = useMemo(() => {
    return [
      {
        name: 'Total Opportunities',
        value: salesOpportunities.length.toString(),
        change: '+1',
        changeType: 'positive',
        icon: UserGroupIcon,
      },
      {
        name: 'In Pipeline',
        value: salesOpportunities.length.toString(),
        change: '+1',
        changeType: 'positive',
        icon: ChartBarIcon,
      },
      {
        name: 'Won Deals',
        value: '0',
        change: '0',
        changeType: 'neutral',
        icon: CurrencyDollarIcon,
      },
      {
        name: 'Lost Deals',
        value: '0',
        change: '0',
        changeType: 'neutral',
        icon: TagIcon,
      },
    ];
  }, [salesOpportunities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage your sales pipeline and opportunities
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {salesStats.map((stat) => (
          <div key={stat.name} className="dashboard-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div
                      className={`ml-2 text-sm font-semibold ${stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-500'
                        }`}
                    >
                      {stat.change}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Pipeline */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg font-medium text-gray-900">Sales Pipeline</h3>
          <p className="mt-1 text-sm text-gray-500">
            Opportunities generated from AI-processed RFPs
          </p>
        </div>

        <div className="dashboard-card-body">
          {salesOpportunities.length === 0 ? (
            <p className="text-sm text-gray-500">
              Run the Main Agent to generate sales opportunities.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>OPPORTUNITY</th>
                    <th>COMPANY</th>
                    <th>VALUE</th>
                    <th>STAGE</th>
                    <th>PROBABILITY</th>
                    <th>EXPECTED CLOSE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesOpportunities.map((opp) => (
                    <tr key={opp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {opp.title}
                        </div>
                        <div className="text-sm text-gray-500">{opp.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{opp.company}</td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {opp.value}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {opp.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: opp.probability }}
                          />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {opp.probability}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {opp.expectedClose}
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
