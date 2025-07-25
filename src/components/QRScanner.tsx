import React, { useEffect, useRef, useState } from 'react';
import { fetchProductByBarcode, OFFProduct } from '../utils/openFoodFacts';

type BarcodeDetectorResult = { rawValue: string };
type BarcodeDetectorClass = new (options?: { formats?: string[] }) => {
  detect(video: HTMLVideoElement): Promise<BarcodeDetectorResult[]>;
};

interface QRScannerProps {
  onResult: (product: OFFProduct) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onResult, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const start = async () => {
      const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorClass }).BarcodeDetector;
      if (!Detector) {
        setError("Votre navigateur ne supporte pas la détection de codes-barres.");
        return;
      }
      const constraints = { video: { facingMode: 'environment' } };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        const detector = new Detector({ formats: ['ean_13', 'qr_code'] });
        const scan = async () => {
          if (!videoRef.current) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              const product = await fetchProductByBarcode(code);
              if (product) {
                onResult(product);
                onClose();
              }
            }
          } catch {
            // ignore
          }
          requestAnimationFrame(scan);
        };
        requestAnimationFrame(scan);
      } catch {
        setError('Impossible d\'accéder à la caméra');
      }
    };
    start();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [onResult, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4 w-full max-w-md">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Scanner un code-barres</h3>
          <button onClick={onClose} className="text-sm text-gray-500">Fermer</button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <video ref={videoRef} className="w-full rounded" />
      </div>
    </div>
  );
};

export default QRScanner;
