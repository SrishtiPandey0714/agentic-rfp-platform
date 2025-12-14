// e:/EY HACKATHON2/rfp-frontend/src/components/rfp/RfpList.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchRfps } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface RFP {
  id: string;
  name: string;
  issuer: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const columns = [
  { header: 'RFP Name', accessor: 'name' },
  { header: 'Issuer', accessor: 'issuer' },
  { header: 'Due Date', accessor: 'dueDate' },
  { header: 'Status', accessor: 'status' },
  { header: 'Actions', accessor: 'actions' },
];

export default function RfpList() {
  const { data: rfps = [], isLoading, isError } = useQuery<RFP[]>({
    queryKey: ['rfps'],
    queryFn: fetchRfps,
  });

  if (isLoading) {
    return <div>Loading RFPs...</div>;
  }

  if (isError) {
    return <div>Error loading RFPs</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessor}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rfps.map((rfp) => (
          <TableRow key={rfp.id}>
            <TableCell>{rfp.name}</TableCell>
            <TableCell>{rfp.issuer}</TableCell>
            <TableCell>{new Date(rfp.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  rfp.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : rfp.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {rfp.status}
              </span>
            </TableCell>
            <TableCell>
              <Button variant="outline" size="sm" asChild>
                <a href={`/rfp/${rfp.id}`}>View</a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}