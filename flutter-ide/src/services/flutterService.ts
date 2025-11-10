import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export class FlutterService {
  /**
   * Start Flutter run process for the given project path
   * @param projectPath - Absolute path to Flutter project
   * @returns URL where Flutter web app is running (e.g., http://localhost:8080)
   */
  static async runFlutter(projectPath: string): Promise<string> {
    try {
      const url = await invoke<string>('run_flutter', { projectPath });
      console.log('Flutter started at:', url);
      return url;
    } catch (error) {
      console.error('Failed to run Flutter:', error);
      throw error;
    }
  }

  /**
   * Stop the currently running Flutter process
   */
  static async stopFlutter(): Promise<void> {
    try {
      await invoke('stop_flutter');
      console.log('Flutter stopped');
    } catch (error) {
      console.error('Failed to stop Flutter:', error);
      throw error;
    }
  }

  /**
   * Trigger Hot Reload (preserves state)
   */
  static async hotReload(): Promise<string> {
    try {
      const result = await invoke<string>('hot_reload');
      console.log('Hot reload:', result);
      return result;
    } catch (error) {
      console.error('Failed to hot reload:', error);
      throw error;
    }
  }

  /**
   * Trigger Hot Restart (resets state)
   */
  static async hotRestart(): Promise<string> {
    try {
      const result = await invoke<string>('hot_restart');
      console.log('Hot restart:', result);
      return result;
    } catch (error) {
      console.error('Failed to hot restart:', error);
      throw error;
    }
  }

  /**
   * Listen to Flutter stdout logs
   * @param callback - Function to call when log is received
   * @returns Unlisten function to stop listening
   */
  static onLog(callback: (log: string) => void): Promise<UnlistenFn> {
    return listen<string>('flutter-log', (event) => {
      callback(event.payload);
    });
  }

  /**
   * Listen to Flutter stderr errors
   * @param callback - Function to call when error is received
   * @returns Unlisten function to stop listening
   */
  static onError(callback: (error: string) => void): Promise<UnlistenFn> {
    return listen<string>('flutter-error', (event) => {
      callback(event.payload);
    });
  }

  /**
   * Listen to VM Service URI (for DevTools integration)
   * @param callback - Function to call when VM Service URI is detected
   * @returns Unlisten function to stop listening
   */
  static onVmServiceUri(callback: (uri: string) => void): Promise<UnlistenFn> {
    return listen<string>('vm-service-uri', (event) => {
      callback(event.payload);
    });
  }
}
