'use client';

import { useRfp } from '@/contexts/RfpContext';
import { usePathname } from 'next/navigation';
import AIInsights from './AIInsights';

export default function GlobalAIInsights() {
    const { rfpData } = useRfp();
    const pathname = usePathname();

    // Determine page type and data based on current route
    let pageType = 'global';
    let pageData = null;

    console.log('GlobalAIInsights - pathname:', pathname);
    console.log('GlobalAIInsights - rfpData:', rfpData);

    if (pathname?.includes('/agents/technical')) {
        pageType = 'technical_agent';
        pageData = rfpData?.technical_analysis;
    } else if (pathname?.includes('/agents/sales')) {
        pageType = 'sales_agent';
        pageData = rfpData;
    } else if (pathname?.includes('/agents/pricing')) {
        pageType = 'pricing_agent';
        pageData = rfpData?.pricing_analysis;
    } else if (pathname?.includes('/agents/main')) {
        pageType = 'main_agent';
        pageData = rfpData;
    } else if (pathname?.includes('/dashboard')) {
        pageType = 'dashboard';
        pageData = rfpData;
    }

    console.log('GlobalAIInsights - pageType:', pageType);
    console.log('GlobalAIInsights - pageData:', pageData);

    return <AIInsights pageType={pageType} pageData={pageData} />;
}
