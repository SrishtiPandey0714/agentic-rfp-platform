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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PipelineStatusChartProps {
  data: {
    labels: string[];
    counts: number[];
  };
}

export function PipelineStatusChart({ data }: PipelineStatusChartProps) {
  // Match the exact colors from the reference image
  const barColors = [
    'rgb(59, 130, 246)',    // Blue for Discovered
    'rgb(168, 85, 247)',  // Purple for Analyzed
    'rgb(251, 191, 36)',   // Yellow for Priced
    'rgb(34, 197, 94)',    // Green for Submitted
    'rgb(59, 130, 246)',    // Blue for Won
  ];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: '',
        data: data.counts,
        backgroundColor: barColors.slice(0, data.labels.length),
        borderColor: barColors.slice(0, data.labels.length),
        borderWidth: 0,
        barThickness: 20,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,  // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'RFP Pipeline Status',
        align: 'start' as const,
        font: {
          size: 16,
          weight: 600 as const,
        },
        padding: {
          bottom: 20,
        },
        color: '#111827',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.x} RFPs`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#f3f4f6',
        },
        ticks: {
          stepSize: 5,
          color: '#6b7280',
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#374151',
          font: {
            size: 13,
          },
        },
      },
    },
  };

  return (
    <div className="h-80">
      <Bar options={options} data={chartData} />
    </div>
  );
}
