// Web NFC Integration & Tangible Hardware Bridge

export interface NfcScanEvent {
  serialNumber: string;
  message?: string;
  timestamp: number;
}

export type NfcScanListener = (event: NfcScanEvent) => void;

let activeAbortController: AbortController | null = null;
const scanListeners: Set<NfcScanListener> = new Set();

export function isWebNfcSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'NDEFReader' in window;
}

export async function startRealNfcScan(
  onScan: NfcScanListener,
  onError?: (err: Error) => void
): Promise<boolean> {
  if (!isWebNfcSupported()) {
    if (onError) onError(new Error('Web NFC is not supported on this browser or platform.'));
    return false;
  }

  try {
    // Stop any existing scan
    stopNfcScan();

    activeAbortController = new AbortController();
    // @ts-expect-error NDEFReader is not yet in standard DOM lib
    const ndef = new window.NDEFReader();
    await ndef.scan({ signal: activeAbortController.signal });

    ndef.onreading = (event: { serialNumber?: string }) => {
      const serial = event.serialNumber || '04:SIM:RANDOM:' + Math.random().toString(16).substring(2, 6).toUpperCase();
      const scanEvent: NfcScanEvent = {
        serialNumber: serial,
        timestamp: Date.now()
      };
      onScan(scanEvent);
      scanListeners.forEach(listener => listener(scanEvent));
    };

    ndef.onreadingerror = () => {
      if (onError) onError(new Error('Could not read NFC tag. Please position the fish token steadily.'));
    };

    return true;
  } catch (err) {
    if (onError && err instanceof Error) {
      onError(err);
    }
    return false;
  }
}

export function stopNfcScan() {
  if (activeAbortController) {
    activeAbortController.abort();
    activeAbortController = null;
  }
}

export function triggerSimulatedNfcScan(serialNumber: string, onScan?: NfcScanListener) {
  const scanEvent: NfcScanEvent = {
    serialNumber: serialNumber.trim().toUpperCase(),
    timestamp: Date.now()
  };
  if (onScan) {
    onScan(scanEvent);
  }
  scanListeners.forEach(listener => listener(scanEvent));
}

export function subscribeToNfcScans(listener: NfcScanListener) {
  scanListeners.add(listener);
  return () => {
    scanListeners.delete(listener);
  };
}
