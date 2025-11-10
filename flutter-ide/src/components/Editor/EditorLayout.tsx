import { useEffect, useState } from 'react';
import { MonacoEditor } from './MonacoEditor';
import { FileExplorer } from './FileExplorer';
import { FlutterControls } from './FlutterControls';
import { Console } from './Console';
import { PreviewPanel } from './PreviewPanel';
import { WidgetInspector } from './WidgetInspector';
import { useAuth } from '../../hooks/useAuth';
import { useFileExplorerStore } from '../../stores/fileExplorerStore';
import './EditorLayout.css';

export function EditorLayout() {
  const { user, signOut } = useAuth();
  const { currentFile, openFiles, updateFileContent, saveFile } = useFileExplorerStore();
  const [rightPanelTab, setRightPanelTab] = useState<'preview' | 'inspector'>('preview');

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

  // Save on Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFile, currentContent]);

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
          <FlutterControls />
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

        {/* Right Panel - Preview & Inspector */}
        <aside className="editor-rightpanel">
          <div className="rightpanel-tabs">
            <button
              className={`tab-btn ${rightPanelTab === 'preview' ? 'active' : ''}`}
              onClick={() => setRightPanelTab('preview')}
            >
              📱 Preview
            </button>
            <button
              className={`tab-btn ${rightPanelTab === 'inspector' ? 'active' : ''}`}
              onClick={() => setRightPanelTab('inspector')}
            >
              🔍 Inspector
            </button>
          </div>
          <div className="rightpanel-content">
            {rightPanelTab === 'preview' ? <PreviewPanel /> : <WidgetInspector />}
          </div>
        </aside>
      </div>

      {/* Bottom Panel - Terminal/Console */}
      <footer className="editor-footer">
        <Console />
      </footer>
    </div>
  );
}
