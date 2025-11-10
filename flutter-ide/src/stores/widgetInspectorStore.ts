import { create } from 'zustand';
import { WidgetInfo, WidgetInspectorService } from '../services/widgetInspectorService';

interface WidgetInspectorState {
  // State
  isEnabled: boolean;
  selectedWidget: WidgetInfo | null;
  hoveredWidget: WidgetInfo | null;
  inspectionHistory: WidgetInfo[];

  // Actions
  toggleInspector: () => void;
  setSelectedWidget: (widget: WidgetInfo | null) => void;
  setHoveredWidget: (widget: WidgetInfo | null) => void;
  clearSelection: () => void;
  addToHistory: (widget: WidgetInfo) => void;
  clearHistory: () => void;
}

export const useWidgetInspectorStore = create<WidgetInspectorState>((set, get) => ({
  // Initial state
  isEnabled: false,
  selectedWidget: null,
  hoveredWidget: null,
  inspectionHistory: [],

  // Toggle inspector mode
  toggleInspector: () => {
    const newState = WidgetInspectorService.toggle();
    set({ isEnabled: newState });

    // Clear selection when disabling
    if (!newState) {
      set({ selectedWidget: null, hoveredWidget: null });
    }
  },

  // Set selected widget
  setSelectedWidget: (widget: WidgetInfo | null) => {
    set({ selectedWidget: widget });

    if (widget) {
      get().addToHistory(widget);
    }
  },

  // Set hovered widget
  setHoveredWidget: (widget: WidgetInfo | null) => {
    set({ hoveredWidget: widget });
  },

  // Clear current selection
  clearSelection: () => {
    set({ selectedWidget: null, hoveredWidget: null });
  },

  // Add widget to inspection history
  addToHistory: (widget: WidgetInfo) => {
    const { inspectionHistory } = get();

    // Avoid duplicates (check by type and properties)
    const isDuplicate = inspectionHistory.some(
      (item) => item.type === widget.type && JSON.stringify(item.properties) === JSON.stringify(widget.properties)
    );

    if (!isDuplicate) {
      const newHistory = [widget, ...inspectionHistory].slice(0, 10); // Keep last 10
      set({ inspectionHistory: newHistory });
    }
  },

  // Clear inspection history
  clearHistory: () => {
    set({ inspectionHistory: [] });
  },
}));
