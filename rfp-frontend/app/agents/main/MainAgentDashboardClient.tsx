'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowPathIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/outline';

import { runFullRfpPipeline, fetchDashboardStats } from '@/lib/api';
import { useRfp } from '@/contexts/RfpContext';
import { PipelineStatusChart } from '@/app/agents/dashboard/components/PipelineStatusChart';
import { AgentContributionChart } from '@/app/agents/dashboard/components/AgentContributionChart';
import AIInsights from '@/components/AIInsights';

export default function MainAgentDashboard({ rfpData: rfpDataProp }: { rfpData?: any }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { rfpData: contextRfpData, setRfpData } = useRfp();
    const [dashboardData, setDashboardData] = useState<any>(null);

    // Use prop if available, otherwise use context
    const rfpData = rfpDataProp || contextRfpData;
    const [mounted, setMounted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Ensure component is mounted on client
    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch dashboard stats on mount
    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const response = await fetchDashboardStats();
                setDashboardData(response.data);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
            }
        };

        if (mounted) {
            loadDashboard();
        }
    }, [mounted]);

    const handleGetRfpResponse = async () => {
        console.log('[handleGetRfpResponse] Function called');
        try {
            console.log('[handleGetRfpResponse] Setting loading to true');
            setLoading(true);
            setError(null);

            console.log('[handleGetRfpResponse] Calling runFullRfpPipeline...');
            const response = await runFullRfpPipeline();
            console.log('[handleGetRfpResponse] Response:', response);
            setRfpData(response.data);

            // Show results view
            setShowResults(true);

            // Reload dashboard data
            const dashResponse = await fetchDashboardStats();
            setDashboardData(dashResponse.data);

        } catch (err: any) {
            console.error('[handleGetRfpResponse] Error:', err);
            setError(err?.message || 'Pipeline failed');
        } finally {
            console.log('[handleGetRfpResponse] Setting loading to false');
            setLoading(false);
        }
    };

    // Calculate KPIs from dashboard data
    const totalRFPs = dashboardData?.pipelineStatus?.counts?.[0] || 45;
    const wonRFPs = dashboardData?.pipelineStatus?.counts?.[4] || 0;
    const winRate = totalRFPs > 0 ? Math.round((wonRFPs / totalRFPs) * 100) : 20;
    const avgResponseTime = 3.2;
    const activeAgents = 3;

    if (!mounted) {
        return null; // Prevent SSR mismatch
    }

    // If showing results, display RFP details
    if (showResults && rfpData) {
        const data = rfpData as any;
        const pricingData = data.pricing_analysis;
        const summaryData = data.summary;
        const technicalData = data.technical_analysis;

        // Get pricing items (from pricing_analysis or use technical items with SKU)
        const pricingItems = pricingData?.pricing_summary || technicalData?.items || [];

        // Get totals (from pricing_analysis.totals or summary)
        const materialCost = pricingData?.totals?.material_total || summaryData?.total_material_cost || 0;
        const testCost = pricingData?.totals?.test_total || summaryData?.total_test_cost || 0;
        const grandTotal = pricingData?.totals?.grand_total || summaryData?.grand_total_cost || 0;

        return (
            <div className="min-h-screen bg-gray-50 p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">RFP Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage and respond to RFPs with AI-powered automation</p>
                    </div>
                    <button
                        onClick={() => setShowResults(false)}
                        type="button"
                        className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Scan RFP Sources
                    </button>
                </div>

                {/* Cost Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center mb-2">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-500">Material Cost</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹ {materialCost?.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center mb-2">
                            <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-500">Test Cost</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹ {testCost?.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center mb-2">
                            <CheckCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-500">Grand Total</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            ₹ {grandTotal?.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* RFP Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                        {data.title || 'RFP Title'}
                    </h2>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p>Issuer: {data.issuer || 'N/A'}</p>
                        <p>Due Date: {data.due_date || 'N/A'}</p>
                    </div>
                </div>

                {/* Technical & Pricing Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">Technical & Pricing Summary</h2>
                    <div className="space-y-4">
                        {pricingItems && pricingItems.length > 0 ? (
                            pricingItems.map((item: any, idx: number) => {
                                const itemNo = item.item_no || item.item_index || idx + 1;
                                const sku = item.sku || item.final_recommended_sku || 'N/A';
                                const cost = item.total_cost || 0;

                                return (
                                    <div key={idx} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 mb-1">Item {itemNo}</p>
                                                <p className="text-sm text-gray-500">SKU: {sku}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900">
                                                    ₹ {cost.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {pricingData ? 'No items found' : 'Pricing data not available. Please run the RFP pipeline again.'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Header with Logo */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    {/* Title */}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">RFP Dashboard</h1>
                        <p className="text-sm text-gray-500">Manage and respond to RFPs with AI-powered automation</p>
                    </div>
                </div>
                <button
                    onClick={handleGetRfpResponse}
                    disabled={loading}
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                >
                    <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Processing...' : 'Scan RFP Sources'}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                    {error}
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Total RFPs"
                    value={totalRFPs}
                    change={12}
                    changeLabel="from last month"
                    changeType="positive"
                    icon={<DocumentTextIcon className="h-6 w-6 text-blue-600" />}
                    iconBgColor="bg-blue-50"
                />
                <KPICard
                    title="Win Rate"
                    value={`${winRate}%`}
                    change={2}
                    changeLabel="from last month"
                    changeType="negative"
                    icon={<CheckCircleIcon className="h-6 w-6 text-blue-600" />}
                    iconBgColor="bg-blue-50"
                />
                <KPICard
                    title="Avg. Response Time"
                    value={`${avgResponseTime} days`}
                    change={5}
                    changeLabel="faster"
                    changeType="positive"
                    icon={<ClockIcon className="h-6 w-6 text-blue-600" />}
                    iconBgColor="bg-blue-50"
                />
                <KPICard
                    title="Active Agents"
                    value={activeAgents}
                    changeLabel="All systems operational"
                    icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
                    iconBgColor="bg-blue-50"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pipeline Status Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    {dashboardData?.pipelineStatus ? (
                        <PipelineStatusChart data={dashboardData.pipelineStatus} />
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                            Loading pipeline data...
                        </div>
                    )}
                </div>

                {/* Agent Contribution Chart */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    {dashboardData?.agentContribution ? (
                        <AgentContributionChart data={dashboardData.agentContribution} />
                    ) : (
                        <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                            Loading agent data...
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insights with real dashboard data */}
            <AIInsights
                pageType={rfpData ? "rfp_response" : "dashboard"}
                pageData={rfpData || {
                    pipeline_status: dashboardData?.pipelineStatus,
                    agent_contribution: dashboardData?.agentContribution,
                    total_rfps: totalRFPs,
                    win_rate: winRate,
                    avg_response_time: avgResponseTime
                }}
            />
        </div>
    );
}

// KPI Card Component - Matching the reference design exactly
function KPICard({
    title,
    value,
    change,
    changeLabel,
    changeType,
    icon,
    iconBgColor,
}: {
    title: string;
    value: string | number;
    change?: number;
    changeLabel: string;
    changeType?: 'positive' | 'negative';
    icon: React.ReactNode;
    iconBgColor?: string;
}) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-lg ${iconBgColor || 'bg-gray-50'}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
            <p className="text-xs text-gray-500">
                {change !== undefined && (
                    <span className={`font-semibold ${changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
                        {change >= 0 && changeType === 'positive' ? '+ ' : changeType === 'negative' ? '- ' : ''}{Math.abs(change)}%{' '}
                    </span>
                )}
                {changeLabel}
            </p>
        </div>
    );
}
