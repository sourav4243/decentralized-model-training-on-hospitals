import { useState, useRef, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Settings, Database, Share2, ChevronDown, Loader2 } from 'lucide-react';

export default function BulkActionsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { trainAllLocalModels, shareAllWeights } = useStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTrainAll = async () => {
    setIsLoading(true);
    setLoadingAction('train');
    await trainAllLocalModels();
    setIsLoading(false);
    setLoadingAction(null);
    setIsOpen(false);
  };

  const handleShareAll = async () => {
    setIsLoading(true);
    setLoadingAction('share');
    await shareAllWeights();
    setIsLoading(false);
    setLoadingAction(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${isOpen ? 'bg-purple-700 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
      >
        <Settings className="h-4 w-4" />
        <span>Bulk Actions</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-xl z-10 border overflow-hidden transition-all duration-200">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700">Hospital Bulk Actions</h3>
            <p className="text-xs text-gray-500 mt-1">Perform actions on all hospitals at once</p>
          </div>

          <div className="py-1">
            <button
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors disabled:opacity-50 disabled:hover:bg-white"
              onClick={handleTrainAll}
              disabled={isLoading}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                {isLoading && loadingAction === 'train' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                ) : (
                  <Database className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <span className="font-medium text-gray-700 block">Train All Local Models</span>
                <span className="text-xs text-gray-500">Train models for all hospitals sequentially</span>
              </div>
            </button>

            <div className="border-t my-1"></div>

            <button
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors disabled:opacity-50 disabled:hover:bg-white"
              onClick={handleShareAll}
              disabled={isLoading}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                {isLoading && loadingAction === 'share' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                ) : (
                  <Share2 className="h-4 w-4 text-green-600" />
                )}
              </div>
              <div>
                <span className="font-medium text-gray-700 block">Share All Weights</span>
                <span className="text-xs text-gray-500">Share weights from all trained hospitals</span>
              </div>
            </button>
          </div>

          <div className="p-2 border-t bg-gray-50 text-xs text-gray-500 text-center">
            Click outside to close
          </div>
        </div>
      )}
    </div>
  );
}
