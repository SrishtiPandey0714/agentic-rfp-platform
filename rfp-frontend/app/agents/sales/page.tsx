import { UserGroupIcon, ChartBarIcon, CurrencyDollarIcon, TagIcon } from '@heroicons/react/24/outline';

const salesStats = [
  { name: 'Total Opportunities', value: '12', change: '+2', changeType: 'positive', icon: UserGroupIcon },
  { name: 'In Pipeline', value: '8', change: '+1', changeType: 'positive', icon: ChartBarIcon },
  { name: 'Won Deals', value: '3', change: '0', changeType: 'neutral', icon: CurrencyDollarIcon },
  { name: 'Lost Deals', value: '1', change: '0', changeType: 'negative', icon: TagIcon },
];

const salesOpportunities = [
  {
    id: 'OP-2024-015',
    title: 'Metro Rail Power Cables',
    company: 'Delhi Metro Rail Corporation',
    value: '$2.5M',
    stage: 'Proposal',
    probability: '75%',
    expectedClose: 'Jan 15, 2025',
  },
  {
    id: 'OP-2024-016',
    title: 'Industrial Cables - Phase 2',
    company: 'Tata Steel Limited',
    value: '$1.8M',
    stage: 'Negotiation',
    probability: '60%',
    expectedClose: 'Feb 28, 2025',
  },
  {
    id: 'OP-2024-017',
    title: 'Data Center Infrastructure',
    company: 'Adani Data Centers',
    value: '$3.2M',
    stage: 'Qualification',
    probability: '40%',
    expectedClose: 'Mar 10, 2025',
  },
];

export default function SalesAgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Track and manage your sales pipeline and opportunities</p>
        </div>
        <button className="btn-primary">
          <UserGroupIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Opportunity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {salesStats.map((stat) => (
          <div key={stat.name} className="dashboard-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 
                      stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                    }`}>
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Pipeline</h3>
          <p className="mt-1 text-sm text-gray-500">Track your sales opportunities and their progress</p>
        </div>
        <div className="dashboard-card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-1/4">OPPORTUNITY</th>
                  <th className="w-1/5">COMPANY</th>
                  <th className="w-1/6">VALUE</th>
                  <th className="w-1/6">STAGE</th>
                  <th className="w-1/6">PROBABILITY</th>
                  <th className="w-1/6">EXPECTED CLOSE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesOpportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{opp.title}</div>
                      <div className="text-sm text-gray-500">{opp.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{opp.company}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {opp.value}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: opp.probability }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{opp.probability}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {opp.expectedClose}
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
