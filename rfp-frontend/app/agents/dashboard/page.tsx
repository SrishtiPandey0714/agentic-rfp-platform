'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Users, BarChart3, DollarSign, Award } from 'lucide-react';
import { KPICard } from './components/KPICard';
import { PipelineStatusChart } from './components/PipelineStatusChart';
import { AgentContributionChart } from './components/AgentContributionChart';
import { TechnicalSpecChart } from './components/TechnicalSpecChart';
import { PricingBreakdownChart } from './components/PricingBreakdownChart';
import { WinProbabilityChart } from './components/WinProbabilityChart';
import { fetchDashboardStats } from '@/lib/api';

// TypeScript interface for dashboard data
interface DashboardData {
  pipelineStatus: {
    labels: string[];
    counts: number[];
  };
  agentContribution: {
    agents: string[];
    tasks: number[];
  };
  technicalSpecs: {
    items: string[];
    match_scores: number[];
  };
  pricingBreakdown: {
    rfps: string[];
    material_cost: number[];
    testing_cost: number[];
  };
  winProbability: {
    rfps: string[];
    win_probability: number[];
  };
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real data from backend API
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchDashboardStats();
        setDashboardData(response.data);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if data failed to load
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Failed to load dashboard data</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate KPIs
  const totalRFPs = dashboardData.pipelineStatus.counts[0]; // Total discovered RFPs
  const wonRFPs = dashboardData.pipelineStatus.counts[4]; // Won RFPs
  const winRate = Math.round((wonRFPs / totalRFPs) * 100);
  const avgResponseTime = 3.2; // In days

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-8">
        <LayoutDashboard className="h-6 w-6 mr-2" />
        <h1 className="text-2xl font-bold">RFP Analytics Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <KPICard
          title="Total RFPs"
          value={totalRFPs}
          description="Total RFPs discovered"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Win Rate"
          value={`${winRate}%`}
          description="Of submitted RFPs"
          icon={<Award className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Avg. Response Time"
          value={`${avgResponseTime} days`}
          description="To submit response"
          icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        />
        <KPICard
          title="Active Agents"
          value={3}
          description="AI agents working"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <PipelineStatusChart data={dashboardData.pipelineStatus} />
        </div>
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <AgentContributionChart data={dashboardData.agentContribution} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <TechnicalSpecChart data={dashboardData.technicalSpecs} />
        </div>
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <PricingBreakdownChart data={dashboardData.pricingBreakdown} />
        </div>
      </div>

      {/* Full Width Chart */}
      <div className="p-4 border rounded-lg bg-white shadow-sm mb-8">
        <WinProbabilityChart data={dashboardData.winProbability} />
      </div>

      {/* AI Insights Section */}
      <div className="p-6 bg-blue-50 rounded-lg border border-blue-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          AI-Powered Insights
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Pipeline Health</h3>
            <p className="text-sm text-gray-600">
              The conversion rate from Discovered to Won is {winRate}%. Focus on improving the pricing strategy for RFPs in the 'Priced' stage.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Technical Matching</h3>
            <p className="text-sm text-gray-600">
              Average technical specification match is 86.8%. Consider expanding your product catalog for better matches.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Win Probability</h3>
            <p className="text-sm text-gray-600">
              Focus on high-probability RFPs (70%+) to maximize win rate. Currently, 40% of RFPs fall into this category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
