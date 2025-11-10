import { create } from 'zustand';
import { FileNode, FileSystemService } from '../services/fileSystem';

interface FileExplorerState {
  workspaceRoot: string | null;
  currentFile: string | null;
  fileTree: FileNode[];
  expandedFolders: Set<string>;
  openFiles: Map<string, string>; // path -> content
  unsavedChanges: Set<string>;

  // Actions
  setWorkspaceRoot: (path: string | null) => void;
  loadFileTree: (path: string) => Promise<void>;
  toggleFolder: (path: string) => Promise<void>;
  openFile: (path: string) => Promise<void>;
  closeFile: (path: string) => void;
  saveFile: (path: string, content: string) => Promise<void>;
  updateFileContent: (path: string, content: string) => void;
  setCurrentFile: (path: string | null) => void;
  selectFolder: () => Promise<void>;
}

// Load persisted workspace from localStorage
const loadPersistedWorkspace = (): string | null => {
  try {
    return localStorage.getItem('flutter-ide-workspace');
  } catch (error) {
    console.error('Failed to load persisted workspace:', error);
    return null;
  }
};

// Save workspace to localStorage
const saveWorkspace = (path: string | null) => {
  try {
    if (path) {
      localStorage.setItem('flutter-ide-workspace', path);
    } else {
      localStorage.removeItem('flutter-ide-workspace');
    }
  } catch (error) {
    console.error('Failed to save workspace:', error);
  }
};

export const useFileExplorerStore = create<FileExplorerState>((set, get) => ({
  workspaceRoot: loadPersistedWorkspace(),
  currentFile: null,
  fileTree: [],
  expandedFolders: new Set(),
  openFiles: new Map(),
  unsavedChanges: new Set(),

  setWorkspaceRoot: (path) => {
    set({ workspaceRoot: path });
    saveWorkspace(path);
  },

  loadFileTree: async (path: string) => {
    try {
      console.log('loadFileTree: Reading directory:', path);
      const files = await FileSystemService.readDirectory(path);
      console.log('loadFileTree: Got files:', files);
      set({ fileTree: files, workspaceRoot: path });
      saveWorkspace(path);
      console.log('loadFileTree: State updated and workspace saved');
    } catch (error) {
      console.error('Failed to load file tree:', error);
      throw error;
    }
  },

  toggleFolder: async (path: string) => {
    const { expandedFolders } = get();
    const newExpanded = new Set(expandedFolders);

    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }

    set({ expandedFolders: newExpanded });
  },

  openFile: async (path: string) => {
    const { openFiles } = get();

    // If file is already open, just switch to it
    if (openFiles.has(path)) {
      set({ currentFile: path });
      return;
    }

    // Load file content
    try {
      const content = await FileSystemService.readFile(path);
      const newOpenFiles = new Map(openFiles);
      newOpenFiles.set(path, content);

      set({
        openFiles: newOpenFiles,
        currentFile: path,
      });
    } catch (error) {
      console.error('Failed to open file:', error);
      throw error;
    }
  },

  closeFile: (path: string) => {
    const { openFiles, currentFile, unsavedChanges } = get();
    const newOpenFiles = new Map(openFiles);
    const newUnsavedChanges = new Set(unsavedChanges);

    newOpenFiles.delete(path);
    newUnsavedChanges.delete(path);

    const newCurrentFile =
      currentFile === path
        ? newOpenFiles.size > 0
          ? Array.from(newOpenFiles.keys())[0]
          : null
        : currentFile;

    set({
      openFiles: newOpenFiles,
      currentFile: newCurrentFile,
      unsavedChanges: newUnsavedChanges,
    });
  },

  saveFile: async (path: string, content: string) => {
    try {
      await FileSystemService.writeFile(path, content);

      const { openFiles, unsavedChanges } = get();
      const newOpenFiles = new Map(openFiles);
      const newUnsavedChanges = new Set(unsavedChanges);

      newOpenFiles.set(path, content);
      newUnsavedChanges.delete(path);

      set({
        openFiles: newOpenFiles,
        unsavedChanges: newUnsavedChanges,
      });
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  },

  updateFileContent: (path: string, content: string) => {
    const { openFiles, unsavedChanges } = get();
    const originalContent = openFiles.get(path);

    if (originalContent !== content) {
      const newUnsavedChanges = new Set(unsavedChanges);
      newUnsavedChanges.add(path);
      set({ unsavedChanges: newUnsavedChanges });
    }
  },

  setCurrentFile: (path: string | null) => {
    set({ currentFile: path });
  },

  selectFolder: async () => {
    try {
      console.log('selectFolder: Opening folder dialog...');
      const path = await FileSystemService.openFolder();
      console.log('selectFolder: Selected path:', path);

      if (path) {
        console.log('selectFolder: Checking if Flutter project...');
        // Check if it's a Flutter project
        const isFlutter = await FileSystemService.isFlutterProject(path);
        console.log('selectFolder: Is Flutter project?', isFlutter);

        if (!isFlutter) {
          const confirmOpen = window.confirm(
            'Esta pasta não parece ser um projeto Flutter. Deseja abrir mesmo assim?'
          );

          if (!confirmOpen) {
            console.log('selectFolder: User cancelled');
            return;
          }
        }

        console.log('selectFolder: Loading file tree...');
        await get().loadFileTree(path);
        console.log('selectFolder: File tree loaded successfully');
      } else {
        console.log('selectFolder: No path selected (user cancelled)');
      }
    } catch (error) {
      console.error('Failed to select folder:', error);
      throw error;
    }
  },
}));
