import { useEffect, useRef } from 'react';

interface BarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minLength?: number;
  maxTime?: number;
  enabled?: boolean;
}

/**
 * Custom hook to detect barcode scanner input
 * Barcode scanners typically input characters very quickly and end with Enter
 */
export const useBarcodeScanner = ({
  onScan,
  minLength = 3,
  maxTime = 100,
  enabled = true,
}: BarcodeScannerOptions) => {
  const barcodeBuffer = useRef<string>('');
  const lastKeyTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastKeyTime.current;

      // If too much time has passed, reset buffer
      if (timeDiff > maxTime && barcodeBuffer.current.length > 0) {
        barcodeBuffer.current = '';
      }

      // Update last key time
      lastKeyTime.current = currentTime;

      // Check if it's Enter key (barcode scanners typically end with Enter)
      if (e.key === 'Enter') {
        e.preventDefault();
        
        if (barcodeBuffer.current.length >= minLength) {
          // Trigger the scan callback
          onScan(barcodeBuffer.current);
        }
        
        // Reset buffer
        barcodeBuffer.current = '';
        return;
      }

      // Ignore special keys and focus on printable characters
      if (
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        // Skip if user is typing in an input/textarea
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }

        // Add character to buffer
        barcodeBuffer.current += e.key;

        // Clear timeout if exists
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        // Set timeout to clear buffer if no more keys come
        timeoutRef.current = setTimeout(() => {
          barcodeBuffer.current = '';
        }, maxTime * 2);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, onScan, minLength, maxTime]);
};

