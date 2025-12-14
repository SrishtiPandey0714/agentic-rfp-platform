// Update the import in pricing/page.tsx
import { CurrencyDollarIcon, ScaleIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
const pricingStats = [
  { name: 'Total RFPs', value: '3', subtext: 'Requiring pricing', icon: CurrencyDollarIcon },
  { name: 'Pricing Pending', value: '1', subtext: 'Needs review', icon: ScaleIcon },
  { name: 'In Review', value: '1', subtext: 'Under evaluation', icon: ArrowPathIcon },
  { name: 'Completed', value: '1', subtext: 'Pricing finalized', icon: CheckCircleIcon },
];

const pricingRfps = [
  {
    id: 'RFP-2024-001',
    title: 'Power Cable Supply for Metro Rail Project',
    issuer: 'Delhi Metro Rail Corporation',
    dueDate: 'Jan 15, 2025',
    status: 'Pending',
    isOverdue: true,
  },
  {
    id: 'RFP-2024-002',
    title: 'Industrial Cable Supply for Manufacturing Plant',
    issuer: 'Tata Steel Limited',
    dueDate: 'Feb 28, 2025',
    status: 'In Review',
    isOverdue: false,
  },
  {
    id: 'RFP-2024-003',
    title: 'HV Cable Infrastructure for Data Center',
    issuer: 'Adani Data Centers',
    dueDate: 'Mar 10, 2025',
    status: 'Completed',
    isOverdue: false,
  },
];

export default function PricingAgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and review pricing for RFPs</p>
        </div>
        <button className="btn-primary">
          <CurrencyDollarIcon className="-ml-1 mr-2 h-5 w-5" />
          Generate Pricing
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {pricingStats.map((stat) => (
          <div key={stat.name} className="dashboard-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  <p className="mt-1 text-sm text-gray-500">{stat.subtext}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing RFPs */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Pricing Requests</h3>
          <p className="mt-1 text-sm text-gray-500">Review and update pricing for active RFPs</p>
        </div>
        <div className="dashboard-card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-2/5">RFP DETAILS</th>
                  <th className="w-1/5">ISSUER</th>
                  <th className="w-1/5">DUE DATE</th>
                  <th className="w-1/10">STATUS</th>
                  <th className="w-1/10">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pricingRfps.map((rfp) => (
                  <tr key={rfp.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{rfp.title}</div>
                      <div className="text-sm text-gray-500">{rfp.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{rfp.issuer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${rfp.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {rfp.dueDate}
                        {rfp.isOverdue && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge status-${rfp.status.toLowerCase().replace(' ', '-')}`}>
                        {rfp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <a href={`/agents/pricing/rfp/${rfp.id}`} className="text-blue-600 hover:text-blue-900">
                        Review
                      </a>
                    </td>
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
