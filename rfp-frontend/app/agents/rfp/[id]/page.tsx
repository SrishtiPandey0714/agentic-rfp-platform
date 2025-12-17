// app/agents/main/rfp/[id]/page.tsx
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function RfpDetailPage({ params }: { params: { id: string } }) {
  const rfp = {
    id: params.id,
    title: 'Power Cable Supply for Metro Rail Project',
    issuer: 'Delhi Metro Rail Corporation',
    dueDate: 'Jan 15, 2025',
    status: 'Not Started',
    isOverdue: true,
    description: 'Supply of power cables for the upcoming metro rail project phase 3. The cables must meet all specified technical requirements and safety standards.',
    requirements: [
      'XLPE insulated, armoured power cables',
      'Voltage rating: 33kV',
      'Conductor material: Copper',
      'Minimum order quantity: 10,000 meters',
      'Delivery deadline: 3 months from PO'
    ],
    attachments: [
      { name: 'Technical Specifications.pdf', size: '2.4 MB' },
      { name: 'Commercial Terms.docx', size: '1.1 MB' },
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/agents/main" className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{rfp.title}</h1>
            <p className="mt-1 text-sm text-gray-500">RFP ID: {rfp.id}</p>
          </div>
          <div className="flex space-x-3">
            <button className="btn-outline">Download Documents</button>
            <button className="btn-primary">Generate Response</button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">RFP Information</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Issuer</dt>
              <dd className="mt-1 text-sm text-gray-900">{rfp.issuer}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Due Date</dt>
              <dd className={`mt-1 text-sm ${rfp.isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                {rfp.dueDate}
                {rfp.isOverdue && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span className={`status-badge status-${rfp.status.toLowerCase().replace(' ', '-')}`}>
                  {rfp.status}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{rfp.description}</dd>
            </div>
          </dl>

          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-500">Requirements</h4>
            <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
              {rfp.requirements.map((req, index) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 truncate">{req}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-500">Attachments</h4>
            <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
              {rfp.attachments.map((file, index) => (
                <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                  <div className="w-0 flex-1 flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className="text-gray-500">{file.size}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}