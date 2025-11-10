import { useEffect, useRef } from 'react';
import { useFlutterStore } from '../../stores/flutterStore';
import './Console.css';

export function Console() {
  const { logs, errors, clearLogs } = useFlutterStore();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, errors]);

  return (
    <div className="console">
      <div className="console-header">
        <h4>Console Output</h4>
        <button className="btn-clear-console" onClick={clearLogs} title="Limpar console">
          🗑️ Limpar
        </button>
      </div>
      <div className="console-body">
        {logs.length === 0 && errors.length === 0 ? (
          <div className="console-empty">
            <p>Aguardando logs do Flutter...</p>
          </div>
        ) : (
          <div className="console-lines">
            {logs.map((log, index) => (
              <div key={`log-${index}`} className="console-line log">
                <span className="line-icon">ℹ️</span>
                <span className="line-text">{log}</span>
              </div>
            ))}
            {errors.map((error, index) => (
              <div key={`error-${index}`} className="console-line error">
                <span className="line-icon">❌</span>
                <span className="line-text">{error}</span>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
