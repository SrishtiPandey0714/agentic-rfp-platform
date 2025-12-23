'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchRfps, fetchRfpDetails, runTechnicalMatching, RFP } from '@/lib/api';

type RfpStatus = 'Not Started' | 'In Progress' | 'Completed';

interface RfpContextType {
  id: string;
  name: string;
  issuer: string;
  dueDate: string;
  status: RfpStatus;
  scope?: string;
  requirements?: string[];
  created_at?: string;
  updated_at?: string;
}

interface AppContextType {
  rfps: RFP[];
  loading: boolean;
  error: string | null;
  fetchRfps: () => Promise<void>;
  fetchRfpDetails: (id: string) => Promise<RFP>;
  runTechnicalMatching: (rfpId: string) => Promise<any>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRfpsList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRfps();
      setRfps(data || []);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred while fetching RFPs');
      console.error('Error fetching RFPs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRfpDetails = async (id: string): Promise<RFP> => {
    setLoading(true);
    setError(null);
    try {
      const rfp = await fetchRfpDetails(id);
      return rfp;
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to fetch RFP details');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const runMatching = async (rfpId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await runTechnicalMatching(rfpId);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to run technical matching');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRfpsList();
  }, []);

  return (
    <AppContext.Provider
      value={{
        rfps,
        loading,
        error,
        fetchRfps: fetchRfpsList,
        fetchRfpDetails: getRfpDetails,
        runTechnicalMatching: runMatching,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
