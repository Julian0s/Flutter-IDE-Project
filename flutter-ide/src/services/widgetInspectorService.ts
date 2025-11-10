/**
 * Widget Inspector Service
 * Handles communication between the IDE and Flutter app iframe for widget inspection
 */

export interface WidgetInfo {
  type: string;
  properties: Record<string, any>;
  location?: {
    file: string;
    line: number;
    column: number;
  };
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface InspectorMessage {
  type: 'widget-selected' | 'hover-widget' | 'inspector-ready' | 'enable-inspector' | 'disable-inspector';
  data?: WidgetInfo | any;
}

export class WidgetInspectorService {
  private static iframe: HTMLIFrameElement | null = null;
  private static listeners: Set<(widget: WidgetInfo) => void> = new Set();
  private static hoverListeners: Set<(widget: WidgetInfo | null) => void> = new Set();
  private static isEnabled = false;

  /**
   * Initialize the inspector with the Flutter iframe
   */
  static initialize(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.setupMessageListener();
    console.log('[WidgetInspector] Initialized');
  }

  /**
   * Setup message listener for iframe communication
   */
  private static setupMessageListener() {
    window.addEventListener('message', (event) => {
      // Security: verify origin if needed
      // if (event.origin !== 'http://localhost:8080') return;

      try {
        const message: InspectorMessage = event.data;

        switch (message.type) {
          case 'inspector-ready':
            console.log('[WidgetInspector] Flutter app ready for inspection');
            break;

          case 'widget-selected':
            if (message.data) {
              this.notifySelection(message.data as WidgetInfo);
            }
            break;

          case 'hover-widget':
            this.notifyHover(message.data as WidgetInfo | null);
            break;

          default:
            console.log('[WidgetInspector] Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('[WidgetInspector] Error processing message:', error);
      }
    });
  }

  /**
   * Enable widget selection mode
   */
  static enable() {
    if (!this.iframe) {
      console.warn('[WidgetInspector] Iframe not initialized');
      return;
    }

    this.isEnabled = true;
    this.postMessage({ type: 'enable-inspector' });
    console.log('[WidgetInspector] Selection mode enabled');
  }

  /**
   * Disable widget selection mode
   */
  static disable() {
    if (!this.iframe) {
      console.warn('[WidgetInspector] Iframe not initialized');
      return;
    }

    this.isEnabled = false;
    this.postMessage({ type: 'disable-inspector' });
    console.log('[WidgetInspector] Selection mode disabled');
  }

  /**
   * Toggle inspector mode
   */
  static toggle(): boolean {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.isEnabled;
  }

  /**
   * Send message to Flutter iframe
   */
  private static postMessage(message: InspectorMessage) {
    if (!this.iframe?.contentWindow) {
      console.warn('[WidgetInspector] Iframe contentWindow not available');
      return;
    }

    this.iframe.contentWindow.postMessage(message, '*');
  }

  /**
   * Subscribe to widget selection events
   */
  static onWidgetSelected(callback: (widget: WidgetInfo) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Subscribe to widget hover events
   */
  static onWidgetHover(callback: (widget: WidgetInfo | null) => void): () => void {
    this.hoverListeners.add(callback);
    return () => this.hoverListeners.delete(callback);
  }

  /**
   * Notify all listeners of widget selection
   */
  private static notifySelection(widget: WidgetInfo) {
    console.log('[WidgetInspector] Widget selected:', widget);
    this.listeners.forEach((callback) => callback(widget));
  }

  /**
   * Notify all listeners of widget hover
   */
  private static notifyHover(widget: WidgetInfo | null) {
    this.hoverListeners.forEach((callback) => callback(widget));
  }

  /**
   * Get current inspector state
   */
  static isInspectorEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Cleanup
   */
  static cleanup() {
    this.disable();
    this.listeners.clear();
    this.hoverListeners.clear();
    this.iframe = null;
  }
}
