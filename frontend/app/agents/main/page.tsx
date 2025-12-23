'use client';

import { useEffect, useState } from 'react';
import MainAgentDashboard from './MainAgentDashboardClient';

export default function MainAgentPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return <MainAgentDashboard />;
}
