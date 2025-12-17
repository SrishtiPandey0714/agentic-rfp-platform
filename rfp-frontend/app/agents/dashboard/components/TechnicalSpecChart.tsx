'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TechnicalSpecChartProps {
  data: {
    items: string[];
    match_scores: number[];
  };
}

export function TechnicalSpecChart({ data }: TechnicalSpecChartProps) {
  const chartData = {
    labels: data.items,
    datasets: [
      {
        label: 'Match Score (%)',
        data: data.match_scores,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Technical Specification Match Accuracy',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Match Score (%)',
        },
      },
    },
  };

  return <Line options={options} data={chartData} />;
}
