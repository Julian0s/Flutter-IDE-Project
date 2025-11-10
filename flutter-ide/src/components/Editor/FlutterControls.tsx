import { useState } from 'react';
import { useFlutterStore } from '../../stores/flutterStore';
import { useFileExplorerStore } from '../../stores/fileExplorerStore';
import './FlutterControls.css';

export function FlutterControls() {
  const { workspaceRoot } = useFileExplorerStore();
  const { isRunning, startFlutter, stopFlutter, hotReload, hotRestart } = useFlutterStore();
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!workspaceRoot) {
      alert('Por favor, abra uma pasta Flutter primeiro');
      return;
    }

    setLoading(true);
    try {
      await startFlutter(workspaceRoot);
    } catch (error) {
      console.error('Failed to start Flutter:', error);
      alert('Erro ao iniciar Flutter. Verifique se o Flutter SDK está instalado.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await stopFlutter();
    } catch (error) {
      console.error('Failed to stop Flutter:', error);
      alert('Erro ao parar Flutter');
    } finally {
      setLoading(false);
    }
  };

  const handleHotReload = async () => {
    if (!isRunning) {
      alert('Flutter não está rodando');
      return;
    }

    try {
      await hotReload();
    } catch (error) {
      console.error('Failed to hot reload:', error);
      alert('Erro ao fazer Hot Reload');
    }
  };

  const handleHotRestart = async () => {
    if (!isRunning) {
      alert('Flutter não está rodando');
      return;
    }

    try {
      await hotRestart();
    } catch (error) {
      console.error('Failed to hot restart:', error);
      alert('Erro ao fazer Hot Restart');
    }
  };

  return (
    <div className="flutter-controls">
      {!isRunning ? (
        <button
          className="btn-flutter btn-run"
          onClick={handleRun}
          disabled={loading || !workspaceRoot}
          title="Executar Flutter (Chrome)"
        >
          {loading ? '⏳' : '▶️'} Run
        </button>
      ) : (
        <>
          <button
            className="btn-flutter btn-stop"
            onClick={handleStop}
            disabled={loading}
            title="Parar Flutter"
          >
            ⏹️ Stop
          </button>
          <button
            className="btn-flutter btn-reload"
            onClick={handleHotReload}
            disabled={loading}
            title="Hot Reload (r)"
          >
            🔄 Hot Reload
          </button>
          <button
            className="btn-flutter btn-restart"
            onClick={handleHotRestart}
            disabled={loading}
            title="Hot Restart (R)"
          >
            🔃 Hot Restart
          </button>
        </>
      )}
    </div>
  );
}
