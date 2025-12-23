'use client';

import dynamic from 'next/dynamic';

// Dynamically import with SSR disabled to prevent build-time pre-rendering
const PricingAgentContent = dynamic(() => import('./PricingAgentContent'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">
    <div className="text-gray-600">Loading Pricing Agent...</div>
  </div>
});

export default function PricingAgentPage() {
  return <PricingAgentContent />;
}
