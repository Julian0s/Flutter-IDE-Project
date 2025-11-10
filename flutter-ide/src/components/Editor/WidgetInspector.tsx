import React, { useEffect } from 'react';
import { useWidgetInspectorStore } from '../../stores/widgetInspectorStore';
import { useFlutterStore } from '../../stores/flutterStore';
import { WidgetInspectorService } from '../../services/widgetInspectorService';
import { open } from '@tauri-apps/plugin-shell';
import './WidgetInspector.css';

export const WidgetInspector: React.FC = () => {
  const { isEnabled, selectedWidget, hoveredWidget, setSelectedWidget, setHoveredWidget } =
    useWidgetInspectorStore();
  const { devToolsUrl } = useFlutterStore();

  const handleOpenDevTools = async () => {
    if (devToolsUrl) {
      await open(devToolsUrl);
    }
  };

  // Setup listeners for widget selection
  useEffect(() => {
    const unsubscribeSelected = WidgetInspectorService.onWidgetSelected((widget) => {
      setSelectedWidget(widget);
    });

    const unsubscribeHover = WidgetInspectorService.onWidgetHover((widget) => {
      setHoveredWidget(widget);
    });

    return () => {
      unsubscribeSelected();
      unsubscribeHover();
    };
  }, [setSelectedWidget, setHoveredWidget]);

  const currentWidget = selectedWidget || hoveredWidget;

  // Show DevTools button if inspector is enabled but no widget selected
  if (isEnabled && !currentWidget && devToolsUrl) {
    return (
      <div className="widget-inspector devtools-prompt">
        <div className="inspector-header">
          <h3>Widget Inspector</h3>
          <div className="inspector-status active">
            <span className="status-dot"></span>
            Ready
          </div>
        </div>
        <div className="devtools-content">
          <div className="devtools-icon">🛠️</div>
          <h4>Use Flutter DevTools</h4>
          <p>Click elements in the preview or open professional DevTools for advanced inspection</p>
          <button className="btn-devtools" onClick={handleOpenDevTools}>
            Open Flutter DevTools
          </button>
          <div className="devtools-hint">
            DevTools provides widget tree, inspector, performance profiler, and more
          </div>
        </div>
      </div>
    );
  }

  // Only show full inspector if there's a widget selected
  if (!currentWidget) {
    return null;
  }

  return (
    <div className="widget-inspector">
      <div className="inspector-header">
        <h3>Widget Inspector</h3>
        <div className="inspector-status active">
          <span className="status-dot"></span>
          {selectedWidget ? 'Selected' : 'Hovering'}
        </div>
      </div>

      <div className="inspector-content">
        {/* Widget Type */}
        <div className="widget-section">
          <div className="section-header">
            <h4>Widget Type</h4>
          </div>
          <div className="widget-type-display">
            <span className="type-icon">📦</span>
            <span className="type-name">{currentWidget.type}</span>
          </div>
        </div>

        {/* Widget Properties */}
        <div className="widget-section">
          <div className="section-header">
            <h4>Properties</h4>
            <span className="property-count">{Object.keys(currentWidget.properties).length}</span>
          </div>
          <div className="properties-list">
            {Object.entries(currentWidget.properties).map(([key, value]) => (
              <div key={key} className="property-item">
                <span className="property-key">{key}</span>
                <span className="property-value">{formatValue(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget Bounds */}
        {currentWidget.bounds && (
          <div className="widget-section">
            <div className="section-header">
              <h4>Bounds</h4>
            </div>
            <div className="bounds-grid">
              <div className="bound-item">
                <span className="bound-label">X</span>
                <span className="bound-value">{currentWidget.bounds.x.toFixed(1)}px</span>
              </div>
              <div className="bound-item">
                <span className="bound-label">Y</span>
                <span className="bound-value">{currentWidget.bounds.y.toFixed(1)}px</span>
              </div>
              <div className="bound-item">
                <span className="bound-label">Width</span>
                <span className="bound-value">{currentWidget.bounds.width.toFixed(1)}px</span>
              </div>
              <div className="bound-item">
                <span className="bound-label">Height</span>
                <span className="bound-value">{currentWidget.bounds.height.toFixed(1)}px</span>
              </div>
            </div>
          </div>
        )}

        {/* Source Location */}
        {currentWidget.location && (
          <div className="widget-section">
            <div className="section-header">
              <h4>Source Location</h4>
            </div>
            <div className="source-location">
              <div className="location-item">
                <span className="location-label">File:</span>
                <span className="location-value">{currentWidget.location.file}</span>
              </div>
              <div className="location-item">
                <span className="location-label">Line:</span>
                <span className="location-value">{currentWidget.location.line}</span>
              </div>
              <div className="location-item">
                <span className="location-label">Column:</span>
                <span className="location-value">{currentWidget.location.column}</span>
              </div>
            </div>
          </div>
        )}

        {/* AI Context Helper */}
        <div className="widget-section ai-context">
          <div className="section-header">
            <h4>🤖 AI Context</h4>
          </div>
          <div className="ai-hint">
            <p>
              You can use this widget info with Claude AI to make changes like:
            </p>
            <ul>
              <li>"Change the color to blue"</li>
              <li>"Increase font size to 20"</li>
              <li>"Add padding of 16px"</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format property values
function formatValue(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
