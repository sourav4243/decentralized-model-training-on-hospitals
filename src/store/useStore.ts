import { create } from 'zustand';

// API base URL
const API_BASE_URL = 'http://localhost:5000';

interface HospitalData {
  id: number;
  localAccuracy: number;
  globalAccuracy: number;
  status: 'trained' | 'untrained' | 'training';
  hasSharedWeights: boolean;
}

interface Log {
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface Store {
  hospitals: HospitalData[];
  logs: Log[];
  selectedHospital: number;
  isCentralModelReady: boolean;

  // Actions
  setSelectedHospital: (id: number) => void;
  trainLocalModel: (hospitalId: number) => Promise<void>;
  shareWeights: (hospitalId: number) => Promise<void>;
  trainWithCentralModel: (hospitalId: number) => Promise<void>;
  trainAllHospitals: () => Promise<void>;
  resetData: () => Promise<void>;
  addLog: (message: string, type: Log['type']) => void;
}

const useStore = create<Store>((set, get) => ({
  hospitals: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    localAccuracy: 0,
    globalAccuracy: 0,
    status: 'untrained',
    hasSharedWeights: false,
  })),
  logs: [],
  selectedHospital: 1,
  isCentralModelReady: false,

  setSelectedHospital: (id) => set({ selectedHospital: id }),

  addLog: (message, type) => set((state) => ({
    logs: [...state.logs, { timestamp: new Date(), message, type }]
  })),

  trainLocalModel: async (hospitalId) => {
    const { addLog } = get();

    // Update UI to show training status
    set((state) => ({
      hospitals: state.hospitals.map(h =>
        h.id === hospitalId
          ? { ...h, status: 'training' }
          : h
      )
    }));

    try {
      // Call the backend API to train the model
      addLog(`Training model for Hospital ${hospitalId}...`, 'info');

      const response = await fetch(`${API_BASE_URL}/train/${hospitalId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Update the hospital with the real accuracy from the backend
        set((state) => ({
          hospitals: state.hospitals.map(h =>
            h.id === hospitalId
              ? {
                  ...h,
                  status: 'trained',
                  localAccuracy: data.local_accuracy
                }
              : h
          )
        }));

        addLog(`Hospital ${hospitalId} completed local training with accuracy: ${(data.local_accuracy * 100).toFixed(2)}%`, 'success');
      } else {
        throw new Error(data.error || 'Failed to train model');
      }
    } catch (error) {
      // Handle errors
      addLog(`Error training model for Hospital ${hospitalId}: ${error instanceof Error ? error.message : String(error)}`, 'error');

      // Reset status
      set((state) => ({
        hospitals: state.hospitals.map(h =>
          h.id === hospitalId
            ? { ...h, status: 'untrained' }
            : h
        )
      }));
    }
  },

  shareWeights: async (hospitalId) => {
    const { addLog } = get();

    try {
      addLog(`Hospital ${hospitalId} sharing weights with central server...`, 'info');

      // Mark this hospital as having shared weights
      set((state) => ({
        hospitals: state.hospitals.map(h =>
          h.id === hospitalId
            ? { ...h, hasSharedWeights: true }
            : h
        )
      }));

      // Check if all hospitals have shared weights
      const { hospitals } = get();
      if (hospitals.every(h => h.hasSharedWeights)) {
        // If all hospitals have shared weights, aggregate the models
        addLog('All hospitals have shared weights. Aggregating models...', 'info');

        const response = await fetch(`${API_BASE_URL}/aggregate`, {
          method: 'POST',
        });

        const data = await response.json();

        if (data.success) {
          set({ isCentralModelReady: true });
          addLog(`Central model aggregation complete with accuracy: ${(data.global_accuracy * 100).toFixed(2)}%`, 'success');
        } else {
          throw new Error(data.error || 'Failed to aggregate models');
        }
      } else {
        addLog(`Hospital ${hospitalId} shared weights with central server`, 'success');
      }
    } catch (error) {
      // Handle errors
      addLog(`Error sharing weights: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  },

  trainWithCentralModel: async (hospitalId) => {
    const { addLog } = get();

    // Update UI to show training status
    set((state) => ({
      hospitals: state.hospitals.map(h =>
        h.id === hospitalId
          ? { ...h, status: 'training' }
          : h
      )
    }));

    try {
      // Call the backend API to train with the global model
      addLog(`Training Hospital ${hospitalId} with global model...`, 'info');

      const response = await fetch(`${API_BASE_URL}/train-with-global/${hospitalId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Update the hospital with the real accuracy from the backend
        set((state) => ({
          hospitals: state.hospitals.map(h =>
            h.id === hospitalId
              ? {
                  ...h,
                  status: 'trained',
                  globalAccuracy: data.global_accuracy
                }
              : h
          )
        }));

        addLog(`Hospital ${hospitalId} updated with central model. New accuracy: ${(data.global_accuracy * 100).toFixed(2)}%`, 'success');
      } else {
        throw new Error(data.error || 'Failed to train with global model');
      }
    } catch (error) {
      // Handle errors
      addLog(`Error training with global model: ${error instanceof Error ? error.message : String(error)}`, 'error');

      // Reset status
      set((state) => ({
        hospitals: state.hospitals.map(h =>
          h.id === hospitalId
            ? { ...h, status: h.localAccuracy > 0 ? 'trained' : 'untrained' }
            : h
        )
      }));
    }
  },

  trainAllHospitals: async () => {
    const { addLog } = get();
    addLog('Starting global training for all hospitals...', 'info');

    try {
      // Call the backend API to train all hospitals with the global model
      const response = await fetch(`${API_BASE_URL}/train-all-with-global`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Update all hospitals with the real accuracies from the backend
        set((state) => ({
          hospitals: state.hospitals.map(h => ({
            ...h,
            status: 'trained',
            globalAccuracy: data.results[h.id]
          }))
        }));

        addLog('Global training completed for all hospitals', 'success');
      } else {
        throw new Error(data.error || 'Failed to train all hospitals with global model');
      }
    } catch (error) {
      // Handle errors
      addLog(`Error training all hospitals: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  },

  resetData: async () => {
    const { addLog } = get();
    addLog('Resetting hospital data...', 'info');

    try {
      // Call the backend API to reset the data
      const response = await fetch(`${API_BASE_URL}/reset-data`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Reset all hospital data in the frontend
        set({
          hospitals: Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            localAccuracy: 0,
            globalAccuracy: 0,
            status: 'untrained',
            hasSharedWeights: false,
          })),
          isCentralModelReady: false
        });

        addLog('Hospital data has been randomly redistributed', 'success');
      } else {
        throw new Error(data.error || 'Failed to reset hospital data');
      }
    } catch (error) {
      // Handle errors
      addLog(`Error resetting data: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  },
}));

export default useStore;