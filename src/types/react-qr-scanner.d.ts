// src/types/react-qr-scanner.d.ts
declare module 'react-qr-scanner' {
    import * as React from 'react';

    interface QrCodeScannerProps {
        delay?: number;
        style?: React.CSSProperties;
        onError?: (error: any) => void;
        onScan?: (data: string | null) => void;
        facingMode?: string;
        onLoad?: () => void;
        constraints: any;
    }

    const QrReader: React.FC<QrCodeScannerProps>;
    export default QrReader;
}
