import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useFlutterStore } from '../../stores/flutterStore';
import './PreviewPanel.css';

type DeviceType = 'iphone-14' | 'pixel-7' | 'ipad' | 'desktop';

interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  frame: boolean;
}

const DEVICES: Record<DeviceType, DeviceConfig> = {
  'iphone-14': {
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    frame: true,
  },
  'pixel-7': {
    name: 'Pixel 7',
    width: 412,
    height: 915,
    frame: true,
  },
  'ipad': {
    name: 'iPad Pro 11"',
    width: 834,
    height: 1194,
    frame: true,
  },
  'desktop': {
    name: 'Desktop',
    width: 1280,
    height: 720,
    frame: false,
  },
};

export const PreviewPanel: React.FC = () => {
  const { isRunning, previewUrl } = useFlutterStore();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>('iphone-14');
  const [showQR, setShowQR] = useState(false);
  const [localIP, setLocalIP] = useState<string>('localhost');
  const [zoom, setZoom] = useState(1);

  const device = DEVICES[selectedDevice];
  const urlForQR = previewUrl?.replace('localhost', localIP) || '';

  // Detect local IP for QR code
  useEffect(() => {
    // Try to get local IP from WebRTC
    const detectLocalIP = async () => {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        pc.onicecandidate = (ice) => {
          if (!ice || !ice.candidate || !ice.candidate.candidate) return;
          const ipRegex = /([0-9]{1,3}\.){3}[0-9]{1,3}/;
          const match = ipRegex.exec(ice.candidate.candidate);
          if (match) {
            setLocalIP(match[0]);
            pc.close();
          }
        };
      } catch (error) {
        console.error('Failed to detect local IP:', error);
      }
    };

    if (isRunning) {
      detectLocalIP();
    }
  }, [isRunning]);

  if (!isRunning) {
    return (
      <div className="preview-panel">
        <div className="preview-empty">
          <div className="preview-empty-icon">📱</div>
          <h3>No Preview Available</h3>
          <p>Run your Flutter project to see the preview</p>
          <div className="preview-hint">
            Click the <strong>▶️ Run</strong> button to start
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value as DeviceType)}
          className="device-selector"
        >
          {Object.entries(DEVICES).map(([key, config]) => (
            <option key={key} value={key}>
              {config.name}
            </option>
          ))}
        </select>

        <div className="preview-controls">
          <button
            className={`control-btn ${showQR ? 'active' : ''}`}
            onClick={() => setShowQR(!showQR)}
            title="Show QR Code for Mobile Testing"
          >
            📱 QR
          </button>

          <div className="zoom-controls">
            <button
              className="control-btn"
              onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
              title="Zoom Out"
            >
              −
            </button>
            <span className="zoom-label">{Math.round(zoom * 100)}%</span>
            <button
              className="control-btn"
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              title="Zoom In"
            >
              +
            </button>
          </div>

          <button
            className="control-btn"
            onClick={() => setZoom(1)}
            title="Reset Zoom"
          >
            ↺
          </button>
        </div>
      </div>

      <div className="preview-content">
        {showQR ? (
          <div className="qr-section">
            <h3>Test on Your Mobile Device</h3>
            <div className="qr-code-wrapper">
              <QRCode
                value={urlForQR}
                size={256}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
            <div className="qr-instructions">
              <p className="qr-url">{urlForQR}</p>
              <ol>
                <li>Scan this QR code with your phone camera</li>
                <li>Make sure your phone is on the same network</li>
                <li>The app will open in your mobile browser</li>
              </ol>
              <div className="qr-note">
                💡 <strong>Note:</strong> Your computer's IP is <code>{localIP}</code>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`preview-viewport ${device.frame ? 'with-frame' : ''}`}
            style={{
              transform: `scale(${zoom})`,
            }}
          >
            {device.frame && (
              <div
                className={`device-frame device-${selectedDevice}`}
                style={{
                  width: `${device.width}px`,
                  height: `${device.height}px`,
                }}
              >
                <div className="device-notch"></div>
                <iframe
                  src={previewUrl || ''}
                  className="preview-iframe"
                  title="Flutter Preview"
                  sandbox="allow-same-origin allow-scripts allow-forms"
                />
              </div>
            )}

            {!device.frame && (
              <iframe
                src={previewUrl || ''}
                className="preview-iframe preview-iframe-fullscreen"
                title="Flutter Preview"
                sandbox="allow-same-origin allow-scripts allow-forms"
                style={{
                  width: `${device.width}px`,
                  height: `${device.height}px`,
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
