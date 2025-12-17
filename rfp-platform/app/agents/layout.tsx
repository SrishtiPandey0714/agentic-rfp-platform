'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './agents.css';

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900">RFP Agent</span>
              </div>
              <nav className="hidden md:flex space-x-2">
                <Link
                  href="/agents/main"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/agents/main')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  Main Agent
                </Link>
                <Link
                  href="/agents/pricing"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/agents/pricing')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  Pricing Agent
                </Link>
                <Link
                  href="/agents/sales"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/agents/sales')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  Sales Agent
                </Link>
                <Link
                  href="/agents/technical"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/agents/technical')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  Technical Agent
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}