'use client';
import useStore from '@/store/useStore';
export default function ServerPage() {  const { logs, hospitals, isCentralModelReady } = useStore();
  const sharedWeightsCount = hospitals.filter(h => h.hasSharedWeights).length;
  const progress = (sharedWeightsCount / hospitals.length) * 100;
  return (    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Central Server Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">        <div className="space-y-6">
          <div className="border rounded-lg p-6">            <h2 className="text-xl font-semibold mb-4">Model Status</h2>
            <div className="space-y-4">              <div>
                <div className="flex justify-between mb-2">                  <span>Weight Collection Progress:</span>
                  <span>{sharedWeightsCount} / {hospitals.length}</span>                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"                     style={{ width: `${progress}%` }}
                  ></div>                </div>
              </div>
              <div className="flex justify-between">                <span>Central Model Status:</span>
                <span className={`font-semibold ${isCentralModelReady ? 'text-green-600' : 'text-yellow-600'}`}>                  {isCentralModelReady ? 'Ready' : 'Awaiting Weights'}
                </span>              </div>
            </div>          </div>
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Hospital Participation</h2>            <div className="space-y-2">
              {hospitals.map(hospital => (                <div key={hospital.id} className="flex justify-between items-center">
                  <span>Hospital {hospital.id}</span>                  <span className={`px-2 py-1 rounded text-sm ${
                    hospital.hasSharedWeights                       ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'                  }`}>
                    {hospital.hasSharedWeights ? 'Weights Received' : 'Pending'}                  </span>
                </div>              ))}
            </div>          </div>
        </div>
        <div>          <h2 className="text-xl font-semibold mb-4">Server Logs</h2>
          <div className="border rounded-lg p-4 h-[600px] overflow-y-auto">            {logs.map((log, index) => (
              <div                 key={index} 
                className={`p-2 mb-2 rounded ${                  log.type === 'success' ? 'bg-green-50' :
                  log.type === 'error' ? 'bg-red-50' :                  'bg-blue-50'
                }`}              >
                <div className="text-sm text-gray-500">                  {log.timestamp.toLocaleTimeString()}
                </div>                <div className={`${
                  log.type === 'success' ? 'text-green-700' :                  log.type === 'error' ? 'text-red-700' :
                  'text-blue-700'                }`}>
                  {log.message}                </div>
              </div>            ))}
          </div>        </div>
      </div>    </div>
  );
}













































