'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface AgentContributionChartProps {
  data: {
    agents: string[];
    tasks: number[];
  };
}

export function AgentContributionChart({ data }: AgentContributionChartProps) {
  // Match the exact colors from the reference image
  const chartData = {
    labels: data.agents,
    datasets: [
      {
        data: data.tasks,
        backgroundColor: [
          'rgb(59, 130, 246)',    // Blue for Sales Agent
          'rgb(168, 85, 247)',  // Purple for Technical Agent
          'rgb(34, 197, 94)',    // Green for Pricing Agent
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
        cutout: '70%', // Makes it a donut chart
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            size: 12,
          },
          color: '#374151',
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i] as number;
                const total = (dataset.data as number[]).reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);

                return {
                  text: `${label} ${percentage}%`,
                  fillStyle: dataset.backgroundColor[i] as string,
                  hidden: false,
                  index: i,
                  strokeStyle: dataset.backgroundColor[i] as string,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: 'Agent Contribution',
        align: 'start' as const,
        font: {
          size: 16,
          weight: '600' as const,
        },
        padding: {
          bottom: 10,
        },
        color: '#111827',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.parsed;
            const total = (context.dataset.data as number[]).reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${percentage}%`;
          }
        }
      }
    },
  };

  return (
    <div className="h-80 flex flex-col items-center justify-center">
      <Doughnut options={options} data={chartData} />
    </div>
  );
}
