'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const RfpContext = createContext<any>(null);

export function RfpProvider({ children }: { children: React.ReactNode }) {
  const [rfpData, setRfpData] = useState<any>(null);

  // 🔥 Restore from localStorage on load
  useEffect(() => {
    const stored = localStorage.getItem('rfpData');
    if (stored) {
      setRfpData(JSON.parse(stored));
    }
  }, []);

  // 🔥 Save to localStorage when data updates
  const updateRfpData = (data: any) => {
    setRfpData(data);
    localStorage.setItem('rfpData', JSON.stringify(data));
  };

  return (
    <RfpContext.Provider value={{ rfpData, setRfpData: updateRfpData }}>
      {children}
    </RfpContext.Provider>
  );
}

export function useRfp() {
  return useContext(RfpContext);
}
