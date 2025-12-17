'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type RFP = {
  id: string;
  name: string;
  issuer: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
};

export default function Home() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchRFPs = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockRfps: RFP[] = [
        {
          id: '1',
          name: 'HV Cable Supply - City Power Project',
          issuer: 'City Power Corporation',
          dueDate: '2025-01-15',
          status: 'Not Started'
        },
        {
          id: '2',
          name: 'Underground Cable Tender - Metro Rail',
          issuer: 'Metro Rail Authority',
          dueDate: '2025-01-30',
          status: 'In Progress'
        },
        {
          id: '3',
          name: 'Solar Farm Cable Supply',
          issuer: 'Green Energy Solutions',
          dueDate: '2025-02-10',
          status: 'Not Started'
        }
      ];
      
      setRfps(mockRfps);
      setIsLoading(false);
    };

    fetchRFPs();
  }, []);

  const handleScanRFPs = async () => {
    setIsLoading(true);
    // In a real app, this would call the backend API
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Refresh the RFP list
    // fetchRFPs();
    setIsLoading(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">RFP Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all RFPs that need your attention.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            onClick={handleScanRFPs}
            disabled={isLoading}
          >
            {isLoading ? 'Scanning...' : 'Scan RFP URLs'}
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      RFP Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Issuer
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Due Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rfps.map((rfp) => (
                    <tr key={rfp.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {rfp.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {rfp.issuer}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(rfp.dueDate).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          rfp.status === 'Completed' 
                            ? 'bg-green-100 text-green-800' 
                            : rfp.status === 'In Progress' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rfp.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={`/rfp/${rfp.id}`} className="text-blue-600 hover:text-blue-900">
                          View<span className="sr-only">, {rfp.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
