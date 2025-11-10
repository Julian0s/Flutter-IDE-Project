import { useEffect } from 'react';
import { MonacoEditor } from './MonacoEditor';
import { FileExplorer } from './FileExplorer';
import { Console } from './Console';
import { PreviewPanel } from './PreviewPanel';
import { WidgetInspector } from './WidgetInspector';
import { useAuth } from '../../hooks/useAuth';
import { useFileExplorerStore } from '../../stores/fileExplorerStore';
import { useFlutterStore } from '../../stores/flutterStore';
import { FileSystemService } from '../../services/fileSystem';
import './EditorLayout.css';

export function EditorLayout() {
  const { user, signOut } = useAuth();
  const { workspaceRoot, currentFile, openFiles, updateFileContent, saveFile } = useFileExplorerStore();
  const { isRunning, startFlutter, stopFlutter, hotReload } = useFlutterStore();

  const currentContent = currentFile ? openFiles.get(currentFile) || '' : '';
  const currentFileName = currentFile ? currentFile.split(/[\\/]/).pop() || 'Sem arquivo' : 'Sem arquivo';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (currentFile) {
      updateFileContent(currentFile, newCode);
    }
  };

  const handleSave = async () => {
    if (currentFile && currentContent) {
      try {
        await saveFile(currentFile, currentContent);
        console.log('File saved successfully');
      } catch (error) {
        console.error('Failed to save file:', error);
      }
    }
  };

  // Auto-start Flutter when workspace opens (if Flutter project)
  useEffect(() => {
    const autoStartFlutter = async () => {
      if (workspaceRoot && !isRunning) {
        console.log('[Auto-Preview] Workspace detected:', workspaceRoot);
        const isFlutter = await FileSystemService.isFlutterProject(workspaceRoot);
        console.log('[Auto-Preview] Is Flutter project?', isFlutter);

        if (isFlutter) {
          console.log('[Auto-Preview] Flutter project detected, starting preview...');
          try {
            await startFlutter(workspaceRoot);
            console.log('[Auto-Preview] Preview started successfully');
          } catch (error) {
            console.error('[Auto-Preview] Failed to start preview:', error);
          }
        } else {
          console.log('[Auto-Preview] Not a Flutter project, skipping auto-start');
        }
      } else if (!workspaceRoot) {
        console.log('[Auto-Preview] No workspace root set');
      } else if (isRunning) {
        console.log('[Auto-Preview] Flutter already running');
      }
    };

    autoStartFlutter();

    // Cleanup on unmount
    return () => {
      if (isRunning) {
        console.log('[Auto-Preview] Stopping Flutter on unmount');
        stopFlutter();
      }
    };
  }, [workspaceRoot]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto hot reload on save
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        await handleSave();

        // Trigger hot reload if Flutter is running and file is Dart
        if (isRunning && currentFile?.endsWith('.dart')) {
          console.log('[Auto Hot Reload] Triggering hot reload...');
          try {
            await hotReload();
          } catch (error) {
            console.error('[Auto Hot Reload] Failed:', error);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFile, currentContent, isRunning]);

  return (
    <div className="editor-layout">
      {/* Header */}
      <header className="editor-header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">Flutter IDE</span>
          </div>
        </div>

        <div className="header-center">
          <div className="current-file">
            <span className="file-icon">📄</span>
            <span className="file-name">{currentFileName}</span>
          </div>
          {isRunning && (
            <div className="preview-status">
              <span className="status-indicator running"></span>
              <span className="status-text">Preview Running</span>
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">{user?.displayName || user?.email}</span>
            <button className="btn-signout" onClick={handleSignOut}>
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="editor-main">
        {/* Sidebar - File Explorer */}
        <aside className="editor-sidebar">
          <FileExplorer />
        </aside>

        {/* Editor Area */}
        <main className="editor-content">
          {currentFile ? (
            <MonacoEditor
              value={currentContent}
              onChange={handleCodeChange}
              language="dart"
              theme="vs-dark"
            />
          ) : (
            <div className="editor-empty">
              <span className="empty-icon">📁</span>
              <p>Abra uma pasta para começar</p>
            </div>
          )}
        </main>

        {/* Right Panel - Preview with floating Inspector */}
        <aside className="editor-rightpanel">
          <PreviewPanel />
          <WidgetInspector />
        </aside>
      </div>

      {/* Bottom Panel - Terminal/Console */}
      <footer className="editor-footer">
        <Console />
      </footer>
    </div>
  );
}
