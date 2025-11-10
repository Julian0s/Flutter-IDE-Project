import { create } from 'zustand';
import { FlutterService } from '../services/flutterService';
import { UnlistenFn } from '@tauri-apps/api/event';

interface FlutterState {
  // State
  isRunning: boolean;
  previewUrl: string | null;
  logs: string[];
  errors: string[];

  // Listeners
  logUnlisten: UnlistenFn | null;
  errorUnlisten: UnlistenFn | null;

  // Actions
  startFlutter: (projectPath: string) => Promise<void>;
  stopFlutter: () => Promise<void>;
  hotReload: () => Promise<void>;
  hotRestart: () => Promise<void>;
  clearLogs: () => void;
  setupListeners: () => Promise<void>;
  cleanupListeners: () => void;
}

export const useFlutterStore = create<FlutterState>((set, get) => ({
  // Initial state
  isRunning: false,
  previewUrl: null,
  logs: [],
  errors: [],
  logUnlisten: null,
  errorUnlisten: null,

  // Setup event listeners
  setupListeners: async () => {
    const { logUnlisten, errorUnlisten } = get();

    // Cleanup existing listeners
    if (logUnlisten) await logUnlisten();
    if (errorUnlisten) await errorUnlisten();

    // Setup new listeners
    const newLogUnlisten = await FlutterService.onLog((log) => {
      set((state) => ({
        logs: [...state.logs, log],
      }));
    });

    const newErrorUnlisten = await FlutterService.onError((error) => {
      set((state) => ({
        errors: [...state.errors, error],
      }));
    });

    set({ logUnlisten: newLogUnlisten, errorUnlisten: newErrorUnlisten });
  },

  // Cleanup listeners
  cleanupListeners: () => {
    const { logUnlisten, errorUnlisten } = get();
    if (logUnlisten) logUnlisten();
    if (errorUnlisten) errorUnlisten();
    set({ logUnlisten: null, errorUnlisten: null });
  },

  // Start Flutter process
  startFlutter: async (projectPath: string) => {
    try {
      set({ isRunning: true, logs: [], errors: [] });

      // Setup listeners before starting
      await get().setupListeners();

      const url = await FlutterService.runFlutter(projectPath);
      set({ previewUrl: url });
    } catch (error) {
      set({ isRunning: false, previewUrl: null });
      throw error;
    }
  },

  // Stop Flutter process
  stopFlutter: async () => {
    try {
      await FlutterService.stopFlutter();
      get().cleanupListeners();
      set({
        isRunning: false,
        previewUrl: null,
        logs: [],
        errors: []
      });
    } catch (error) {
      console.error('Error stopping Flutter:', error);
      throw error;
    }
  },

  // Hot Reload
  hotReload: async () => {
    try {
      const result = await FlutterService.hotReload();
      set((state) => ({
        logs: [...state.logs, `✅ ${result}`],
      }));
    } catch (error) {
      console.error('Error during hot reload:', error);
      throw error;
    }
  },

  // Hot Restart
  hotRestart: async () => {
    try {
      const result = await FlutterService.hotRestart();
      set((state) => ({
        logs: [...state.logs, `🔄 ${result}`],
      }));
    } catch (error) {
      console.error('Error during hot restart:', error);
      throw error;
    }
  },

  // Clear logs
  clearLogs: () => {
    set({ logs: [], errors: [] });
  },
}));
