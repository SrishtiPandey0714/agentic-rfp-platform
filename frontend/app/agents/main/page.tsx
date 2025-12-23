'use client';

import dynamic from 'next/dynamic';

// Dynamically import the dashboard component with SSR disabled
// This prevents the page from being pre-rendered during build
const MainAgentDashboard = dynamic(() => import('./MainAgentDashboardClient'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">
    <div className="text-gray-600">Loading Main Agent Dashboard...</div>
  </div>
});

/**
 * Main Agent Page
 *
 * This is the main orchestrator agent that:
 * - Coordinates all worker agents (Sales, Technical, Pricing)
 * - Displays the RFP dashboard with analytics
 * - Shows the consolidated RFP response
 */
export default function MainAgentPage() {
  return <MainAgentDashboard />;
}
