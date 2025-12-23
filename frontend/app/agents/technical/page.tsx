'use client';

import dynamic from 'next/dynamic';

// Dynamically import with SSR disabled to prevent build-time pre-rendering
const TechnicalAgentContent = dynamic(() => import('./TechnicalAgentContent'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">
    <div className="text-gray-600">Loading Technical Agent...</div>
  </div>
});

export default function TechnicalAgentPage() {
  return <TechnicalAgentContent />;
}
