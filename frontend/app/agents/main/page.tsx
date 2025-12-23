'use client';

export const dynamic = 'force-dynamic';

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

  useEffect(() => {
    console.log('[Main Agent] Page loaded');
  }, []);

  // Pass RFP data to dashboard for insights
  return <MainAgentDashboard rfpData={rfpData} />;
}
