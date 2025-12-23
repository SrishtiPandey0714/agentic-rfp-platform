'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to main agent dashboard
        router.push('/agents/main');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">RFP Platform</h1>
                <p className="text-gray-600">Redirecting to dashboard...</p>
            </div>
        </div>
    );
}
