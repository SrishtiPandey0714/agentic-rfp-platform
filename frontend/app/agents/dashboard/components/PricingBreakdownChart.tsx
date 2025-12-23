'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PricingBreakdownChartProps {
  data: {
    rfps: string[];
    material_cost: number[];
    testing_cost: number[];
  };
}

export function PricingBreakdownChart({ data }: PricingBreakdownChartProps) {
  const chartData = {
    labels: data.rfps,
    datasets: [
      {
        label: 'Material Cost ($)',
        data: data.material_cost,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Testing Cost ($)',
        data: data.testing_cost,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Pricing Breakdown per RFP',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost ($)',
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}
