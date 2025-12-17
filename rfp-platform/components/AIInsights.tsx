'use client';

import { useState } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface AIInsightsProps {
    pageType: string;
    pageData?: any;
}

export default function AIInsights({ pageType, pageData }: AIInsightsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            console.log('AI Insights - pageType:', pageType);
            console.log('AI Insights - pageData:', pageData);
            const response = await axios.post(`${API_BASE_URL}/api/ai-insights`, {
                page_type: pageType,
                page_data: pageData
            });
            console.log('AI Insights - response:', response.data);
            setInsights(response.data.insights);
        } catch (error) {
            console.error('Failed to fetch insights:', error);
            setInsights({
                summary: 'Unable to generate insights at this time.',
                recommendations: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        // Always fetch fresh insights to ensure we have latest pageData
        fetchInsights();
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-pulse"
                title="AI Insights & Recommendations"
            >
                <SparklesIcon className="h-6 w-6" />
            </button>

            {/* Insights Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Slide-out Panel */}
                    <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform">
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <div className="flex items-center gap-2">
                                    <SparklesIcon className="h-6 w-6" />
                                    <h2 className="text-lg font-bold">AI Insights</h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                        <p className="mt-4 text-gray-600">Analyzing page data...</p>
                                    </div>
                                ) : insights ? (
                                    <div className="space-y-6">
                                        {/* Summary */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                Page Summary
                                            </h3>
                                            <p className="text-gray-700">{insights.summary}</p>
                                        </div>

                                        {/* Key Metrics */}
                                        {insights.key_metrics && insights.key_metrics.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                    Key Metrics
                                                </h3>
                                                <div className="space-y-2">
                                                    {insights.key_metrics.map((metric: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                                            <span className="text-sm text-gray-700">{metric.label}</span>
                                                            <span className="text-sm font-bold text-blue-600">{metric.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recommendations */}
                                        {insights.recommendations && insights.recommendations.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                    Recommendations
                                                </h3>
                                                <ul className="space-y-2">
                                                    {insights.recommendations.map((rec: string, idx: number) => (
                                                        <li key={idx} className="flex gap-2">
                                                            <span className="text-green-600">✓</span>
                                                            <span className="text-sm text-gray-700">{rec}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Risk Analysis */}
                                        {insights.risks && insights.risks.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                    Risk Analysis
                                                </h3>
                                                <ul className="space-y-2">
                                                    {insights.risks.map((risk: any, idx: number) => (
                                                        <li key={idx} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                                                            <div className="flex items-start gap-2">
                                                                <span className="text-yellow-600 font-bold">⚠</span>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{risk.title}</p>
                                                                    <p className="text-xs text-gray-600 mt-1">{risk.description}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t bg-gray-50 text-center text-xs text-gray-500">
                                Powered by Smart Analytics
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
