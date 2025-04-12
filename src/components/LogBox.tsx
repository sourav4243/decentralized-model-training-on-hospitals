interface Log {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface LogBoxProps {
  logs: Log[];
}

export default function LogBox({ logs }: LogBoxProps) {
  return (
    <div className="border rounded-lg p-4 h-[400px] overflow-y-auto">
      {logs.map((log, index) => (
        <div 
          key={index} 
          className={`p-2 mb-2 rounded ${
            log.type === 'success' ? 'bg-green-50' :
            log.type === 'error' ? 'bg-red-50' :
            'bg-blue-50'
          }`}
        >
          <div className="text-sm text-gray-500">
            {log.timestamp.toLocaleTimeString()}
          </div>
          <div className={`${
            log.type === 'success' ? 'text-green-700' :
            log.type === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {log.message}
          </div>
        </div>
      ))}
    </div>
  );
}
