interface HospitalCardProps {
  hospitalId: number;  localAccuracy: number;
  globalAccuracy: number;  status: 'trained' | 'untrained' | 'training';
}
export default function HospitalCard({ hospitalId, localAccuracy, globalAccuracy, status }: HospitalCardProps) {  return (
    <div className="border rounded-lg p-4 shadow-sm">      <h3 className="text-lg font-semibold mb-2">Hospital {hospitalId}</h3>
      <div className="space-y-2">        <div className="flex justify-between">
          <span>Local Accuracy:</span>          <span className="font-mono">{(localAccuracy * 100).toFixed(2)}%</span>
        </div>        <div className="flex justify-between">
          <span>Global Accuracy:</span>          <span className="font-mono">{(globalAccuracy * 100).toFixed(2)}%</span>
        </div>        <div className="flex justify-between">
          <span>Status:</span>          <span className={`
            ${status === 'trained' ? 'text-green-600' : ''}            ${status === 'untrained' ? 'text-red-600' : ''}
            ${status === 'training' ? 'text-yellow-600' : ''}          `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}          </span>
        </div>      </div>
    </div>
  );
}

















