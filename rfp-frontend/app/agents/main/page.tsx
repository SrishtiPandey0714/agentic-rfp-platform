import { ArrowPathIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const stats = [
  { name: 'Total RFPs', value: '3', change: '+2', changeType: 'positive', subtext: 'Due within 3 months', icon: DocumentTextIcon },
  { name: 'Not Started', value: '1', change: '+1', changeType: 'neutral', subtext: 'Awaiting response', icon: ClockIcon },
  { name: 'In Progress', value: '1', change: '0', changeType: 'neutral', subtext: 'Being processed', icon: ArrowPathIcon },
  { name: 'Completed', value: '1', change: '0', changeType: 'neutral', subtext: 'Ready to submit', icon: CheckCircleIcon },
];

const activeRfps = [
  {
    id: 'RFP-2024-001',
    title: 'Power Cable Supply for Metro Rail Project',
    issuer: 'Delhi Metro Rail Corporation',
    dueDate: 'Jan 15, 2025',
    status: 'Not Started',
    isOverdue: true,
  },
  {
    id: 'RFP-2024-002',
    title: 'Industrial Cable Supply for Manufacturing Plant',
    issuer: 'Tata Steel Limited',
    dueDate: 'Feb 28, 2025',
    status: 'In Progress',
    isOverdue: true,
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

export default function MainAgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFP Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and respond to RFPs with AI-powered automation</p>
        </div>
        <button className="btn-primary">
          <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" />
          Scan RFP Sources
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="dashboard-card">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      {stat.change}
                    </div>
                  </dd>
                  <p className="mt-1 text-sm text-gray-500">{stat.subtext}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active RFPs */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Active RFPs</h3>
          <p className="mt-1 text-sm text-gray-500">Click on any RFP to view details and generate response</p>
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
                {activeRfps.map((rfp) => (
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
                      <a href={`/agents/main/rfp/${rfp.id}`} className="text-blue-600 hover:text-blue-900">
                        View
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
