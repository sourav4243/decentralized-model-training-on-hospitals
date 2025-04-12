'use client';
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface AccuracyChartProps {
  beforeTraining: number[];
  afterTraining: number[];
}

export default function AccuracyChart({ beforeTraining, afterTraining }: AccuracyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Array.from({ length: 10 }, (_, i) => `Hospital ${i + 1}`),
        datasets: [
          {
            label: 'Before Training',
            data: beforeTraining,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'After Training',
            data: afterTraining,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            ticks: {
              format: {
                style: 'percent',
              },
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [beforeTraining, afterTraining]);

  return <canvas ref={chartRef} />;
}