// e:/EY HACKATHON2/rfp-frontend/src/components/rfp/RfpDetail.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRfpDetails, runTechnicalMatching } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RfpDetailProps {
  rfpId: string;
  initialData: any; // Replace with proper type
}

export default function RfpDetail({ rfpId, initialData }: RfpDetailProps) {
  const { data: rfp, isLoading } = useQuery({
    queryKey: ['rfp', rfpId],
    queryFn: () => fetchRfpDetails(rfpId),
    initialData,
  });

  const handleTechnicalMatching = async () => {
    try {
      await runTechnicalMatching(rfpId);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  if (isLoading) {
    return <div>Loading RFP details...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{rfp.name}</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={handleTechnicalMatching}>Run Technical Matching</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Issuer</h3>
              <p>{rfp.issuer}</p>
            </div>
            <div>
              <h3 className="font-medium">Due Date</h3>
              <p>{new Date(rfp.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2">
              <h3 className="font-medium">Scope</h3>
              <p>{rfp.scope || 'No scope provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add more sections for requirements, technical matching, pricing, etc. */}
    </div>
  );
}