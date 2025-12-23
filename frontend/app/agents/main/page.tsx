'use client';

import { useEffect } from 'react';
import { useRfp } from '@/contexts/RfpContext';
import MainAgentDashboard from './MainAgentDashboardClient';

/**
 * Main Agent Page
 *
 * This is the main orchestrator agent that:
 * - Coordinates all worker agents (Sales, Technical, Pricing)
 * - Displays the RFP dashboard with analytics
 * - Shows the consolidated RFP response
 */
export default function MainAgentPage() {
  const { rfpData } = useRfp();

  // For build time - return a simple component
  if (typeof window === 'undefined') {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    console.log('[Main Agent] Page loaded');
  }, []);

  // Pass RFP data to dashboard for insights
  return <MainAgentDashboard rfpData={rfpData} />;
}
