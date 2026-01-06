import React, { useState, useRef, useEffect } from "react";
import "../styles/QRScanner.css";

const QRScanner = ({ onScanResult, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera. Please grant camera permissions.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      alert(
        "QR scanning captured! In production, this would decode the QR code and search for the product."
      );
      onClose();
    }
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="qr-scanner-header">
          <h2>Scan Product QR Code</h2>
          <button className="qr-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="qr-scanner-body">
          {error ? (
            <div className="qr-error">{error}</div>
          ) : (
            <>
              <div className="qr-video-container">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="qr-video"
                />
                <div className="qr-scan-frame"></div>
              </div>
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </>
          )}
        </div>

        <div className="qr-scanner-footer">
          <p>Position the QR code within the frame</p>
          <button
            className="qr-capture-btn"
            onClick={handleCapture}
            disabled={!scanning}
          >
            Capture & Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
