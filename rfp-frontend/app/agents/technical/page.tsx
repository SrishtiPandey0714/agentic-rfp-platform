// Update the import in technical/page.tsx
import { WrenchScrewdriverIcon, DocumentCheckIcon, CpuChipIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const technicalStats = [
  { name: 'Technical Reviews', value: '3', subtext: 'Requiring technical input', icon: WrenchScrewdriverIcon },
  { name: 'In Progress', value: '1', subtext: 'Being reviewed', icon: CpuChipIcon },
  { name: 'Pending Approval', value: '1', subtext: 'Awaiting sign-off', icon: DocumentCheckIcon },
  { name: 'Completed', value: '1', subtext: 'Technical specs ready', icon: CheckCircleIcon },
];

const technicalReviews = [
  {
    id: 'RFP-2024-001',
    title: 'Power Cable Specifications',
    project: 'Metro Rail Power Supply',
    dueDate: 'Jan 10, 2025',
    status: 'Review',
    priority: 'High',
    assignedTo: 'John D.',
  },
  {
    id: 'RFP-2024-002',
    title: 'Industrial Cable Specs',
    project: 'Tata Steel Plant',
    dueDate: 'Feb 25, 2025',
    status: 'In Progress',
    priority: 'Medium',
    assignedTo: 'Sarah K.',
  },
  {
    id: 'RFP-2024-003',
    title: 'HV Cable Requirements',
    project: 'Adani Data Center',
    dueDate: 'Mar 5, 2025',
    status: 'Completed',
    priority: 'Low',
    assignedTo: 'Mike R.',
  },
];

export default function TechnicalAgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technical Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Manage technical specifications and requirements</p>
        </div>
        <button className="btn-primary">
          <WrenchScrewdriverIcon className="-ml-1 mr-2 h-5 w-5" />
          New Technical Review
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {technicalStats.map((stat) => (
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

      {/* Technical Reviews */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Technical Reviews</h3>
          <p className="mt-1 text-sm text-gray-500">Track and manage technical specifications review process</p>
        </div>
        <div className="dashboard-card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-1/5">REVIEW ITEM</th>
                  <th className="w-1/5">PROJECT</th>
                  <th className="w-1/6">DUE DATE</th>
                  <th className="w-1/6">PRIORITY</th>
                  <th className="w-1/6">STATUS</th>
                  <th className="w-1/6">ASSIGNED TO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {technicalReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{review.title}</div>
                      <div className="text-sm text-gray-500">{review.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{review.project}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {review.dueDate}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        review.priority === 'High' ? 'bg-red-100 text-red-800' :
                        review.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {review.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge status-${review.status.toLowerCase().replace(' ', '-')}`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {review.assignedTo}
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
