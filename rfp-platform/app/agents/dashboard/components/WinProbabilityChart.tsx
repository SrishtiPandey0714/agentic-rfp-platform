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

interface WinProbabilityChartProps {
  data: {
    rfps: string[];
    win_probability: number[];
  };
}

export function WinProbabilityChart({ data }: WinProbabilityChartProps) {
  // Sort data by win probability (highest first)
  const sortedIndices = data.win_probability
    .map((_, index) => index)
    .sort((a, b) => data.win_probability[b] - data.win_probability[a]);

  const sortedRfps = sortedIndices.map(i => data.rfps[i]);
  const sortedProbabilities = sortedIndices.map(i => data.win_probability[i]);
  const backgroundColors = sortedProbabilities.map(prob => 
    prob >= 70 ? 'rgba(16, 185, 129, 0.7)' : 
    prob >= 40 ? 'rgba(245, 158, 11, 0.7)' : 
    'rgba(239, 68, 68, 0.7)'
  );
  const borderColors = sortedProbabilities.map(prob => 
    prob >= 70 ? 'rgba(16, 185, 129, 1)' : 
    prob >= 40 ? 'rgba(245, 158, 11, 1)' : 
    'rgba(239, 68, 68, 1)'
  );

  const chartData = {
    labels: sortedRfps,
    datasets: [
      {
        label: 'Win Probability (%)',
        data: sortedProbabilities,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Win Probability by RFP',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Win Probability: ${context.parsed.x}%`;
          },
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Win Probability (%)',
        },
      },
    },
  };

  return (
    <div className="h-96">
      <Bar options={options} data={chartData} />
    </div>
  );
}
