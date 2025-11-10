import { create } from 'zustand';
import { FlutterService } from '../services/flutterService';
import { UnlistenFn } from '@tauri-apps/api/event';

interface FlutterState {
  // State
  isRunning: boolean;
  previewUrl: string | null;
  vmServiceUri: string | null;
  devToolsUrl: string | null;
  logs: string[];
  errors: string[];

  // Listeners
  logUnlisten: UnlistenFn | null;
  errorUnlisten: UnlistenFn | null;
  vmServiceUnlisten: UnlistenFn | null;

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
  vmServiceUri: null,
  devToolsUrl: null,
  logs: [],
  errors: [],
  logUnlisten: null,
  errorUnlisten: null,
  vmServiceUnlisten: null,

  // Setup event listeners
  setupListeners: async () => {
    const { logUnlisten, errorUnlisten, vmServiceUnlisten } = get();

    // Cleanup existing listeners
    if (logUnlisten) await logUnlisten();
    if (errorUnlisten) await errorUnlisten();
    if (vmServiceUnlisten) await vmServiceUnlisten();

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

    const newVmServiceUnlisten = await FlutterService.onVmServiceUri((uri) => {
      console.log('[DevTools] VM Service URI received:', uri);
      const devToolsUrl = `https://devtools.flutter.dev/?uri=${encodeURIComponent(uri)}`;
      set({ vmServiceUri: uri, devToolsUrl });
    });

    set({
      logUnlisten: newLogUnlisten,
      errorUnlisten: newErrorUnlisten,
      vmServiceUnlisten: newVmServiceUnlisten
    });
  },

  // Cleanup listeners
  cleanupListeners: () => {
    const { logUnlisten, errorUnlisten, vmServiceUnlisten } = get();
    if (logUnlisten) logUnlisten();
    if (errorUnlisten) errorUnlisten();
    if (vmServiceUnlisten) vmServiceUnlisten();
    set({ logUnlisten: null, errorUnlisten: null, vmServiceUnlisten: null });
  },

  // Start Flutter process
  startFlutter: async (projectPath: string) => {
    try {
      console.log('[FlutterStore] Starting Flutter at:', projectPath);
      set({ isRunning: true, logs: [], errors: [] });

      // Setup listeners before starting
      console.log('[FlutterStore] Setting up listeners...');
      await get().setupListeners();

      console.log('[FlutterStore] Calling FlutterService.runFlutter...');
      const url = await FlutterService.runFlutter(projectPath);
      console.log('[FlutterStore] Flutter started, URL:', url);
      set({ previewUrl: url });
    } catch (error) {
      console.error('[FlutterStore] Error starting Flutter:', error);
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
        vmServiceUri: null,
        devToolsUrl: null,
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
