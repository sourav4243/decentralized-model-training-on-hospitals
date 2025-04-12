'use client';
import { useEffect, useRef } from 'react';
import useStore from '@/store/useStore';
import { Chart } from 'chart.js/auto';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function AllHospitalsPage() {
  const { hospitals, trainAllHospitals, resetData } = useStore();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: hospitals.map(h => `Hospital ${h.id}`),
        datasets: [
          {
            label: 'Local Model Accuracy',
            data: hospitals.map(h => h.localAccuracy * 100),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Global Model Accuracy',
            data: hospitals.map(h => h.globalAccuracy * 100),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + '%';
                }
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Accuracy (%)'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [hospitals]);
  // Calculate summary statistics
  // const trainedHospitals = hospitals.filter(h => h.status === 'trained').length;
  // const avgLocalAccuracy = hospitals.reduce((sum, h) => sum + (h.localAccuracy || 0), 0) / (trainedHospitals || 1);
  // const avgGlobalAccuracy = hospitals.reduce((sum, h) => sum + (h.globalAccuracy || 0), 0) / (trainedHospitals || 1);
  // const improvementPercentage = avgGlobalAccuracy > avgLocalAccuracy ?
  //   ((avgGlobalAccuracy - avgLocalAccuracy) / avgLocalAccuracy * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Hospitals Overview</h1>
        <div className="flex space-x-4">
          <button
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={() => resetData()}
          >
            Reset Hospital Data
          </button>
          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            onClick={() => trainAllHospitals()}
          >
            Train All with Central Model
          </button>
        </div>
      </div>

      {/* Summary Statistics
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Trained Hospitals</h3>
          <p className="text-2xl font-bold">{trainedHospitals} <span className="text-sm text-gray-500">/ {hospitals.length}</span></p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Local Accuracy</h3>
          <p className="text-2xl font-bold text-blue-600">{(avgLocalAccuracy * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Avg. Global Accuracy</h3>
          <p className="text-2xl font-bold text-green-600">{(avgGlobalAccuracy * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Overall Improvement</h3>
          <div className="flex items-center">
            <p className="text-2xl font-bold text-green-600">{improvementPercentage.toFixed(2)}%</p>
            {improvementPercentage > 0 && <ArrowUp className="h-5 w-5 text-green-600 ml-2" />}
          </div>
        </div>
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
            <div className={`h-1 -mt-6 mb-6 rounded-t-lg ${hospital.status === 'trained' ? 'bg-blue-500' : hospital.status === 'training' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
            <h3 className="text-xl font-semibold mb-4">Hospital {hospital.id}</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium px-2 py-1 rounded-full text-xs ${hospital.status === 'trained' ? 'bg-blue-100 text-blue-800' : hospital.status === 'training' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {hospital.status.charAt(0).toUpperCase() + hospital.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Local Accuracy:</span>
                <span className="font-mono">
                  {hospital.localAccuracy ? `${(hospital.localAccuracy * 100).toFixed(2)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Global Accuracy:</span>
                <div className="flex items-center">
                  <span className="font-mono mr-2">
                    {hospital.globalAccuracy ? `${(hospital.globalAccuracy * 100).toFixed(2)}%` : 'N/A'}
                  </span>
                  {hospital.localAccuracy > 0 && hospital.globalAccuracy > 0 && (
                    hospital.globalAccuracy > hospital.localAccuracy ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUp className="h-4 w-4" />
                        <span className="text-xs ml-1">
                          {((hospital.globalAccuracy - hospital.localAccuracy) / hospital.localAccuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    ) : hospital.globalAccuracy < hospital.localAccuracy ? (
                      <div className="flex items-center text-red-600">
                        <ArrowDown className="h-4 w-4" />
                        <span className="text-xs ml-1">
                          {((hospital.localAccuracy - hospital.globalAccuracy) / hospital.localAccuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 ml-1">No change</span>
                    )
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <span>Weights Shared:</span>
                <span className={hospital.hasSharedWeights ? 'text-green-600' : 'text-gray-600'}>
                  {hospital.hasSharedWeights ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Performance Comparison</h2>
        <p className="text-gray-500 mb-6">Comparison of local model accuracy vs. global model accuracy across all hospitals</p>
        <div className="h-[400px]">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
}

























































