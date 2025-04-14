import { useState } from 'react';
import useStore from '@/store/useStore';
import { X, Server, Database, Share2 } from 'lucide-react';

interface BulkActionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkActionsDialog({ isOpen, onClose }: BulkActionsDialogProps) {
  const { trainAllLocalModels, shareAllWeights } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTrainAll = async () => {
    setIsLoading(true);
    await trainAllLocalModels();
    setIsLoading(false);
    onClose();
  };

  const handleShareAll = async () => {
    setIsLoading(true);
    await shareAllWeights();
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bulk Actions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-t border-b py-4 my-4">
          <p className="text-gray-600 mb-6">
            Perform actions on all hospitals at once. This can save time when working with multiple hospitals.
          </p>

          <div className="space-y-4">
            <button
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
              onClick={handleTrainAll}
              disabled={isLoading}
            >
              <Database className="h-5 w-5" />
              <span>{isLoading ? 'Processing...' : 'Train Local Model for All Hospitals'}</span>
            </button>

            <button
              className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2 transition-colors"
              onClick={handleShareAll}
              disabled={isLoading}
            >
              <Share2 className="h-5 w-5" />
              <span>{isLoading ? 'Processing...' : 'Share Weights for All Trained Hospitals'}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
