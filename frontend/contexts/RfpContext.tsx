'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RfpData {
    rfp_id?: string;
    title?: string;
    issuer?: string;
    due_date?: string;
    summary?: {
        total_material_cost?: number;
        total_test_cost?: number;
        grand_total_cost?: number;
    };
    pricing_analysis?: {
        pricing_summary?: Array<{
            item_no: string;
            sku: string;
            total_cost: number;
        }>;
    };
    technical_analysis?: {
        items?: Array<any>;
    };
    technical_matching?: any;
    sales_proposal?: any;
}

interface RfpContextType {
    rfpData: RfpData | null;
    setRfpData: (data: RfpData | null) => void;
}

const RfpContext = createContext<RfpContextType | undefined>(undefined);

export const RfpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [rfpData, setRfpData] = useState<RfpData | null>(null);

    return (
        <RfpContext.Provider value={{ rfpData, setRfpData }}>
            {children}
        </RfpContext.Provider>
    );
};

export const useRfp = (): RfpContextType => {
    const context = useContext(RfpContext);
    if (context === undefined) {
        throw new Error('useRfp must be used within an RfpProvider');
    }
    return context;
};
