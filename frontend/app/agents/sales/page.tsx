'use client';

import dynamic from 'next/dynamic';

// Dynamically import with SSR disabled to prevent build-time pre-rendering
const SalesAgentContent = dynamic(() => import('./SalesAgentContent'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">
    <div className="text-gray-600">Loading Sales Agent...</div>
  </div>
});

export default function SalesAgentPage() {
  return <SalesAgentContent />;
}
