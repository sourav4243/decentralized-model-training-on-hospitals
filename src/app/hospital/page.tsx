'use client';
import useStore from '@/store/useStore';
import LogBox from '@/components/LogBox';
import BulkActionsDropdown from '@/components/BulkActionsDropdown';

export default function HospitalPage() {
  const {
    hospitals,
    selectedHospital,
    setSelectedHospital,
    trainLocalModel,
    shareWeights,
    trainWithCentralModel,
    resetData,
    logs,
    isCentralModelReady
  } = useStore();

  const currentHospital = hospitals.find(h => h.id === selectedHospital);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hospital Management Console</h1>
        <BulkActionsDropdown />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Hospital</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(Number(e.target.value))}
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>Hospital {h.id}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <button
              className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => trainLocalModel(selectedHospital)}
              disabled={currentHospital?.status === 'training'}
            >
              Train Local Model
            </button>

            <button
              className="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              onClick={() => shareWeights(selectedHospital)}
              disabled={!currentHospital?.localAccuracy || currentHospital?.hasSharedWeights}
            >
              Share Weights
            </button>

            <button
              className="w-full p-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              onClick={() => trainWithCentralModel(selectedHospital)}
              disabled={!isCentralModelReady}
            >
              Retrain with Central Model
            </button>

            <button
              className="w-full p-3 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => resetData()}
            >
              Reset Hospital Data
            </button>
          </div>

          <div className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold">{currentHospital?.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Local Accuracy:</span>
              <span className="font-mono">
                {currentHospital?.localAccuracy ?
                  `${(currentHospital.localAccuracy * 100).toFixed(2)}%` :
                  'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Global Accuracy:</span>
              <span className="font-mono">
                {currentHospital?.globalAccuracy ?
                  `${(currentHospital.globalAccuracy * 100).toFixed(2)}%` :
                  'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Training Logs</h2>
          <LogBox logs={logs} />
        </div>
      </div>
    </div>
  );
}

